exports.handler = async function(event, context) {
    const { Octokit } = await import("@octokit/rest");
    const yaml = await import("js-yaml");

    // 1. Authenticate with GitHub
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const repoOwner = "bergerjacob"; // Your GitHub username
    const repoName = "dicksteinpracticecup-website"; // Your repo name
    const filePath = "_data/winners.yml";

    try {
        // 2. Get the current winners.yml file from GitHub
        const { data: fileData } = await octokit.repos.getContent({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
        });

        const content = Buffer.from(fileData.content, "base64").toString("utf8");
        const winners = yaml.load(content);

        // 3. Prepare the new winner data from the fetch request
        const formPayload = JSON.parse(event.body).payload.data;
        const newWinner = {
            name: formPayload.name,
            week: formPayload.week,
            series: parseInt(formPayload.series, 10),
            current: true,
        };

        // 4. Update the winners list
        const currentWinner = winners.find(w => w.current === true);
        if (currentWinner) {
            currentWinner.current = false;
        }
        winners.unshift(newWinner);

        const updatedContent = yaml.dump(winners);
        const updatedContentBase64 = Buffer.from(updatedContent).toString("base64");

        // 5. Commit the updated file back to GitHub
        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            message: `feat: Update champion to ${newWinner.name}`,
            content: updatedContentBase64,
            sha: fileData.sha,
        });

        return {
            statusCode: 200,
            body: "Champion updated successfully!",
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: `Error updating champion: ${error.message}`,
        };
    }
};

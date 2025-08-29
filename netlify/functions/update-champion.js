const { Octokit } = await import("@octokit/rest");
const yaml = require("js-yaml");

const repoOwner = "bergerjacob";
const repoName = "dicksteinpracticecup-website";

exports.handler = async function(event, context) {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    try {
        const fields = JSON.parse(event.body);
        const winnersFilePath = "_data/winners.yml";

        const { data: winnersFile } = await octokit.repos.getContent({
            owner: repoOwner, repo: repoName, path: winnersFilePath
        });
        const winners = yaml.load(Buffer.from(winnersFile.content, "base64").toString("utf8"));

        const newWinner = {
            name: fields.name,
            week: fields.week,
            series: parseInt(fields.series, 10),
            current: true,
        };

        // Set previous winner to not current
        const currentWinner = winners.find(w => w.current === true);
        if (currentWinner) {
            currentWinner.current = false;
        }

        winners.unshift(newWinner); // Add new winner to the top

        const updatedWinnersContent = Buffer.from(yaml.dump(winners)).toString("base64");

        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner, repo: repoName, path: winnersFilePath,
            message: `feat: Update champion to ${newWinner.name}`,
            content: updatedWinnersContent, sha: winnersFile.sha,
        });

        return { statusCode: 200, body: "Champion updated successfully!" };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: `Error: ${error.message}` };
    }
};

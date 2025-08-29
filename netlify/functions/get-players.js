const { Octokit } = await import("@octokit/rest");
const yaml = require("js-yaml");

exports.handler = async function(event, context) {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const repoOwner = "bergerjacob";
    const repoName = "dicksteinpracticecup-website";
    const filePath = "_data/players.yml";

    try {
        const { data: fileData } = await octokit.repos.getContent({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
        });

        const content = Buffer.from(fileData.content, "base64").toString("utf8");
        const players = yaml.load(content);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(players),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: `Error fetching players: ${error.message}`,
        };
    }
};

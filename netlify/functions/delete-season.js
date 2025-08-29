const yaml = require("js-yaml");

const repoOwner = "bergerjacob";
const repoName = "dicksteinpracticecup-website";

// Helper function to extract front matter
const getDownloadLink = (content) => {
    const match = content.match(/---([\s\S]*?)---/);
    if (!match) return null;
    const frontMatter = yaml.load(match[1]);
    return frontMatter.download_link;
};

exports.handler = async function(event, context) {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    try {
        const { season_name } = JSON.parse(event.body);
        if (!season_name) {
            throw new Error("Season name is required.");
        }

        const mdPath = `history/${season_name}.md`;
        const ymlPath = `_data/seasons/${season_name}.yml`;

        // 1. Get the markdown file to find the excel download link and get the SHA
        const { data: mdFile } = await octokit.repos.getContent({ owner: repoOwner, repo: repoName, path: mdPath });
        const mdContent = Buffer.from(mdFile.content, 'base64').toString('utf8');
        const excelPath = getDownloadLink(mdContent);

        if (!excelPath) {
            throw new Error(`Could not find download_link in ${mdPath}`);
        }

        // 2. Get the SHA for the YML and Excel files
        const { data: ymlFile } = await octokit.repos.getContent({ owner: repoOwner, repo: repoName, path: ymlPath });
        const { data: excelFile } = await octokit.repos.getContent({ owner: repoOwner, repo: repoName, path: excelPath.substring(1) });

        // 3. Delete all three files
        const commitMessage = `chore: Delete season ${season_name}`;

        await octokit.repos.deleteFile({ owner: repoOwner, repo: repoName, path: mdPath, message: commitMessage, sha: mdFile.sha });
        await octokit.repos.deleteFile({ owner: repoOwner, repo: repoName, path: ymlPath, message: commitMessage, sha: ymlFile.sha });
        await octokit.repos.deleteFile({ owner: repoOwner, repo: repoName, path: excelPath.substring(1), message: commitMessage, sha: excelFile.sha });

        return {
            statusCode: 200,
            body: `Successfully deleted season ${season_name}.`,
        };
    } catch (error) {
        console.error("Error deleting season:", error);
        return {
            statusCode: 500,
            body: `Error deleting season: ${error.message}`,
        };
    }
};

const yaml = require("js-yaml");
const Busboy = require("busboy");

const repoOwner = "bergerjacob";
const repoName = "dicksteinpracticecup-website";

const parseMultipartForm = (event) => new Promise((resolve) => {
    const fields = {};
    let fileData = {};
    const busboy = Busboy({ headers: { "content-type": event.headers["content-type"] } });
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        let buffer = Buffer.alloc(0);
        file.on("data", (data) => buffer = Buffer.concat([buffer, data]));
        file.on("end", () => fileData = { content: buffer });
    });
    busboy.on("field", (fieldname, val) => fields[fieldname] = val);
    busboy.on("finish", () => resolve({ fields, fileData }));
    busboy.end(Buffer.from(event.body, "base64"));
});

exports.handler = async function(event, context) {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    try {
        const { fields, fileData } = await parseMultipartForm(event);
        const playerName = fields.name;
        const description = fields.description;
        const slug = playerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        if (!playerName || !description || !fileData.content) {
            throw new Error("Missing player name, description, or photo.");
        }

        // 1. Upload the player's photo
        const imagePath = `assets/images/players/${slug}.jpg`;
        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner, repo: repoName, path: imagePath,
            message: `feat: Add photo for new player ${playerName}`,
            content: fileData.content.toString("base64"),
        });

        // 2. Add new player to _data/players.yml
        const playersFilePath = "_data/players.yml";
        const { data: playersFile } = await octokit.repos.getContent({ owner: repoOwner, repo: repoName, path: playersFilePath });
        const players = yaml.load(Buffer.from(playersFile.content, "base64").toString("utf8"));

        if (players.some(p => p.name === playerName)) {
            throw new Error(`Player "${playerName}" already exists.`);
        }

        players.push({ name: playerName, image: `/${imagePath}` });
        players.sort((a, b) => a.name.localeCompare(b.name)); // Sort players alphabetically
        const updatedPlayersContent = Buffer.from(yaml.dump(players)).toString("base64");
        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner, repo: repoName, path: playersFilePath,
            message: `feat: Add ${playerName} to players list`,
            content: updatedPlayersContent, sha: playersFile.sha,
        });

        // 3. Create the player's markdown page file with full layout
        const playerPagePath = `_players/${slug}.md`;
        const playerPageContent = `---
layout: default
title: "${playerName}"
name: "${playerName}"
image: /${imagePath}
---

<h1>${playerName}</h1>

<div class="content-card">
    <img src="{{ page.image | relative_url }}" alt="Photo of ${playerName}" style="width: 250px; height: auto; float: left; margin-right: 25px; margin-bottom: 10px; border-radius: 8px;">
    <p>${description.replace(/\n/g, '</p><p>')}</p>
    <div style="clear: both;"></div>
</div>
`;
        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner, repo: repoName, path: playerPagePath,
            message: `feat: Create player page for ${playerName}`,
            content: Buffer.from(playerPageContent).toString("base64"),
        });

        return { statusCode: 200, body: "Player added successfully!" };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: `Error: ${error.message}` };
    }
};

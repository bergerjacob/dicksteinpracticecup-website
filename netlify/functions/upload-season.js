const { Octokit } = await import("@octokit/rest");
const yaml = require("js-yaml");
const xlsx = require("xlsx");
const Busboy = require("busboy");

const repoOwner = "bergerjacob";
const repoName = "dicksteinpracticecup-website";

// Helper to parse multipart form data
const parseMultipartForm = (event) => new Promise((resolve) => {
    const fields = {};
    let fileData = {};
    const busboy = Busboy({ headers: { "content-type": event.headers["content-type"] || event.headers["Content-Type"] } });
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        const buffers = [];
        file.on("data", (data) => buffers.push(data));
        file.on("end", () => fileData = { content: Buffer.concat(buffers), filename: filename.filename });
    });
    busboy.on("field", (fieldname, val) => fields[fieldname] = val);
    busboy.on("finish", () => resolve({ fields, fileData }));
    busboy.end(Buffer.from(event.body, "base64"));
});

exports.handler = async function(event, context) {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    try {
        const { fields, fileData } = await parseMultipartForm(event);
        const seasonName = fields.season_name; // e.g., "late-2025"

        if (!seasonName || !fileData.content) {
            throw new Error("Season name or file is missing.");
        }

        // --- Step 1: Upload the original Excel file for downloading ---
        const downloadPath = `assets/downloads/${fileData.filename}`;
        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner, repo: repoName, path: downloadPath,
            message: `feat: Upload season excel file for ${seasonName}`,
            content: fileData.content.toString("base64"),
        });

        // --- Step 2: Parse Excel and commit the new YAML data file ---
        const workbook = xlsx.read(fileData.content);
        const sheetName = workbook.SheetNames[0];
        const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const seasonData = jsonData.map(row => ({
            date: row.Date,
            winner: row.Winner,
            series: row.Series
        }));

        const yamlContent = yaml.dump(seasonData);
        const yamlPath = `_data/seasons/${seasonName}.yml`;
        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner, repo: repoName, path: yamlPath,
            message: `feat: Add season data for ${seasonName}`,
            content: Buffer.from(yamlContent).toString("base64"),
        });

        // --- Step 3: Create the season's markdown page ---
        const [period, year] = seasonName.split('-');
        const title = `${period.charAt(0).toUpperCase() + period.slice(1)} ${year} Season Results`;
        const seasonNameDisplay = `${period.charAt(0).toUpperCase() + period.slice(1)} ${year} Season`;

        const markdownContent = `---
layout: season
title: ${title}
season_name: ${seasonNameDisplay}
data_file: ${seasonName}
download_link: /${downloadPath}
---
`;
        const markdownPath = `history/${seasonName}.md`;
        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner, repo: repoName, path: markdownPath,
            message: `feat: Create season page for ${seasonName}`,
            content: Buffer.from(markdownContent).toString("base64"),
        });

        return {
            statusCode: 200,
            body: "Season processed and page created successfully!",
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: `Error uploading season data: ${error.message}`,
        };
    }
};

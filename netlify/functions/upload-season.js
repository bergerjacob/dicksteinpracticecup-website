import yaml from "js-yaml";
import xlsx from "xlsx";
import Busboy from "busboy";

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
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    try {
        const { fields, fileData } = await parseMultipartForm(event);
        const seasonName = fields.season_name;

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
        // The `cellDates: true` option is critical for parsing dates correctly.
        const workbook = xlsx.read(fileData.content, { cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // This now dynamically creates an array of objects based on the header row.
        const seasonData = xlsx.utils.sheet_to_json(worksheet);

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

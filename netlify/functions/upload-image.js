import Busboy from "busboy";

const repoOwner = "bergerjacob";
const repoName = "dicksteinpracticecup-website";

// Helper to parse multipart form data
const parseMultipartForm = (event) => new Promise((resolve) => {
    const fields = {};
    let fileData = {};
    const busboy = Busboy({ headers: { "content-type": event.headers["content-type"] } });
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        let buffer = Buffer.alloc(0);
        file.on("data", (data) => buffer = Buffer.concat([buffer, data]));
        file.on("end", () => fileData = { content: buffer, filename: filename.filename });
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
        const gallery = fields.gallery;

        if (!gallery || !fileData.content) {
            throw new Error("Missing gallery name or photo.");
        }

        // Sanitize the original filename and prepend the date for sorting
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const sanitizedFilename = fileData.filename.replace(/[^a-zA-Z0-9.\-_]/g, '-').replace(/-+/g, '-');
        const newFilename = `${date}-${sanitizedFilename}`;

        const filePath = `assets/images/${gallery}/${newFilename}`;
        const contentBase64 = fileData.content.toString("base64");

        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            message: `feat: Add new image to ${gallery} gallery`,
            content: contentBase64,
        });

        return {
            statusCode: 200,
            body: "Image uploaded successfully!",
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: `Error uploading image: ${error.message}`,
        };
    }
};

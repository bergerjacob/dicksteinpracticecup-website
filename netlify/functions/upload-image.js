const { Octokit } = await import("@octokit/rest");
const { v4: uuidv4 } = await import("uuid");
const Busboy = await import("busboy");

// Helper to parse multipart form data
const parseMultipartForm = (event) => {
    return new Promise((resolve) => {
        const fields = {};
        let fileData = {};

        const busboy = Busboy({
            headers: { "content-type": event.headers["content-type"] },
        });

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            let buffer = Buffer.alloc(0);
            file.on("data", (data) => {
                buffer = Buffer.concat([buffer, data]);
            });
            file.on("end", () => {
                fileData = {
                    content: buffer,
                    filename: filename.filename,
                    contentType: mimetype,
                };
            });
        });

        busboy.on("field", (fieldname, val) => {
            fields[fieldname] = val;
        });

        busboy.on("finish", () => {
            resolve({ fields, fileData });
        });

        busboy.end(Buffer.from(event.body, "base64"));
    });
};

exports.handler = async function(event, context) {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const repoOwner = "bergerjacob";
    const repoName = "dicksteinpracticecup-website";

    try {
        const { fields, fileData } = await parseMultipartForm(event);
        const gallery = fields.gallery;

        if (!["winners-gallery", "trophy-locations"].includes(gallery)) {
            throw new Error("Invalid gallery specified.");
        }

        if (!fileData.content) {
            throw new Error("No file was uploaded.");
        }

        // Create a sortable and unique filename
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const uniqueId = uuidv4().split('-')[0]; // Short unique ID
        const extension = fileData.filename.split('.').pop();
        const newFilename = `${date}-${uniqueId}.${extension}`;

        const filePath = `assets/images/${gallery}/${newFilename}`;
        const contentBase64 = fileData.content.toString("base64");

        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            message: `feat: Add new image to ${gallery}`,
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

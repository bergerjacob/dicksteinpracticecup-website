exports.handler = async function(event, context) {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const repoOwner = "bergerjacob";
    const repoName = "dicksteinpracticecup-website";
    const path = "_data/seasons";

    try {
        const { data: files } = await octokit.repos.getContent({
            owner: repoOwner,
            repo: repoName,
            path: path,
        });

        const seasonNames = files.map(file => file.name.replace('.yml', ''));

        // Custom sort for chronological order
        seasonNames.sort((a, b) => {
            const [aPeriod, aYear] = a.split('-');
            const [bPeriod, bYear] = b.split('-');

            if (aYear !== bYear) {
                return aYear.localeCompare(bYear); // Sort by year first
            }
            // If years are the same, 'early' comes before 'late'
            return aPeriod.localeCompare(bPeriod);
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(seasonNames),
        };
    } catch (error) {
        console.error(error);
        if (error.status === 404) {
            return { // Return empty list if directory doesn't exist yet
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([]),
            };
        }
        return {
            statusCode: 500,
            body: `Error fetching seasons: ${error.message}`,
        };
    }
};

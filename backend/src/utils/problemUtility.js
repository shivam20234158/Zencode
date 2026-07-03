import axios from "axios";

const languageMap = {
    "c++": 54,
    "cpp": 54,
    "java": 62,
    "javascript": 63,
    "js": 63,
    "python": 71,
    "python3": 71,
};

function getLanguageById(language) {
    return languageMap[language.toLowerCase()];
}

async function submitBatch(submissions) {
    try {

        const { data } = await axios.post(
            `${process.env.JUDGE0_URL}/submissions/batch`,
            {
                submissions,
            },
            {
                params: {
                    base64_encoded: false,
                },
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": process.env.JUDGE0_KEY,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                },
            }
        );

        return data;

    } catch (err) {

        console.error("Judge0 Error:", err.response?.data || err.message);

        return [];
    }
}
async function submitToken(tokens) {

    while (true) {

        try {

            const { data } = await axios.get(
                `${process.env.JUDGE0_URL}/submissions/batch`,
                {
                    params: {
                        tokens: tokens.join(","),
                        base64_encoded: false,
                    },
                    headers: {
                        "X-RapidAPI-Key": process.env.JUDGE0_KEY,
                        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                    },
                }
            );

            const results = data.submissions;

            const allCompleted = results.every((result) => {

                const statusId = result.status?.id;

                return statusId !== 1 && statusId !== 2;

            });

            if (allCompleted) {
                return results;
            }

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

        } catch (err) {

            console.error(
                "Judge0 Error:",
                err.response?.data || err.message
            );

            return [];
        }
    }
}
export {
    getLanguageById,
    submitBatch,
    submitToken,
};
import { GoogleGenAI } from "@google/genai";

const solveDoubt = async (req, res) => {

    try {

        const {
            messages,
            title,
            description,
            testCases,
            startCode,
        } = req.body;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_KEY,
        });

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: messages,

            config: {

                systemInstruction: `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems.

CURRENT PROBLEM

Title:
${title}

Description:
${description}

Examples:
${JSON.stringify(testCases)}

Starter Code:
${JSON.stringify(startCode)}

YOUR RESPONSIBILITIES

1. Give hints without revealing the full solution unless explicitly asked.
2. Review submitted code and explain bugs.
3. Explain optimal approaches.
4. Compare multiple approaches.
5. Explain time and space complexity.
6. Help generate edge test cases.
7. Answer ONLY questions related to this problem.

If the user asks anything unrelated to this DSA problem, politely refuse and redirect them back to the current problem.

Always explain concepts clearly and encourage learning instead of simply giving answers.
`,

            },

        });

        return res.status(200).json({
            message: response.text,
        });

    } catch (err) {

        console.error(err);

        if (
            err?.status === 429 ||
            err?.message?.includes("429") ||
            err?.message?.includes("RESOURCE_EXHAUSTED")
        ) {

            return res.status(429).json({
                message:
                    "Gemini quota exceeded. Please try again later.",
            });

        }

        return res.status(500).json({
            message:
                err.message || "AI service unavailable",
        });

    }

};

export default solveDoubt;
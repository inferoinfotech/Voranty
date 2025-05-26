const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-1219",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

exports.analyzeWithGemini = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.file;
        console.log("Uploaded file:", file);

        const prompt = `Extract and analyze the data from this image in a structured way. The required keys are: merchant, amount, date, warrantyDate, description, and category. Provide the output in JSON format. If a key is not present in the image, set its value to null.`;

        const parts = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: file.mimetype,
                    data: file.buffer.toString("base64"),
                },
            },
        ];

        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
        });

        const analysisResult = result.response.text();
        console.log("Gemini Raw Response:", analysisResult);

        let parsedAnalysis;
        try {
            const jsonStartIndex = analysisResult.indexOf("{");
            const jsonEndIndex = analysisResult.lastIndexOf("}");

            if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonStartIndex < jsonEndIndex) {
                const jsonString = analysisResult.substring(jsonStartIndex, jsonEndIndex + 1);
                parsedAnalysis = JSON.parse(jsonString);
            } else {
                throw new Error("No valid JSON found in response");
            }
        } catch (error) {
            console.error("Error parsing Gemini response:", error);
            return res.status(500).json({ error: "Could not parse Gemini response" });
        }

        console.log("Parsed Analysis Response:", parsedAnalysis);

        return res.json({ success: true, data: parsedAnalysis });

    } catch (error) {
        console.error("An error occurred during analysis:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

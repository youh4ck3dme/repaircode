const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "API_KEY_MISSING");

const analysisSchema = {
    type: SchemaType.OBJECT,
    properties: {
        summary: { type: SchemaType.STRING },
        issues: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    id: { type: SchemaType.STRING },
                    file: { type: SchemaType.STRING },
                    line: { type: SchemaType.NUMBER },
                    severity: { type: SchemaType.STRING, enum: ["low", "medium", "high", "critical"] },
                    type: { type: SchemaType.STRING, enum: ["security", "performance", "style", "bug"] },
                    message: { type: SchemaType.STRING },
                    suggested_fix: { type: SchemaType.STRING }
                },
                required: ["id", "file", "severity", "message", "suggested_fix"]
            }
        }
    },
    required: ["summary", "issues"]
};

const patchSchema = {
    type: SchemaType.OBJECT,
    properties: {
        patches: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    file: { type: SchemaType.STRING },
                    changes: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                type: { type: SchemaType.STRING, enum: ["insert", "delete", "replace"] },
                                startLine: { type: SchemaType.NUMBER },
                                endLine: { type: SchemaType.NUMBER },
                                newCode: { type: SchemaType.STRING }
                            },
                            required: ["type", "startLine"]
                        }
                    }
                },
                required: ["file", "changes"]
            }
        }
    },
    required: ["patches"]
};

const getModel = (instruction, schema) => {
    const config = {
        model: "gemini-2.0-flash",
        systemInstruction: instruction,
    };

    if (schema) {
        config.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: schema,
        };
    }

    return genAI.getGenerativeModel(config);
};

module.exports = {
    getModel,
    analysisSchema,
    patchSchema
};

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "API_KEY_MISSING");

export const analysisSchema = {
    type: "object",
    properties: {
        summary: { type: "string" },
        issues: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    file: { type: "string" },
                    line: { type: "number" },
                    severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
                    type: { type: "string", enum: ["security", "performance", "style", "bug"] },
                    message: { type: "string" },
                    suggested_fix: { type: "string" }
                },
                required: ["id", "file", "severity", "message", "suggested_fix"]
            }
        }
    },
    required: ["summary", "issues"]
};

export const patchSchema = {
    type: "object",
    properties: {
        patches: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    file: { type: "string" },
                    changes: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                type: { type: "string", enum: ["insert", "delete", "replace"] },
                                startLine: { type: "number" },
                                endLine: { type: "number" },
                                newCode: { type: "string" }
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

export const getModel = (instruction, schema) => {
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

export async function callGemini(instruction, prompt, schema) {
    const model = getModel(instruction, schema);
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
}

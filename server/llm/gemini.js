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
                    line: { type: "integer", nullable: true },
                    severity: { type: "string", enum: ["low", "medium", "high"] },
                    message: { type: "string" }
                },
                required: ["id", "file", "message", "severity"]
            }
        }
    },
    required: ["summary", "issues"]
};

export const fixesSchema = {
    type: "object",
    properties: {
        fixes: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    issueId: { type: "string" },
                    description: { type: "string" },
                    impact: { type: "string" }
                },
                required: ["issueId", "description"]
            }
        }
    },
    required: ["fixes"]
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
                    newFile: { type: "boolean" },
                    changes: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                type: { type: "string", enum: ["insert", "delete", "replace"] },
                                startLine: { type: "integer" },
                                endLine: { type: "integer", nullable: true },
                                newCode: { type: "string" }
                            },
                            required: ["type", "startLine", "newCode"]
                        }
                    }
                },
                required: ["file", "changes"]
            }
        }
    },
    required: ["patches"]
};

export const architectSchema = {
    type: "object",
    properties: {
        summary: { type: "string" },
        refactors: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    type: { type: "string" },
                    file: { type: "string" },
                    lines: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] },
                    suggestion: { type: "string" }
                },
                required: ["id", "type", "file", "suggestion", "severity"]
            }
        }
    },
    required: ["summary", "refactors"]
};

export const architectFixesSchema = {
    type: "object",
    properties: {
        actions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    refactorId: { type: "string" },
                    steps: {
                        type: "array",
                        items: { type: "string" }
                    }
                },
                required: ["refactorId", "steps"]
            }
        }
    },
    required: ["actions"]
};

export const getModel = (instruction, schema) => {
    const config = {
        model: "gemini-2.5-flash",
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

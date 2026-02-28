import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function loadSchema(name) {
    const file = path.join(__dirname, "..", "schema", name);
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

const analysisSchema = loadSchema("analysis.json");
const fixesSchema = loadSchema("fixes.json");
const patchesSchema = loadSchema("patches.json");

export const analysisValidate = ajv.compile(analysisSchema);
export const fixesValidate = ajv.compile(fixesSchema);
export const patchValidate = ajv.compile(patchesSchema);

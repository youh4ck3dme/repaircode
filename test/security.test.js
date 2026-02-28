import { expect, test, describe, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import sandboxProxy from '../server/routes/sandbox.proxy';
import fs from 'fs';
import path from 'path';

// Setup a mini express app for testing the proxy in isolation
const app = express();
app.use(express.json());
app.use('/api/proxy', sandboxProxy);

describe('Proxy Security & Masking', () => {

    test('diagnostics endpoint rejects requests without files', async () => {
        const res = await request(app).post('/api/proxy/diagnostics').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("No file uploaded");
    });

    test('scan endpoint rejects requests without manifests', async () => {
        const res = await request(app).post('/api/proxy/scan').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("No manifest uploaded");
    });

    test('status endpoint handles missing job IDs', async () => {
        // This relies on the fetch mock or real endpoint behavior
        // For unit testing proxy logic, we verify it routes correctly
        const res = await request(app).get('/api/proxy/status/invalid-id');
        expect(res.status).toBe(500); // Because fetch fails for invalid/mocked environment
    });

    // Note: Real masking logic in sandbox.proxy.js uses fs.readFileSync(req.file.path)
    // To test this deeply, we would mock fs or provide a real temp file.
});

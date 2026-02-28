/**
 * @vitest-environment node
 */
import request from 'supertest';
import { expect, test } from 'vitest';
import app from '../server/index.js';
import { beforeAll } from 'vitest';

beforeAll(() => {
    process.env.GEMINI_API_KEY = '';
});

test('GET /health endpoint returns ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
});

test('POST /api/analyze endpoint initializes a job', async () => {
    const res = await request(app)
        .post('/api/analyze')
        .attach('zip', Buffer.from('PK\x03\x04'), 'empty.zip'); // Mock minimal ZIP

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('jobId');
});

test('GET /api/status/:jobId returns job progress', async () => {
    // 1. Create a job
    const createRes = await request(app)
        .post('/api/analyze')
        .attach('zip', Buffer.from('PK\x03\x04'), 'empty.zip');

    const { jobId } = createRes.body;

    // 2. Check status
    const res = await request(app).get(`/api/status/${jobId}`);
    expect(res.status).toBe(200);
    expect(['pending', 'running', 'done', 'failed']).toContain(res.body.status);
});

test('POST /api/patch handles patching requests', async () => {
    // 1. Create a job
    const createRes = await request(app)
        .post('/api/analyze')
        .attach('zip', Buffer.from('PK\x03\x04'), 'empty.zip');

    const { jobId } = createRes.body;

    // 2. Request patch
    const res = await request(app)
        .post('/api/patch')
        .send({ jobId, fixes: [] });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
});

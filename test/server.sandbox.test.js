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

test('POST /api/pipeline handles requests in simulation mode', async () => {
    // We send a mock request to the pipeline endpoint
    const res = await request(app)
        .post('/api/pipeline')
        .send({ files: [], stage: 'analyzer' });

    expect(res.status).toBe(200);
    // It should either return a simulation response or a success based on API key presence
    if (res.body.simulation) {
        expect(res.body.message).toContain('API Key missing');
    } else {
        expect(res.body).toHaveProperty('success', true);
    }
});

/* global Buffer */
test('POST /api/sandbox/diagnostics endpoint returns expected keys', async () => {
    const res = await request(app)
        .post('/api/sandbox/diagnostics')
        .attach('file', Buffer.from(''), 'dummy.zip');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('language_stack');
    expect(res.body).toHaveProperty('five_key_files_to_review');
});

test('POST /api/sandbox/scan returns vulnerability scan results', async () => {
    const res = await request(app).post('/api/sandbox/scan');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('vulnerabilities');
    expect(res.body.summary).toHaveProperty('total_vulns');
});

test('POST /api/pipeline handles factory stage', async () => {
    const res = await request(app)
        .post('/api/pipeline')
        .send({ files: [], stage: 'factory' });
    expect(res.status).toBe(200);
    if (res.body.simulation) {
        expect(res.body.message).toContain('API Key missing');
    } else {
        expect(res.body.success).toBe(true);
    }
});

test('POST /api/pipeline handles polisher stage', async () => {
    const res = await request(app)
        .post('/api/pipeline')
        .send({ files: [], stage: 'polisher' });
    expect(res.status).toBe(200);
    if (res.body.simulation) {
        expect(res.body.message).toContain('API Key missing');
    } else {
        expect(res.body.success).toBe(true);
    }
});

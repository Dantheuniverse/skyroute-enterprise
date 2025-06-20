import request from 'supertest';
import { jest } from '@jest/globals';
import fs from 'node:fs';

jest.mock('child_process', () => ({
  execSync: () => 'cloudflared version test'
}));

jest.mock('../../app/backend/cloudflare-tunnel.js', () => {
  return {
    CloudflaredTunnel: class {
      start() {}
      stop() {}
    }
  };
});

let app, server;

beforeAll(async () => {
  fs.mkdirSync('/config', { recursive: true });
  try { fs.unlinkSync('/config/config.json'); } catch {}
  const mod = await import('../../app/backend/app.js');
  app = mod.default || mod;
  server = app.listen(0);
});

afterAll(() => {
  server.close();
});

test('GET /config returns default config', async () => {
  const res = await request(server).get('/config');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ token: '', start: false });
});

test('GET /version returns string', async () => {
  const res = await request(server).get('/version');
  expect(res.status).toBe(200);
  expect(res.text).toContain('cloudflared version test');
});

test('POST /start with true returns Started', async () => {
  const res = await request(server)
    .post('/start')
    .send({ start: true })
    .set('Content-Type', 'application/json');
  expect(res.status).toBe(200);
  expect(res.text).toBe('Started');
});

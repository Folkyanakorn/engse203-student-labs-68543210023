import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';

/**
 * Integration test — ยิง HTTP จริงผ่านทุกชั้น: route → controller → service → SQLite
 *
 * ย้ายมาจาก tests/api.test.js ของสัปดาห์ 10 (node:test → Vitest)
 *   assert.equal(a, b)  →  expect(a).toBe(b)
 *   assert.ok(x)        →  expect(x).toBe(true)
 *   before(...)         →  beforeEach(...)   ← ฐานข้อมูลใหม่ทุกข้อ
 *
 * vitest.config.js ตั้ง DB_FILE=':memory:' ไว้แล้ว
 * → loadSeed() ทุกครั้งได้ฐานข้อมูลใหม่ในหน่วยความจำ (5 รายการ) ไม่แตะ campus.db
 */

const app = createApp();
beforeEach(async () => { await loadSeed(); });

const valid = {
  requesterName: 'ทดสอบ อัตโนมัติ', requestType: 'แจ้งซ่อม',
  location: 'C3-401', details: 'รายละเอียดยาวพอสมควรจริง', priority: 'normal',
};

describe('GET /api/requests', () => {
  test('คืน array 5 รายการจากข้อมูลตั้งต้น พร้อม 200', async () => {
    const r = await request(app).get('/api/requests');
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(5);
  });
  test('คืน requesterName ไม่ใช่ requester_id', async () => {
    const r = await request(app).get('/api/requests');
    expect(r.body[0]).toHaveProperty('requesterName');
    expect(r.body[0]).not.toHaveProperty('requester_id');
  });
  test('กรอง ?status= ทำงาน', async () => {
    const r = await request(app).get('/api/requests?status=pending');
    expect(r.body.length).toBeGreaterThan(0);
    expect(r.body.every((x) => x.status === 'pending')).toBe(true);
  });
  test('SQL injection ผ่าน ?status= ไม่หลุด', async () => {
    const r = await request(app).get("/api/requests?status=' OR '1'='1");
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(0);
  });
});

describe('GET /api/requests/:id', () => {
  test('พบ → 200', async () => {
    const r = await request(app).get('/api/requests/REQ-001');
    expect(r.status).toBe(200);
    expect(r.body.id).toBe('REQ-001');
  });
  test('ไม่พบ → 404', async () => {
    const r = await request(app).get('/api/requests/REQ-999');
    expect(r.status).toBe(404);
  });
});

describe('POST /api/requests', () => {
  test('ข้อมูลถูกต้อง → 201 · ได้รหัสถัดไป', async () => {
    const r = await request(app).post('/api/requests').send(valid);
    expect(r.status).toBe(201);
    expect(r.body.id).toBe('REQ-006');
  });
  test('ข้อมูลไม่ครบ → 400 พร้อมรายการ error', async () => {
    const r = await request(app).post('/api/requests').send({ requesterName: 'x' });
    expect(r.status).toBe(400);
    expect(Array.isArray(r.body.details)).toBe(true);
  });
});

describe('PUT /api/requests/:id', () => {
  test('เปลี่ยนสถานะ → 200 และค่าใหม่ถูกบันทึก', async () => {
    const put = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    expect(put.status).toBe(200);
    expect(put.body.status).toBe('completed');
    const get = await request(app).get('/api/requests/REQ-001');
    expect(get.body.status).toBe('completed');
  });
  test('สถานะนอกรายการ → 400', async () => {
    const r = await request(app).put('/api/requests/REQ-001').send({ status: 'done' });
    expect(r.status).toBe(400);
  });
  test('ไม่ส่ง body → 400', async () => {
    const r = await request(app).put('/api/requests/REQ-001');
    expect(r.status).toBe(400);
  });
});

describe('DELETE /api/requests/:id', () => {
  test('ลบสำเร็จ → 204 แล้ว GET ซ้ำ → 404', async () => {
    const del = await request(app).delete('/api/requests/REQ-001');
    expect(del.status).toBe(204);
    const get = await request(app).get('/api/requests/REQ-001');
    expect(get.status).toBe(404);
  });
  test('ลบรหัสที่ไม่มี → 404', async () => {
    const r = await request(app).delete('/api/requests/REQ-999');
    expect(r.status).toBe(404);
  });
  test('ลบแล้วจำนวนใน GET /api/requests ลดลง 1', async () => {
    await request(app).delete('/api/requests/REQ-003');
    const r = await request(app).get('/api/requests');
    expect(r.body).toHaveLength(4);
  });
});

describe('POST /api/requests — เพิ่มเติม', () => {
  test('ตัดช่องว่างหัวท้ายของข้อมูลก่อนบันทึก', async () => {
    const r = await request(app).post('/api/requests').send({ ...valid, location: '  C3-401  ' });
    expect(r.status).toBe(201);
    expect(r.body.location).toBe('C3-401');
  });
  test('ไม่ส่ง priority → 400 (ต้องเป็น normal หรือ urgent)', async () => {
    const { priority, ...noPriority } = valid;
    const r = await request(app).post('/api/requests').send(noPriority);
    expect(r.status).toBe(400);
  });
  test('รายละเอียด 10 ตัวพอดี → 201 (กัน BUG #0 กลับมา)', async () => {
    const r = await request(app).post('/api/requests').send({ ...valid, details: '1234567890' });
    expect(r.status).toBe(201);
  });
});

describe('Routes อื่น ๆ', () => {
  test('GET /api/users → 200 และไม่ส่งอีเมลออกไป', async () => {
    const r = await request(app).get('/api/users');
    expect(r.status).toBe(200);
    expect(r.body.length).toBeGreaterThan(0);
    expect(r.body[0]).not.toHaveProperty('email');
  });
  test('GET /api/users/:id/requests → คำร้องของผู้ใช้คนนั้น', async () => {
    const users = await request(app).get('/api/users');
    const r = await request(app).get(`/api/users/${users.body[0].id}/requests`);
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
  });
  test('path ที่ไม่มี → 404', async () => {
    const r = await request(app).get('/api/nope');
    expect(r.status).toBe(404);
  });
});

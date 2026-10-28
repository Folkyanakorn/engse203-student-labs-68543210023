import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';

// Regression test — ทำซ้ำอาการจาก BUG_REPORTS.md (เขียนก่อนแก้โค้ด → ต้อง fail ก่อน แล้วผ่านหลังแก้)
const app = createApp();
beforeEach(async () => { await loadSeed(); });

const valid = {
  requesterName: 'ทดสอบ อัตโนมัติ', requestType: 'แจ้งซ่อม',
  location: 'C3-401', details: 'รายละเอียดยาวพอสมควรจริง', priority: 'normal',
};

describe('BUG #1 — ลบคำร้องกลางลำดับแล้วเพิ่มใหม่', () => {
  test('ลบ REQ-002 แล้ว POST ใหม่ → 201 (ไม่ใช่ 500) และได้รหัสไม่ซ้ำ', async () => {
    const del = await request(app).delete('/api/requests/REQ-002');
    expect(del.status).toBe(204);

    const created = await request(app).post('/api/requests').send(valid);
    expect(created.status).toBe(201);
    expect(created.body.id).toBe('REQ-006');   // รหัสล่าสุด REQ-005 + 1

    const all = await request(app).get('/api/requests');
    const ids = all.body.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);   // รหัสไม่ซ้ำกัน
  });
});

describe('BUG #3 — เปลี่ยนสถานะคำร้องที่ไม่มีอยู่', () => {
  test('PUT /api/requests/REQ-999 → 404 (ไม่ใช่ 500)', async () => {
    const r = await request(app).put('/api/requests/REQ-999').send({ status: 'completed' });
    expect(r.status).toBe(404);
    expect(r.body.error).toContain('REQ-999');
  });
});

describe('ไม่ถอยหลัง — health check ยังทำงาน', () => {
  test('GET /api/health → 200', async () => {
    const r = await request(app).get('/api/health');
    expect(r.status).toBe(200);
  });
});

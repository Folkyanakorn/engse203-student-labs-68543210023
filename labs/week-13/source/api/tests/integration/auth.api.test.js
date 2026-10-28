import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { resetLoginLimiter } from '../../src/routes/authRoutes.js';
import { STAFF, loginAsStaff, tokenFor } from '../helpers/auth.js';

/**
 * Week 13 — เข้าสู่ระบบและสิทธิ์
 * test 3 ข้อแรกให้มาแล้ว — จะ fail จนกว่าจะทำ CP50–CP51 เสร็จ (เขียน test ก่อน แล้วทำให้ผ่าน)
 */
const app = createApp();
beforeEach(async () => {
  await loadSeed();
  resetLoginLimiter();   // ไม่ให้ตัวนับ login ผิดของ test ข้ออื่นมาทำให้ข้อนี้โดน 429
});

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
  });
  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    expect(r.status).toBe(401);
  });

  test('อีเมลที่ไม่มีในระบบ → 401 และข้อความเดียวกับรหัสผ่านผิด', async () => {
    const wrongPassword = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    const unknownEmail = await request(app).post('/api/auth/login').send({ email: 'nobody@rmutl.ac.th', password: 'staff1234' });
    expect(unknownEmail.status).toBe(401);
    expect(unknownEmail.body.error).toBe(wrongPassword.body.error);   // คนนอกแยกไม่ได้ว่าอีเมลไหนมีบัญชี
  });
  test('payload ของ token มี role กับ exp และไม่มีรหัสผ่านหรือ hash', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    const payload = JSON.parse(Buffer.from(r.body.token.split('.')[1], 'base64url').toString());
    expect(payload.role).toBe('staff');
    expect(payload.exp).toBeGreaterThan(payload.iat);
    expect(JSON.stringify(payload)).not.toMatch(/password|scrypt|staff1234/i);
  });
  test('ผู้แจ้งทั่วไป (ไม่มีรหัสผ่านในระบบ) เข้าสู่ระบบไม่ได้ → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ email: 'somchai@rmutl.ac.th', password: 'anything1' });
    expect(r.status).toBe(401);
  });
  test('รูปแบบข้อมูลผิด (ไม่มี @ / ไม่ส่งรหัสผ่าน) → 400', async () => {
    expect((await request(app).post('/api/auth/login').send({ email: 'abc', password: 'x' })).status).toBe(400);
    expect((await request(app).post('/api/auth/login').send({ email: 'a@b.c' })).status).toBe(400);
  });
  test('⭐ login ผิด 5 ครั้งติด → ครั้งที่ 6 ได้ 429 (แม้รหัสถูก)', async () => {
    for (let i = 0; i < 5; i += 1) {
      const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'wrong-pass' });
      expect(r.status).toBe(401);
    }
    const blocked = await request(app).post('/api/auth/login').send(STAFF);
    expect(blocked.status).toBe(429);
    expect(blocked.headers['retry-after']).toBeDefined();
  });
  test('⭐ login ถูกไม่ถูกนับเป็นความผิด', async () => {
    for (let i = 0; i < 7; i += 1) {
      expect((await request(app).post('/api/auth/login').send(STAFF)).status).toBe(200);
    }
  });
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  test('ไม่มี token → 401', async () => {
    const r = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    expect(r.status).toBe(401);
  });

  const put = (app_, token) => {
    const r = request(app_).put('/api/requests/REQ-001').send({ status: 'completed' });
    return token ? r.set('Authorization', `Bearer ${token}`) : r;
  };

  test('token ที่ไม่ใช่เจ้าหน้าที่ → 403', async () => {
    const r = await put(app, tokenFor('requester'));
    expect(r.status).toBe(403);
  });
  test('token ปลอม (เซ็นด้วย secret อื่น) → 401', async () => {
    const r = await put(app, tokenFor('staff', 'not-the-real-secret'));
    expect(r.status).toBe(401);
  });
  test('token ที่ไม่ใช่รูปแบบ JWT → 401', async () => {
    const r = await put(app, 'not.a.token');
    expect(r.status).toBe(401);
  });
  test('header ไม่ใช่ Bearer → 401', async () => {
    const r = await request(app).put('/api/requests/REQ-001').set('Authorization', 'Basic abc').send({ status: 'completed' });
    expect(r.status).toBe(401);
    expect(r.headers['www-authenticate']).toBe('Bearer');
  });
  test('token หมดอายุ → 401 (ไม่ใช่ 403)', async () => {
    const jwt = (await import('jsonwebtoken')).default;
    const { config } = await import('../../src/config.js');
    const expired = jwt.sign({ sub: '1', role: 'staff' }, config.jwtSecret, { expiresIn: -10 });
    const r = await put(app, expired);
    expect(r.status).toBe(401);
  });
  test('เจ้าหน้าที่ → PUT 200 และ DELETE 204', async () => {
    const token = await loginAsStaff(app);
    const rp = await put(app, token);
    expect(rp.status).toBe(200);
    const rd = await request(app).delete('/api/requests/REQ-002').set('Authorization', `Bearer ${token}`);
    expect(rd.status).toBe(204);
  });
  test('DELETE ไม่มี token → 401 และคำร้องยังอยู่', async () => {
    const r = await request(app).delete('/api/requests/REQ-002');
    expect(r.status).toBe(401);
    expect((await request(app).get('/api/requests/REQ-002')).status).toBe(200);
  });
  test('GET และ POST ยังไม่ต้องเข้าสู่ระบบ', async () => {
    expect((await request(app).get('/api/requests')).status).toBe(200);
    const created = await request(app).post('/api/requests').send({
      requesterName: 'ผู้ใช้ ทั่วไป', requestType: 'แจ้งซ่อม', location: 'C3-401',
      details: 'รายละเอียดยาวพอสมควรจริง', priority: 'normal',
    });
    expect(created.status).toBe(201);
  });
  test('ลบแล้วเพิ่มใหม่ → 201 (BUG #1 ไม่กลับมา แม้ต้องล็อกอินแล้ว)', async () => {
    const token = await loginAsStaff(app);
    await request(app).delete('/api/requests/REQ-002').set('Authorization', `Bearer ${token}`);
    const r = await request(app).post('/api/requests').send({
      requesterName: 'ผู้ใช้ ทั่วไป', requestType: 'แจ้งซ่อม', location: 'C3-401',
      details: 'รายละเอียดยาวพอสมควรจริง', priority: 'normal',
    });
    expect(r.status).toBe(201);
  });
});

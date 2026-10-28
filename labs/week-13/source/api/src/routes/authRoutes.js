import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

// route ให้มาแล้ว — งานหลักอยู่ใน services/authService.js (CP50)
const router = Router();

// ⭐ Challenge — จำกัดการเดารหัสผ่าน: login "ผิด" เกิน 5 ครั้งใน 15 นาที (ต่อ IP) → 429
//   นับเฉพาะครั้งที่ผิด · login ถูกไม่นับ · เก็บในหน่วยความจำ (รีสตาร์ทแล้วเริ่มใหม่ — พอสำหรับงานนี้)
const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const fails = new Map();   // ip → { count, resetAt }

/** ล้างตัวนับ — ใช้ใน test (beforeEach) ไม่ให้ข้ออื่นโดน 429 ไปด้วย */
export function resetLoginLimiter() {
  fails.clear();
}

function isBlocked(ip, now) {
  const entry = fails.get(ip);
  if (!entry) return false;
  if (now >= entry.resetAt) { fails.delete(ip); return false; }
  return entry.count >= MAX_FAILS;
}

function recordFail(ip, now) {
  const entry = fails.get(ip);
  if (!entry || now >= entry.resetAt) fails.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count += 1;
}

router.post('/login', (req, res) => {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  if (isBlocked(ip, now)) {
    res.set('Retry-After', String(Math.ceil((fails.get(ip).resetAt - now) / 1000)));
    return res.status(429).json({ error: 'ลองเข้าสู่ระบบผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่' });
  }
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }
  const result = authService.login(req.body.email, req.body.password);
  if (!result) {
    recordFail(ip, now);
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
  res.status(200).json(result);
});

export default router;

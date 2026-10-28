import { verifyToken } from '../services/authService.js';

/**
 * Week 13 · CP51 — ป้องกัน route ด้วย JWT
 *
 *   authenticate      → "คุณคือใคร"         ไม่มี token / token ปลอม / หมดอายุ  → 401
 *   requireRole(role) → "คุณทำสิ่งนี้ได้ไหม"  รู้ว่าเป็นใคร แต่ไม่มีสิทธิ์          → 403
 *
 * header ที่ส่งมา:  Authorization: Bearer <token>
 */
export function authenticate(req, res, next) {
  const header = req.get('Authorization') ?? '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    res.set('WWW-Authenticate', 'Bearer');
    return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อน' });
  }
  try {
    req.user = verifyToken(token);   // แนบข้อมูลผู้ใช้ไว้ให้ชั้นถัดไป
    next();
  } catch {
    // token หมดอายุก็ 401 — ไม่ใช่ 403 เพราะระบบยัง "ไม่รู้ว่าคุณคือใคร" ต้องเข้าสู่ระบบใหม่
    return res.status(401).json({ error: 'token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: 'ไม่มีสิทธิ์ทำรายการนี้' });
    }
    next();
  };
}

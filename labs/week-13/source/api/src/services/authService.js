import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findUserByEmail } from './requestService.js';
import { verifyPassword } from '../utils/password.js';

/**
 * login(email, password) → ถูกต้อง { token, user } · ผิด null
 *   "ไม่มีอีเมล" กับ "รหัสผ่านผิด" คืน null เหมือนกัน — คนนอกจะได้ไม่รู้ว่าอีเมลไหนมีบัญชี
 *   payload ไม่มีรหัสผ่านหรือ hash เพราะ payload ของ JWT ใครก็ถอดอ่านได้
 */
export function login(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.role !== 'staff' || !verifyPassword(password, user.passwordHash)) {
    return null;
  }
  const payload = { sub: String(user.id), name: user.name, role: user.role };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  return { token, user: { id: user.id, name: user.name, role: user.role } };
}

/** ตรวจ token — ถูกต้องคืน payload · ปลอม/หมดอายุ jwt.verify โยน error */
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

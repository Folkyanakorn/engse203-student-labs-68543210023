/**
 * password.js — เก็บรหัสผ่านอย่างปลอดภัยด้วย scrypt (มากับ Node ใน node:crypto)
 *
 * Week 13 · CP49 — hash/verify ด้วย scrypt (tests/unit/password.test.js)
 *
 *   รูปแบบที่ต้องเก็บ:  scrypt$<salt>$<hash>
 *     salt = randomBytes(16) แปลงเป็น hex  (32 ตัวอักษร)
 *     hash = scryptSync(รหัสผ่าน, salt, 64) แปลงเป็น hex  (128 ตัวอักษร)
 *
 *   ⚠ รูปแบบต้องตรงเป๊ะ — schema.sql มี hash ของบัญชีเจ้าหน้าที่ (รหัสผ่าน staff1234)
 *     ที่สร้างด้วยรูปแบบนี้ ถ้าเขียนต่างไป จะเข้าสู่ระบบด้วยบัญชีนี้ไม่ได้
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex');                      // 32 ตัวอักษร hex
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString('hex');  // 128 ตัวอักษร hex
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain, stored) {
  if (typeof plain !== 'string' || typeof stored !== 'string') return false;
  const [scheme, salt, hash, ...rest] = stored.split('$');
  // รูปแบบผิด (ไม่ใช่ scrypt · ขาดส่วน · เกินส่วน · hash ไม่ใช่ hex) → false ไม่โยน error
  if (scheme !== 'scrypt' || !salt || !hash || rest.length > 0 || !/^[0-9a-f]+$/i.test(hash)) {
    return false;
  }
  const expected = Buffer.from(hash, 'hex');
  // ใช้ salt เป็นข้อความ hex ตรง ๆ เหมือนตอน hash และใช้ความยาวของ hash เดิม
  const actual = scryptSync(plain, salt, expected.length);
  // timingSafeEqual ใช้เวลาเท่ากันไม่ว่าจะต่างตรงไหน — === เร็วช้าต่างกันตามตำแหน่งที่ผิด ทำให้เดาทีละตัวได้
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

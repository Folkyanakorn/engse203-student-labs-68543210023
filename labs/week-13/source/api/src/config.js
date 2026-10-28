/**
 * config.js — รวมการอ่าน environment variable ไว้ที่เดียว
 *
 * ทำไมต้องมีไฟล์นี้ (CP36)
 *   - ไม่ให้ค่า config กระจายอยู่ทั่วโค้ด (hardcode)
 *   - แยก dev / production ด้วยค่าเดียว: NODE_ENV
 *   - อ่านค่าจาก process.env ที่เดียว ที่อื่น import จากนี่
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '..');

function resolveJwtSecret() {
  const secret = process.env.JWT_SECRET || '';
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ต้องตั้งค่า JWT_SECRET ใน production (สร้างด้วย: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")');
  }
  return 'dev-only-secret-do-not-use-in-production';   // ใช้ได้เฉพาะ development / test
}

export const config = {
  // สภาพแวดล้อม — 'development' หรือ 'production'
  env: process.env.NODE_ENV ?? 'development',
  isProd: process.env.NODE_ENV === 'production',

  // พอร์ตของ API
  port: Number(process.env.PORT ?? 3001),

  // ที่อยู่ frontend ที่อนุญาตให้เรียก (CORS)
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  // ไฟล์ฐานข้อมูล
  dbFile: process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db'),
  schemaFile: path.join(API_ROOT, 'data', 'schema.sql'),

  // production เสิร์ฟไฟล์ frontend ที่ build แล้วจากที่ไหน
  staticDir: process.env.STATIC_DIR ?? path.join(API_ROOT, '..', 'frontend', 'dist'),

  /**
   * ค่าลับสำหรับเซ็น JWT — production ต้องตั้ง JWT_SECRET เอง ไม่งั้นไม่ยอม start (fail fast)
   * ถ้าปล่อยให้ใช้ค่าตั้งต้นที่อยู่ใน GitHub ใครก็ปลอม token ของเจ้าหน้าที่ได้ และจะไม่มีใครรู้
   * ใช้ || (ไม่ใช่ ??) เพื่อให้ JWT_SECRET= ที่เป็นค่าว่างถูกนับว่า "ไม่ได้ตั้ง"
   */
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
};

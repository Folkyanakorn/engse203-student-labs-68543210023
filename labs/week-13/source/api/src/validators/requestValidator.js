/**
 * requestValidator.js — กฎตรวจข้อมูลคำร้อง เป็น "pure function"
 *
 * Week 13 · CP48 — ทำให้เข้มขึ้น: ตรวจชนิดข้อมูล (string) และความยาวสูงสุด
 *   ชื่อ 2–100 · สถานที่ 1–100 · รายละเอียด 10–1000 ตัวอักษร (ดู checkText)
 *
 * Week 12 · CP45 — ทำไมต้องแยกออกจาก middleware
 *   middleware ผูกกับ req / res / next → จะทดสอบต้องเปิด server หรือจำลอง req/res
 *   pure function รับข้อมูลเข้า คืนผลลัพธ์ ไม่แตะอะไรภายนอก → เขียน unit test ได้ทันที
 *
 *   validateRequestInput(input) → [] ถ้าผ่าน · ['ข้อความ error', ...] ถ้าไม่ผ่าน
 */

export const REQUEST_TYPES = ['แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ'];
export const PRIORITIES = ['normal', 'urgent'];
export const STATUSES = ['pending', 'in-progress', 'completed'];

export const MIN_NAME = 2;
export const MAX_NAME = 100;
export const MAX_LOCATION = 100;
export const MIN_DETAILS = 10;
export const MAX_DETAILS = 1000;

function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * ตรวจช่องข้อความ 1 ช่อง — เขียนครั้งเดียวใช้ได้ทั้ง 3 ช่อง (ชื่อ · สถานที่ · รายละเอียด)
 *   ① ต้องเป็น string  ② ไม่สั้นกว่า min (ตัดช่องว่างหัวท้ายก่อนนับ)  ③ ไม่ยาวเกิน max
 * คืนข้อความ error 1 ข้อ หรือ null ถ้าผ่าน
 */
function checkText(value, label, { min, max }) {
  if (typeof value !== 'string') return `${label}ต้องเป็นข้อความ`;
  const length = value.trim().length;
  if (length < min) {
    return min <= 1 ? `กรุณาระบุ${label}` : `${label}ต้องมีอย่างน้อย ${min} ตัวอักษร`;
  }
  if (length > max) return `${label}ต้องไม่เกิน ${max} ตัวอักษร`;
  return null;
}

export function validateRequestInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return ['ต้องส่งข้อมูลคำร้องมาด้วย'];
  }

  const errors = [];
  const check = (error) => { if (error) errors.push(error); };

  check(checkText(input.requesterName, 'ชื่อผู้แจ้ง', { min: MIN_NAME, max: MAX_NAME }));
  if (!REQUEST_TYPES.includes(input.requestType)) {
    errors.push('ประเภทคำร้องไม่ถูกต้อง');
  }
  check(checkText(input.location, 'สถานที่', { min: 1, max: MAX_LOCATION }));
  check(checkText(input.details, 'รายละเอียด', { min: MIN_DETAILS, max: MAX_DETAILS }));
  if (!PRIORITIES.includes(input.priority)) {
    errors.push('ความเร่งด่วนต้องเป็น normal หรือ urgent');
  }
  return errors;
}

/** สถานะที่ PUT /api/requests/:id รับได้ */
export function isValidStatus(status) {
  return STATUSES.includes(status);
}

/** Week 13 — ข้อมูลเข้าสู่ระบบ ตรวจแค่รูปแบบ ส่วนถูกหรือผิดให้ authService ตัดสิน (ให้มาแล้ว) */
export function validateLoginInput(input) {
  if (!input || typeof input !== 'object') return ['ต้องส่งอีเมลและรหัสผ่าน'];
  const errors = [];
  if (typeof input.email !== 'string' || !input.email.includes('@') || input.email.length > 254) {
    errors.push('รูปแบบอีเมลไม่ถูกต้อง');
  }
  if (typeof input.password !== 'string' || input.password.length === 0 || input.password.length > 200) {
    errors.push('กรุณาระบุรหัสผ่าน');
  }
  return errors;
}

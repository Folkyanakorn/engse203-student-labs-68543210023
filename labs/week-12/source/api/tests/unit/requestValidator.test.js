import { describe, test, expect } from 'vitest';
import { validateRequestInput, isValidStatus } from '../../src/validators/requestValidator.js';

/**
 * Unit test — ทดสอบ pure function โดยตรง ไม่ต้องเปิด server ไม่ต้องมีฐานข้อมูล
 * กรณีทดสอบมาจากตาราง TEST_CASES.md (CP44)
 *
 * รัน:  npm test            (ครั้งเดียว)
 *       npm run test:watch  (รันใหม่ทุกครั้งที่บันทึกไฟล์)
 */

// ข้อมูลที่ถูกต้องทุกช่อง — แต่ละ test เปลี่ยนทีละช่องเพื่อให้รู้ว่าพังเพราะอะไร
const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};
const withField = (patch) => ({ ...valid, ...patch });

describe('validateRequestInput — ข้อมูลถูกต้อง', () => {
  test('ทุกช่องถูกต้อง → ไม่มี error (TC-01)', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });
});

describe('validateRequestInput — รายละเอียด (ค่าขอบ 10 ตัวอักษร)', () => {
  test('9 ตัวอักษร → error (ต่ำกว่าขอบ 1) (TC-02)', () => {
    expect(validateRequestInput(withField({ details: '123456789' }))).toHaveLength(1);
  });
  test('10 ตัวอักษรพอดี → ผ่าน (ค่าขอบ) (TC-03)', () => {
    expect(validateRequestInput(withField({ details: '1234567890' }))).toEqual([]);
  });
  test('11 ตัวอักษร → ผ่าน (TC-04)', () => {
    expect(validateRequestInput(withField({ details: '12345678901' }))).toEqual([]);
  });
  test('ช่องว่างล้วน → error (ตัดช่องว่างก่อนนับ) (TC-05)', () => {
    expect(validateRequestInput(withField({ details: '            ' }))).toHaveLength(1);
  });
  test('ช่องว่างหัวท้ายไม่นับ: "  123456789  " → error', () => {
    expect(validateRequestInput(withField({ details: '  123456789  ' }))).toHaveLength(1);
  });
});

describe('validateRequestInput — ชื่อผู้แจ้ง (ค่าขอบ 2 ตัวอักษร)', () => {
  test('1 ตัวอักษร → error (TC-06)', () => {
    expect(validateRequestInput(withField({ requesterName: 'ก' }))).toHaveLength(1);
  });
  test('2 ตัวอักษรพอดี → ผ่าน (TC-07)', () => {
    expect(validateRequestInput(withField({ requesterName: 'กข' }))).toEqual([]);
  });
});

describe('validateRequestInput — ประเภท · สถานที่ · ความเร่งด่วน', () => {
  test('ประเภทคำร้องนอกรายการ → error (TC-08)', () => {
    expect(validateRequestInput(withField({ requestType: 'ร้องเรียน' }))).toHaveLength(1);
  });
  test('priority "high" → error (TC-09)', () => {
    expect(validateRequestInput(withField({ priority: 'high' }))).toHaveLength(1);
  });
  test('priority "urgent" → ผ่าน', () => {
    expect(validateRequestInput(withField({ priority: 'urgent' }))).toEqual([]);
  });
  test('สถานที่ว่าง → error (TC-10)', () => {
    expect(validateRequestInput(withField({ location: '   ' }))).toHaveLength(1);
  });
  test('หลายช่องผิดพร้อมกัน → ได้ error หลายข้อ', () => {
    const errors = validateRequestInput({ requesterName: '', requestType: 'x', location: '', details: '', priority: 'x' });
    expect(errors).toHaveLength(5);
  });
});

describe('validateRequestInput — input ผิดรูปแบบ', () => {
  test.each([
    ['null', null],
    ['undefined', undefined],
    ['array', []],
    ['ตัวเลข', 42],
    ['สตริง', 'abc'],
  ])('%s → error "ต้องส่งข้อมูลคำร้องมาด้วย"', (_name, input) => {
    expect(validateRequestInput(input)).toEqual(['ต้องส่งข้อมูลคำร้องมาด้วย']);
  });
  test('ชื่อไม่ใช่สตริง (ตัวเลข) → error ไม่ throw', () => {
    expect(validateRequestInput(withField({ requesterName: 12345 }))).toHaveLength(1);
  });
});

describe('isValidStatus', () => {
  test('"pending" → true', () => {
    expect(isValidStatus('pending')).toBe(true);
  });
  test.each(['in-progress', 'completed'])('"%s" → true', (s) => {
    expect(isValidStatus(s)).toBe(true);
  });
  test.each(['done', '', 'PENDING', undefined, null])('%j → false', (s) => {
    expect(isValidStatus(s)).toBe(false);
  });
});

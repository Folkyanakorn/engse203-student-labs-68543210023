import { describe, test, expect, vi, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';
import { AppError, asyncHandler, notFound, errorHandler } from '../../src/middleware/errorHandler.js';
import { logger } from '../../src/middleware/logger.js';

// res จำลอง — ไม่ต้องเปิด server
function fakeRes() {
  const res = new EventEmitter();
  res.statusCode = 200;
  res.status = vi.fn((c) => { res.statusCode = c; return res; });
  res.json = vi.fn(() => res);
  return res;
}

afterEach(() => vi.restoreAllMocks());

describe('errorHandler', () => {
  test('error 4xx (AppError) → ส่งข้อความของ error นั้นตรง ๆ', () => {
    const res = fakeRes();
    errorHandler(new AppError('ไม่พบข้อมูล', 404), {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0].error).toBe('ไม่พบข้อมูล');
  });
  test('error ทั่วไป → 500 และไม่เปิดเผยข้อความภายใน', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = fakeRes();
    errorHandler(new Error('SECRET internal detail'), {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json.mock.calls[0][0].error).toBe('เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์');
    expect(res.json.mock.calls[0][0].error).not.toContain('SECRET');
  });
});

describe('notFound', () => {
  test('ตอบ 404 พร้อม method และ path', () => {
    const res = fakeRes();
    notFound({ method: 'GET', originalUrl: '/x' }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0].error).toContain('GET /x');
  });
});

describe('asyncHandler', () => {
  test('handler ที่ reject → ส่ง error ต่อให้ next', async () => {
    const next = vi.fn();
    const boom = new Error('boom');
    await asyncHandler(async () => { throw boom; })({}, {}, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
  test('handler ที่สำเร็จ → ไม่เรียก next ด้วย error', async () => {
    const next = vi.fn();
    await asyncHandler(async () => 'ok')({}, {}, next);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('logger', () => {
  test('เรียก next และ log เมื่อคำขอจบ', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const res = fakeRes();
    const next = vi.fn();
    logger({ method: 'GET', originalUrl: '/api/requests' }, res, next);
    expect(next).toHaveBeenCalled();
    res.emit('finish');
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][0]).toContain('GET /api/requests');
  });
});

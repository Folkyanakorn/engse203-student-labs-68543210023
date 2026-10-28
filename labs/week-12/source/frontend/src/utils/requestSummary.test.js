import { describe, test, expect } from 'vitest';
import { summarizeRequests } from './requestSummary.js';

// ข้อมูลหน้าตาเดียวกับที่ GET /api/requests ส่งมาจริง (status ใช้ 'in-progress' มีขีดกลาง)
const fromApi = [
  { id: 'REQ-001', requesterName: 'ก', status: 'pending' },
  { id: 'REQ-002', requesterName: 'ข', status: 'in-progress' },
  { id: 'REQ-003', requesterName: 'ค', status: 'in-progress' },
  { id: 'REQ-004', requesterName: 'ง', status: 'completed' },
  { id: 'REQ-005', requesterName: 'จ', status: 'pending' },
];

describe('summarizeRequests', () => {
  test('รายการว่าง → ทุกค่าเป็น 0', () => {
    expect(summarizeRequests([])).toEqual({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  });

  // BUG #2 — regression: นับ in-progress ต้องได้ตามจริง ไม่ใช่ 0
  test('BUG #2: นับ "in-progress" ตามข้อมูลจาก API', () => {
    expect(summarizeRequests(fromApi)).toEqual({
      total: 5, pending: 2, inProgress: 2, completed: 1,
    });
  });

  test('ผลรวมของแต่ละสถานะเท่ากับ total', () => {
    const s = summarizeRequests(fromApi);
    expect(s.pending + s.inProgress + s.completed).toBe(s.total);
  });
});

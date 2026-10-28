/**
 * ตัวกลางสำหรับคุยกับ API — ที่เดียวที่เรียก fetch()
 * ทุกฟังก์ชันใน requestService เรียกผ่านตรงนี้
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

// token เก็บใน memory ของหน้านี้ (ไม่ใส่ localStorage — กัน script อื่นอ่านไปได้ง่าย ๆ)
// หน้า login (ทำต่อใน Term Project) เรียก setAuthToken(token) หลังเข้าสู่ระบบสำเร็จ
let authToken = null;
export function setAuthToken(token) { authToken = token ?? null; }

/** error ที่รู้ว่ามาจาก API พร้อม status ที่ได้กลับมา */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseError(response) {
  try {
    const body = await response.json();
    return body.error ?? `คำขอไม่สำเร็จ (${response.status})`;
  } catch {
    return `คำขอไม่สำเร็จ (${response.status})`;
  }
}

/**
 * เรียก API แล้วคืนข้อมูลที่ parse แล้ว
 * - ตอบ 2xx → คืนข้อมูล (204 คืน null เพราะไม่มี body)
 * - ตอบ 4xx/5xx → โยน ApiError พร้อม status
 * - ต่อ API ไม่ได้เลย → โยน ApiError status 0
 */
export async function apiFetch(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // แนบ token ที่เดียวตรงนี้ — ทุกคำขอจึงมี Authorization อัตโนมัติเมื่อเข้าสู่ระบบแล้ว
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    // fetch โยน error เมื่อต่อเซิร์ฟเวอร์ไม่ได้เลย เช่น API ไม่ได้เปิด
    throw new ApiError('ติดต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจว่าเปิด API ที่พอร์ต 3001 แล้วหรือยัง', 0);
  }

  // 401 = token หมดอายุ/ไม่ถูกต้อง → ล้างทิ้ง จะได้ไม่แนบ token เสียต่อไป
  if (response.status === 401) authToken = null;

  if (!response.ok) {
    throw new ApiError(await parseError(response), response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

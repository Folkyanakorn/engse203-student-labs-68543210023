-- ═══════════════════════════════════════════════════════════
-- Campus Service Request — โครงสร้างฐานข้อมูล
-- ENGSE203 สัปดาห์ที่ 9 · หน่วยที่ 4
-- ผู้จัดทำ: นายญาณากร หวังระบอบ · 68543210023
--
-- ไฟล์นี้รันแล้วสร้างฐานข้อมูลครบในครั้งเดียว และรันซ้ำได้โดยไม่ error
-- ═══════════════════════════════════════════════════════════

PRAGMA foreign_keys = ON;

-- ① ลบตารางเดิมก่อน เพื่อให้รันซ้ำได้
--    ลำดับสำคัญ: ลบ requests (ฝั่งที่ชี้ไปหา) ก่อน users (ฝั่งที่ถูกชี้)
DROP INDEX IF EXISTS idx_requests_status;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;

-- ② ตารางผู้ใช้
CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  department  TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE
);

-- ③ ตารางคำร้อง
CREATE TABLE requests (
  id            TEXT PRIMARY KEY,                       -- รหัสแบบ REQ-001
  requester_id  INTEGER NOT NULL,
  request_type  TEXT NOT NULL
                CHECK (request_type IN ('แจ้งซ่อม','บริการบัญชีผู้ใช้','ขอใช้อุปกรณ์','อื่น ๆ')),
  location      TEXT NOT NULL,
  details       TEXT NOT NULL,
  priority      TEXT NOT NULL DEFAULT 'normal'
                CHECK (priority IN ('normal','urgent')),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','in-progress','completed')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (requester_id) REFERENCES users(id)
);

-- ④ ข้อมูลตั้งต้น — users 5 คน (คนที่ 5 ยังไม่เคยแจ้งคำร้อง ไว้ทดสอบ LEFT JOIN)
INSERT INTO users (name, department, email) VALUES
  ('สมชาย ใจดี',       'วิศวกรรมซอฟต์แวร์', 'somchai@rmutl.ac.th'),
  ('สุภาวดี รักเรียน',  'วิศวกรรมซอฟต์แวร์', 'supawadee@rmutl.ac.th'),
  ('ธนกฤต ตั้งใจ',      'วิศวกรรมไฟฟ้า',     'thanakrit@rmutl.ac.th'),
  ('ปรียา ขยันยิ่ง',    'สำนักวิทยบริการ',   'preeya@rmutl.ac.th'),
  ('วิชัย มั่นคง',      'วิศวกรรมไฟฟ้า',     'wichai@rmutl.ac.th');

-- requests 9 รายการ — มีครบ 3 สถานะ · 2 ระดับความเร่งด่วน · หลายภาควิชา
INSERT INTO requests (id, requester_id, request_type, location, details, priority, status, created_at) VALUES
  ('REQ-001', 1, 'แจ้งซ่อม',          'ห้องปฏิบัติการ 301',      'เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า',           'urgent', 'pending',     '2026-09-01 08:30:00'),
  ('REQ-002', 2, 'บริการบัญชีผู้ใช้', 'อาคารวิศวกรรมซอฟต์แวร์', 'เข้าสู่ระบบห้องปฏิบัติการไม่ได้',                'normal', 'in-progress', '2026-09-02 09:10:00'),
  ('REQ-003', 3, 'ขอใช้อุปกรณ์',      'ห้องประชุม 2',            'ขอยืมโปรเจกเตอร์สำหรับนำเสนอโครงงาน',          'normal', 'completed',   '2026-09-03 10:45:00'),
  ('REQ-004', 1, 'แจ้งซ่อม',          'ห้องปฏิบัติการ 302',      'คอมพิวเตอร์เครื่องที่ 5 เปิดไม่ติด',            'urgent', 'pending',     '2026-09-04 13:20:00'),
  ('REQ-005', 4, 'อื่น ๆ',             'ห้องสมุด ชั้น 2',         'ขอเพิ่มปลั๊กไฟบริเวณโต๊ะอ่านหนังสือ',           'normal', 'pending',     '2026-09-05 15:00:00'),
  ('REQ-006', 2, 'แจ้งซ่อม',          'ห้องปฏิบัติการ 401',      'ไฟในห้องกะพริบตลอดเวลา',                       'normal', 'in-progress', '2026-09-08 08:05:00'),
  ('REQ-007', 3, 'บริการบัญชีผู้ใช้', 'อาคารวิศวกรรมไฟฟ้า',      'ลืมรหัสผ่านอีเมลมหาวิทยาลัย ขอรีเซ็ต',         'urgent', 'completed',   '2026-09-09 11:30:00'),
  ('REQ-008', 4, 'ขอใช้อุปกรณ์',      'สำนักวิทยบริการ',         'ขอยืมไมโครโฟนไร้สายสำหรับงานสัมมนา',           'normal', 'completed',   '2026-09-10 14:15:00'),
  ('REQ-009', 1, 'แจ้งซ่อม',          'ห้องน้ำชั้น 3',           'ก๊อกน้ำรั่วไม่หยุด พื้นเปียกลื่น',              'urgent', 'in-progress', '2026-09-11 16:40:00');

-- ⑤ INDEX — ให้ค้นด้วย status เร็วขึ้น (Challenge)
CREATE INDEX idx_requests_status ON requests(status);

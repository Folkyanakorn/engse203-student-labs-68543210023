-- ═══════════════════════════════════════════════════════════
-- queries.sql — คำสั่งค้นหาตอบโจทย์ (ทุกข้อทดสอบรันกับ campus.db แล้ว)
-- ผู้จัดทำ: นายญาณากร หวังระบอบ · 68543210023
-- ═══════════════════════════════════════════════════════════

-- ① คำร้องทั้งหมด เรียงตามรหัส
SELECT * FROM requests ORDER BY id;

-- ② คำร้องที่ยังไม่ได้ดำเนินการ (status = 'pending')
SELECT id, location, details FROM requests
WHERE status = 'pending'
ORDER BY id;

-- ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ — เงื่อนไข 2 ข้อพร้อมกัน
SELECT id, location, details, status FROM requests
WHERE priority = 'urgent' AND status <> 'completed'
ORDER BY id;

-- ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด — LIKE ต้องมี % ทั้งสองข้าง
SELECT id, location, details FROM requests
WHERE details LIKE '%ไม่%'
ORDER BY id;

-- ⑤ คำร้องพร้อมชื่อผู้แจ้ง — ชื่ออยู่ในตาราง users จึงต้อง JOIN
SELECT r.id, u.name AS requester, r.request_type, r.status
FROM requests r
JOIN users u ON u.id = r.requester_id
ORDER BY r.id;

-- ⑥ คำร้องเฉพาะของภาควิชาหนึ่ง (JOIN + WHERE)
SELECT r.id, u.name AS requester, r.details
FROM requests r
JOIN users u ON u.id = r.requester_id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id;

-- ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน (DISTINCT)
SELECT DISTINCT u.name
FROM requests r
JOIN users u ON u.id = r.requester_id
ORDER BY u.name;

-- ⑧ คำร้อง 3 รายการล่าสุด (ORDER BY + LIMIT)
SELECT id, created_at, details FROM requests
ORDER BY created_at DESC
LIMIT 3;

-- ⭐ Challenge ─────────────────────────────────────────────
-- ⑨ นับจำนวนคำร้องแยกตามสถานะ (GROUP BY + COUNT)
SELECT status, COUNT(*) AS total
FROM requests
GROUP BY status
ORDER BY total DESC;

-- ⑩ ใครแจ้งคำร้องมากที่สุด — LEFT JOIN ให้คนที่ยังไม่เคยแจ้ง (จำนวน 0) ติดมาด้วย
SELECT u.name, COUNT(r.id) AS total
FROM users u
LEFT JOIN requests r ON r.requester_id = u.id
GROUP BY u.id
ORDER BY total DESC, u.name;

-- ⑪ INDEX ให้การค้นด้วย status เร็วขึ้น (ถูกสร้างไว้ใน schema.sql แล้ว)
--    รันซ้ำได้โดยไม่ error เพราะมี IF NOT EXISTS
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

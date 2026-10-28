# บันทึกการไล่ปัญหา (Debug Log)

**ผู้จัดทำ:** นายญาณากร หวังระบอบ · รหัสนักศึกษา 68543210023 · GitHub: Folkyanakorn

> แต่ละ bug: เขียน test ที่ทำซ้ำอาการก่อน → ยืนยันว่า fail → แก้โค้ด → test ผ่าน
> (ก่อนแก้: api test ล้ม 2 ข้อ, frontend test ล้ม 2 ข้อ · หลังแก้: ผ่านทั้งหมด)

---

## BUG #0 · ค่าขอบรายละเอียด 10 ตัวอักษรพอดีถูกปฏิเสธ

- **อาการ:** ส่งรายละเอียดยาว 10 ตัวอักษรพอดี แล้วระบบตอบว่า "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร" ทั้งที่ 10 ควรผ่าน
- **วิธีทำซ้ำ:** `validateRequestInput({ ...valid, details: '1234567890' })` ได้ error 1 ข้อ (ควรได้ `[]`)
- **เครื่องมือ:** unit test ค่าขอบ (9 · 10 · 11 ตัวอักษร) + อ่านโค้ดใน validator
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/validators/requestValidator.js:37` ใช้ `length <= MIN_DETAILS` (น้อยกว่าหรือเท่ากับ) ทั้งที่กฎคือ "อย่างน้อย 10" ต้องปฏิเสธเฉพาะ `< 10`
- **วิธีแก้:** เปลี่ยน `<=` เป็น `<`
- **test ที่กัน:** `tests/unit/requestValidator.test.js` → "10 ตัวอักษรพอดี → ผ่าน" และ `tests/integration/requests.api.test.js` → "รายละเอียด 10 ตัวพอดี → 201"

## BUG #1 · ลบคำร้องแล้วเพิ่มใหม่ ได้ 500

- **อาการ:** หลังลบคำร้องกลางลำดับ การสร้างคำร้องใหม่ขึ้น "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" (500)
- **วิธีทำซ้ำ:** `DELETE /api/requests/REQ-002` แล้ว `POST /api/requests` ด้วยข้อมูลถูกต้อง
- **เครื่องมือ:** อ่าน log ของ server (`UNIQUE constraint failed: requests.id`) + integration test ที่ทำซ้ำลำดับนี้
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/services/requestService.js` ฟังก์ชัน `nextId()` (บรรทัด ~99) สร้างรหัสถัดไปจาก `COUNT(*) + 1` เมื่อลบ REQ-002 เหลือ 4 แถว จึงได้ `REQ-005` ซึ่งมีอยู่แล้ว → ชน primary key
- **วิธีแก้:** หาเลขสูงสุดของรหัสที่มีอยู่ `MAX(CAST(SUBSTR(id, 5) AS INTEGER))` แล้วบวก 1 (ไม่นับจำนวนแถว)
- **test ที่กัน:** `tests/integration/regression.api.test.js` → "BUG #1 — ลบ REQ-002 แล้ว POST ใหม่ → 201 และได้รหัสไม่ซ้ำ"

## BUG #2 · Dashboard แสดง "กำลังดำเนินการ 0"

- **อาการ:** การ์ดสรุปบน Dashboard แสดงกำลังดำเนินการ 0 ตลอด ทั้งที่มีคำร้องสถานะ in-progress
- **วิธีทำซ้ำ:** เรียก `summarizeRequests` ด้วยข้อมูลหน้าตาเดียวกับที่ API ส่ง (status = `'in-progress'`)
- **เครื่องมือ:** เทียบค่า status จริงที่ API ส่งกับค่าที่โค้ดนับ + frontend unit test
- **สาเหตุ (ไฟล์:บรรทัด):** `frontend/src/utils/requestSummary.js:12` นับด้วย `count('in progress')` (เว้นวรรค) แต่ API และฐานข้อมูลใช้ `'in-progress'` (ขีดกลาง) จึงไม่เคยตรงกัน
- **วิธีแก้:** เปลี่ยนเป็น `count('in-progress')`
- **test ที่กัน:** `frontend/src/utils/requestSummary.test.js` → "BUG #2: นับ in-progress ตามข้อมูลจาก API" และ "ผลรวมของแต่ละสถานะเท่ากับ total"

## BUG #3 · เปลี่ยนสถานะคำร้องที่ไม่มีอยู่ ได้ 500

- **อาการ:** `PUT /api/requests/REQ-999` ตอบ 500 แทนที่จะเป็น 404 "ไม่พบคำร้อง"
- **วิธีทำซ้ำ:** `PUT /api/requests/REQ-999` พร้อม `{ "status": "completed" }`
- **เครื่องมือ:** integration test + อ่าน stack trace ใน log (`Cannot read properties of null (reading 'id')`)
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/controllers/requestController.js` ฟังก์ชัน `updateRequestStatus` (บรรทัด ~28) เรียก `console.log(updated.id ...)` ก่อนเช็ค `if (!updated)` พอ `updated` เป็น `null` จึง throw TypeError → errorHandler ตอบ 500
- **วิธีแก้:** ย้ายการเช็ค `!updated` (ตอบ 404) ขึ้นมาก่อนบรรทัดที่ log
- **test ที่กัน:** `tests/integration/regression.api.test.js` → "BUG #3 — PUT /api/requests/REQ-999 → 404"

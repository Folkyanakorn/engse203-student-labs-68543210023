# AI_USAGE — LAB 13

**ผู้จัดทำ:** นายญาณากร หวังระบอบ · รหัสนักศึกษา 68543210023

| เครื่องมือ | ใช้ทำอะไร | ส่วนที่ AI ทำ | วิธีตรวจสอบ |
|---|---|---|---|
| Claude | ช่วยทำ CP48–CP52 และ Challenge | validation เข้มขึ้น (`checkText`), `password.js` (scrypt), `authService.js` (JWT), `middleware/auth.js` (401/403), `config.js` (fail fast), limit login 5 ครั้ง, security headers, แนบ token ใน `apiClient.js`, เขียน test เพิ่ม | รัน `npm test` ใน api (94 ข้อ) และ frontend, รัน `check-week13.mjs` (27/27) และ `check-week12.mjs --inclass` |

**ส่วนที่ต้องทำเอง:** อ่านและอธิบายให้ได้ว่า 401 ต่างจาก 403 อย่างไร, ทำไมเทียบ hash ด้วย `timingSafeEqual`, salt ช่วยอะไร, ทำไมไม่ใส่ JWT secret ใน `config.js`, ทดลองยิง `POST /api/auth/login` ด้วย curl/Postman, เติมลิงก์ใน `DEMO.md`, หน้า login ฝั่ง React (ทำต่อใน Term Project)

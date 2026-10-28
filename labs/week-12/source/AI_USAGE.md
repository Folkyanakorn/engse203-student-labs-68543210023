# AI_USAGE — LAB 12

**ผู้จัดทำ:** นายญาณากร หวังระบอบ · รหัสนักศึกษา 68543210023

บันทึกการใช้ AI ระหว่างทำงาน (ตามที่ผู้สอนกำหนดให้เปิดเผย)

| เครื่องมือ | ใช้ทำอะไร | ส่วนที่ AI ทำ | วิธีตรวจสอบ |
|---|---|---|---|
| Claude | ช่วยหาและแก้ bug 4 ตัว, เขียน unit/integration/regression test, เขียน TEST_CASES และ DEBUG_LOG | แก้โค้ดใน validator, requestService, requestController, requestSummary และเขียนไฟล์ test | รัน `npm test` ใน api และ frontend, รัน `npm run coverage` (ได้ ~90%) และรัน `npm run check` |

**ส่วนที่ต้องทำเอง:** อ่านโค้ดทั้ง 4 จุดจนอธิบายได้ว่าทำไมแก้ตรงนั้น (ผู้สอนจะสุ่มถาม), ลองทำซ้ำอาการใน DevTools/Postman ด้วยตัวเอง, เติมลิงก์ใน DEMO.md

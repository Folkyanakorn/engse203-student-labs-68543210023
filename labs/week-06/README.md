# Week 06 — Node.js / Express API Foundation

**ผู้จัดทำ:** นายญาณากร หวังระบอบ · รหัสนักศึกษา 68543210023 · GitHub: Folkyanakorn

> **การใช้ AI:** ดูรายละเอียดที่ [`source/AI_USAGE.md`](source/AI_USAGE.md)

## 1. โจทย์

สร้าง **REST API ด้วย Express** สำหรับระบบคำร้อง (Campus Service Request API) แยกเป็นชั้น `routes → controllers → services` พร้อม middleware

| Method | Endpoint | ทำอะไร | ผลสำเร็จ |
|---|---|---|---|
| GET | `/` | ตรวจว่า API ทำงาน | 200 |
| GET | `/api/requests` | ดูทั้งหมด | 200 |
| GET | `/api/requests/:id` | ดูรายการเดียว (ไม่มี → 404) | 200 |
| POST | `/api/requests` | สร้างคำร้อง (ข้อมูลไม่ถูกต้อง → 400) | 201 |
| PUT | `/api/requests/:id` | เปลี่ยนสถานะ | 200 |
| DELETE | `/api/requests/:id` | ลบ (ไม่มี → 404) | 204 |

Middleware: `logger` (พิมพ์ method/path/status/เวลา), `validateRequest` (ตรวจ body), `errorHandler` (จัดการ error รวมศูนย์) ข้อมูลตั้งต้นอยู่ที่ `data/initialRequests.json`

## 2. วิธีรัน

```bash
cd labs/week-06/source
npm install
npm start          # http://localhost:3001
npm run dev        # โหมด watch
```

## 3. วิธีทดสอบ

```bash
npm run check      # checker ยิง request จริงเข้า API (supertest)
```
และทดสอบด้วยมือด้วย `curl` ตามภาพหลักฐาน ตรวจ log จาก logger ใน terminal ที่รันเซิร์ฟเวอร์

### ผลการทดสอบ

| รายการ | ผล |
|---|---|
| `npm run check` | **ผ่าน 28/28 รายการ** |
| GET / | 200 |
| GET /api/requests/REQ-999 | 404 พร้อมข้อความ error |
| POST ถูกต้อง | 201 สถานะ `pending` |
| POST ข้อมูลไม่ถูกต้อง | 400 พร้อมรายการ details |
| PUT เปลี่ยนสถานะ / DELETE | 200 / 204 |
| Logger | พิมพ์ทุก request พร้อม status และเวลา

## 4. หลักฐาน

ภาพทั้งหมดอยู่ใน [`evidence/`](evidence/) เป็นไฟล์ `.jpg` ถ่ายจากการรันโปรแกรมจริง (หน้าเว็บจับภาพด้วย Chromium ที่ความกว้าง 1280px และ 375px ส่วนผลคำสั่งใน terminal เรนเดอร์จากผลลัพธ์จริงของคำสั่งนั้น) เมื่อวันที่ 29 ตุลาคม 2569

| # | ภาพ | สิ่งที่แสดง |
|---|---|---|
| 1 | [01-api-requests-transcript.jpg](evidence/01-api-requests-transcript.jpg) | รัน `npm start` แล้วยิง curl ทุก endpoint พร้อม log ของ logger ท้ายภาพ |
| 2 | [02-npm-run-check.jpg](evidence/02-npm-run-check.jpg) | ผล `npm run check` ผ่าน 28/28 |

## 5. การส่งงาน

- Source code: [`source/`](source/)
- เว็บที่ build แล้ว: `publish/`
- Submission tag: `lab-06-submission-v1`

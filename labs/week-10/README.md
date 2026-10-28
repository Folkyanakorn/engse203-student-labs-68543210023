# Week 10 — Node.js + SQLite (Node-Database)

**ผู้จัดทำ:** นายญาณากร หวังระบอบ · รหัสนักศึกษา 68543210023 · GitHub: Folkyanakorn

## 1. โจทย์

เปลี่ยนที่เก็บข้อมูลของ API จากไฟล์ JSON เป็น **ฐานข้อมูล SQLite** ด้วย `node:sqlite` (Node 22) โดยให้ API ภายนอกทำงานเหมือนเดิมทุกอย่าง

- **CP26–CP27** เปิดฐานข้อมูลด้วย `DatabaseSync`, เปิด `PRAGMA foreign_keys = ON` และอ้างตำแหน่งไฟล์จาก `import.meta.url`
- **CP28** `findAll` ใช้ `JOIN` กับตาราง `users` และคืน `requesterName` (ไม่ใช่ `requester_id`) รองรับการกรอง `?status=` ด้วย `WHERE`
- **CP29** `create` แปลงชื่อผู้แจ้งเป็น `requester_id` ให้เอง (สร้าง user ใหม่ถ้ายังไม่มี)
- **CP30** `PUT` / `DELETE` ทำงานกับฐานข้อมูล
- **CP31** ป้องกัน **SQL injection** ด้วย `prepare()` + placeholder `?`
- **CP32–CP34** error handler รวมศูนย์, automated test, อัปเดต [`API_CONTRACT.md`](source/API_CONTRACT.md)

โครงสร้างตาราง `users` และ `requests` (FK `requests.requester_id → users.id`) อยู่ที่ `api/data/schema.sql`

## 2. วิธีรัน

```bash
# terminal 1 — API + ฐานข้อมูล
cd labs/week-10/source/api
npm install
cp .env.example .env
npm run db:setup         # สร้าง data/campus.db (ถ้ามีอยู่แล้วจะไม่ทำอะไร)
npm run db:reset         # สร้างใหม่ทับของเดิมพร้อมข้อมูลตั้งต้น
npm run dev              # http://localhost:3001

# terminal 2 — frontend
cd labs/week-10/source/frontend
npm install
npm run dev              # http://localhost:5173
```

## 3. วิธีทดสอบ

```bash
cd labs/week-10/source/api
npm test                 # automated test (supertest + SQLite)

cd labs/week-10/source
node --disable-warning=ExperimentalWarning check-week10.mjs
```

### ผลการทดสอบ

| รายการ | ผล |
|---|---|
| `npm test` (api) | **8/8 ผ่าน** (รวมทดสอบ SQL injection และ CORS) |
| `check-week10.mjs` | **ผ่าน 31/31** (ในห้อง 20 · ที่บ้าน 8 · Challenge 3) |
| `?status=' OR 1=1 --` | คืน `[]` (ไม่หลุด) HTTP 200 |
| ฐานข้อมูลหลัง `db:reset` | `users` 4 แถว, `requests` 8 แถว, FK ถูกต้อง |
| หน้าจอ 375px | ไม่มีแถบเลื่อนแนวนอน |

## 4. หลักฐาน

ภาพทั้งหมดอยู่ใน [`evidence/`](evidence/) เป็นไฟล์ `.jpg` ถ่ายจากการรันโปรแกรมจริง (หน้าเว็บจับภาพด้วย Chromium ที่ความกว้าง 1280px และ 375px ส่วนผลคำสั่งใน terminal เรนเดอร์จากผลลัพธ์จริงของคำสั่งนั้น) เมื่อวันที่ 29 ตุลาคม 2569

| # | ภาพ | สิ่งที่แสดง |
|---|---|---|
| 1 | [01-api-transcript.jpg](evidence/01-api-transcript.jpg) | รัน API แล้วยิง curl ทุก endpoint รวมกรอง `?status=` และยิง SQL injection (ได้ `[]`) |
| 2 | [02-api-npm-test.jpg](evidence/02-api-npm-test.jpg) | ผล `npm test` ผ่าน 8/8 |
| 3 | [03-check-week10.jpg](evidence/03-check-week10.jpg) | ผล `check-week10.mjs` ผ่าน 31/31 |
| 4 | [04-database-sqlite.jpg](evidence/04-database-sqlite.jpg) | ผล query ตาราง `users` และ JOIN `requests` กับ `users` ใน `campus.db` |
| 5 | [05-dashboard.jpg](evidence/05-dashboard.jpg) | Dashboard ของ React โหลดข้อมูลจาก API ที่อ่านจาก SQLite |
| 6 | [06-filter-pending.jpg](evidence/06-filter-pending.jpg) | กรองตามสถานะ |
| 7 | [07-detail-page.jpg](evidence/07-detail-page.jpg) | หน้ารายละเอียดคำร้อง |
| 8 | [08-new-request-form.jpg](evidence/08-new-request-form.jpg) | ฟอร์มสร้างคำร้อง |
| 9 | [09-new-request-validation.jpg](evidence/09-new-request-validation.jpg) | validation |
| 10 | [10-after-submit.jpg](evidence/10-after-submit.jpg) | สร้างคำร้องสำเร็จ (บันทึกลงฐานข้อมูล) |
| 11 | [11-persist-after-reload.jpg](evidence/11-persist-after-reload.jpg) | refresh แล้วข้อมูลยังอยู่ |
| 12 | [12-detail-not-found.jpg](evidence/12-detail-not-found.jpg) | เปิด ID ที่ไม่มี |
| 13 | [13-not-found-404.jpg](evidence/13-not-found-404.jpg) | URL ที่ไม่มีอยู่ |
| 14 | [14-about.jpg](evidence/14-about.jpg) | หน้า About |
| 15 | [15-mobile-375.jpg](evidence/15-mobile-375.jpg) | มือถือ 375px |

## 5. การส่งงาน

- Source code: [`source/`](source/)
- เว็บที่ build แล้ว: `publish/`
- Submission tag: `lab-10-submission-v1`

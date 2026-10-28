# Week 07 — RESTful API, Validation & Error Handling

**ผู้จัดทำ:** นายญาณากร หวังระบอบ · รหัสนักศึกษา 68543210023 · GitHub: Folkyanakorn

> **การใช้ AI:** ดูรายละเอียดที่ [`source/AI_USAGE.md`](source/AI_USAGE.md)

## 1. โจทย์

พัฒนา API ต่อจากสัปดาห์ที่ 6 ให้เป็น **RESTful API ที่ใช้งานจริงกับ React** และแยกโปรเจกต์เป็น `api/` กับ `frontend/`

- **CP09–CP10** จัดการ config ผ่าน environment (`PORT`, `CORS_ORIGIN`) และเปิด **CORS** ให้ frontend เรียกข้ามพอร์ตได้
- **CP11–CP12** frontend เรียก API ผ่าน `apiClient` (fetch, `ApiError`, loading/error state) แทนการใช้ localStorage
- **CP13** เพิ่ม `PUT /api/requests/:id` เปลี่ยนสถานะ (status ไม่ถูกต้อง → 400) และใช้ `morgan` เป็น logger
- **CP15** เขียน [`API_CONTRACT.md`](source/API_CONTRACT.md) ครอบคลุมทุก endpoint
- **CP16** เขียน automated test ด้วย `supertest`

## 2. วิธีรัน

ต้องเปิด 2 terminal:

```bash
# terminal 1 — API
cd labs/week-07/source/api
npm install
cp .env.example .env     # ค่าเริ่มต้น PORT=3001, CORS_ORIGIN=http://localhost:5173
npm run dev              # http://localhost:3001

# terminal 2 — frontend
cd labs/week-07/source/frontend
npm install
npm run dev              # http://localhost:5173
```

## 3. วิธีทดสอบ

```bash
# automated test ของ API (supertest)
cd labs/week-07/source/api
npm test
npm run check

# checker ของสัปดาห์ 7 (ต้องรันที่ source/)
cd labs/week-07/source
node check-week07.mjs
```
จากนั้นเปิด frontend คู่กับ API แล้วดูด้วยตาว่า Dashboard โหลดข้อมูลจาก API จริง

### ผลการทดสอบ

| รายการ | ผล |
|---|---|
| `npm test` (api) | **6/6 ผ่าน** |
| `npm run check` (api) | ผ่าน 28/28 |
| `node check-week07.mjs` | **ผ่าน 36/36** (ในห้อง 25 · ที่บ้าน 8 · Challenge 3) |
| Dashboard โหลดจาก API | ผ่าน (ดูภาพที่ 5) |
| หน้าจอ 375px | ไม่มีแถบเลื่อนแนวนอน |

หมายเหตุ: `npm run verify` ในโฟลเดอร์ `frontend/` เป็นตัวตรวจของสัปดาห์ที่ 5 (ตรวจ localStorage) จึงรายงานรายการที่ไม่ตรงกับสถาปัตยกรรมที่เปลี่ยนมาใช้ API แล้ว ตัวตรวจที่ใช้ประเมินสัปดาห์นี้คือ `check-week07.mjs`

## 4. หลักฐาน

ภาพทั้งหมดอยู่ใน [`evidence/`](evidence/) เป็นไฟล์ `.jpg` ถ่ายจากการรันโปรแกรมจริง (หน้าเว็บจับภาพด้วย Chromium ที่ความกว้าง 1280px และ 375px ส่วนผลคำสั่งใน terminal เรนเดอร์จากผลลัพธ์จริงของคำสั่งนั้น) เมื่อวันที่ 29 ตุลาคม 2569

| # | ภาพ | สิ่งที่แสดง |
|---|---|---|
| 1 | [01-api-transcript.jpg](evidence/01-api-transcript.jpg) | รัน API แล้วยิง curl: GET / POST (201/400) / PUT / DELETE / กรอง `?status=` พร้อม log ของ morgan |
| 2 | [02-api-npm-test.jpg](evidence/02-api-npm-test.jpg) | ผล `npm test` ผ่าน 6/6 |
| 3 | [03-api-npm-run-check.jpg](evidence/03-api-npm-run-check.jpg) | ผล `npm run check` ของ api |
| 4 | [04-check-week07.jpg](evidence/04-check-week07.jpg) | ผล `node check-week07.mjs` ผ่าน 36/36 |
| 5 | [05-dashboard.jpg](evidence/05-dashboard.jpg) | Dashboard ของ React โหลดข้อมูลจาก API จริง |
| 6 | [06-filter-pending.jpg](evidence/06-filter-pending.jpg) | กรองตามสถานะ |
| 7 | [07-detail-page.jpg](evidence/07-detail-page.jpg) | หน้ารายละเอียดคำร้องจาก API |
| 8 | [08-new-request-form.jpg](evidence/08-new-request-form.jpg) | ฟอร์มสร้างคำร้อง |
| 9 | [09-new-request-validation.jpg](evidence/09-new-request-validation.jpg) | validation ฝั่ง frontend |
| 10 | [10-after-submit.jpg](evidence/10-after-submit.jpg) | สร้างคำร้องผ่าน POST แล้วเห็นรายละเอียด (มีปุ่มเปลี่ยนสถานะ ใช้ PUT) |
| 11 | [11-persist-after-reload.jpg](evidence/11-persist-after-reload.jpg) | refresh แล้วข้อมูลยังอยู่ (เก็บที่ฝั่ง API) |
| 12 | [12-detail-not-found.jpg](evidence/12-detail-not-found.jpg) | เปิด ID ที่ไม่มี — API ตอบ 404 และหน้าแจ้งไม่พบ |
| 13 | [13-not-found-404.jpg](evidence/13-not-found-404.jpg) | URL ที่ไม่มีอยู่ |
| 14 | [14-about.jpg](evidence/14-about.jpg) | หน้า About |
| 15 | [15-mobile-375.jpg](evidence/15-mobile-375.jpg) | มือถือ 375px |

## 5. การส่งงาน

- Source code: [`source/`](source/)
- เว็บที่ build แล้ว: `publish/`
- Submission tag: `lab-07-submission-v1`

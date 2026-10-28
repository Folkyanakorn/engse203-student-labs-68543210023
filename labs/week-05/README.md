# Week 05 — React Routing & Data Fetching Mini App

**ผู้จัดทำ:** นายญาณากร หวังระบอบ · รหัสนักศึกษา 68543210023 · GitHub: Folkyanakorn

## 1. โจทย์

ต่อยอดแอปคำร้องจากสัปดาห์ที่ 4 ให้เป็น **mini app แบบหลายหน้า** ด้วย React Router (`HashRouter`) และแยกชั้นข้อมูลออกจาก UI

- เส้นทาง: `/` Dashboard, `/requests/new` ฟอร์มสร้างคำร้อง, `/requests/:requestId` รายละเอียด (dynamic route), `/about`, และหน้า 404 (`*`)
- `pages/` ถือ state ของแต่ละหน้า, `components/` รับข้อมูลผ่าน props
- `requestService.js` เป็นชั้นเข้าถึงข้อมูลเพียงจุดเดียว และ `requestStorage.js` เป็นไฟล์เดียวที่ใช้ `localStorage` (ข้อมูลไม่หายเมื่อ refresh)
- จัดการสถานะ loading / error / empty และตรวจ schema ของข้อมูลใน storage

## 2. วิธีรัน

```bash
cd labs/week-05/source
npm ci
npm run dev        # เปิด http://localhost:5173
npm run build
npm run preview
```

## 3. วิธีทดสอบ

```bash
npm run check      # checker v2 ตรวจ contract ทั้งหมด
npm run build
```
และทดสอบ runtime ใน browser: เปลี่ยนหน้าด้วย URL, เพิ่มคำร้องแล้ว refresh ข้อมูลต้องไม่หาย, เปิด ID ที่ไม่มี และเปิด URL ที่ไม่มีอยู่

### ผลการทดสอบ

| รายการ | ผล |
|---|---|
| `npm run check` | **ผ่าน 133/133 รายการ** |
| `npm run build` | ผ่าน |
| Refresh แล้วข้อมูลคงอยู่ (localStorage) | ผ่าน (ดูภาพที่ 7) |
| ID ที่ไม่มี / URL ที่ไม่มี | แสดงหน้าแจ้งไม่พบ / 404 |
| หน้าจอ 375px | ไม่มีแถบเลื่อนแนวนอน |
| Console error | ไม่มี |

## 4. หลักฐาน

ภาพทั้งหมดอยู่ใน [`evidence/`](evidence/) เป็นไฟล์ `.jpg` ถ่ายจากการรันโปรแกรมจริง (หน้าเว็บจับภาพด้วย Chromium ที่ความกว้าง 1280px และ 375px ส่วนผลคำสั่งใน terminal เรนเดอร์จากผลลัพธ์จริงของคำสั่งนั้น) เมื่อวันที่ 29 ตุลาคม 2569

| # | ภาพ | สิ่งที่แสดง |
|---|---|---|
| 1 | [01-dashboard.jpg](evidence/01-dashboard.jpg) | Dashboard โหลดรายการและตัวเลขสรุป |
| 2 | [02-filter-pending.jpg](evidence/02-filter-pending.jpg) | กรองรายการตามสถานะ |
| 3 | [03-detail-page.jpg](evidence/03-detail-page.jpg) | หน้ารายละเอียด `/requests/:requestId` อ่าน ID จาก URL |
| 4 | [04-new-request-form.jpg](evidence/04-new-request-form.jpg) | หน้าฟอร์มสร้างคำร้อง `/requests/new` |
| 5 | [05-new-request-validation.jpg](evidence/05-new-request-validation.jpg) | ส่งฟอร์มเปล่า — แสดง validation |
| 6 | [06-after-submit.jpg](evidence/06-after-submit.jpg) | สร้างคำร้องสำเร็จแล้วไปหน้ารายละเอียด |
| 7 | [07-persist-after-reload.jpg](evidence/07-persist-after-reload.jpg) | refresh หน้า — คำร้องที่เพิ่มยังอยู่ (persist) |
| 8 | [08-detail-not-found.jpg](evidence/08-detail-not-found.jpg) | เปิด ID ที่ไม่มี (`REQ-999`) |
| 9 | [09-not-found-404.jpg](evidence/09-not-found-404.jpg) | เปิด URL ที่ไม่มี — หน้า 404 |
| 10 | [10-about.jpg](evidence/10-about.jpg) | หน้า About |
| 11 | [11-mobile-375.jpg](evidence/11-mobile-375.jpg) | มือถือ 375px |
| 12 | [12-npm-run-check.jpg](evidence/12-npm-run-check.jpg) | ผล `npm run check` ผ่าน 133/133 |
| 13 | [13-npm-run-build.jpg](evidence/13-npm-run-build.jpg) | ผล `npm run build` |

## 5. การส่งงาน

- Source code: [`source/`](source/)
- เว็บที่ build แล้ว: `publish/`
- Submission tag: `lab-05-submission-v1`

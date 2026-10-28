# Week 04 — React Campus Service Request

**ผู้จัดทำ:** นายญาณากร หวังระบอบ · รหัสนักศึกษา 68543210023 · GitHub: Folkyanakorn

## 1. โจทย์

เปลี่ยนหน้าเว็บ **Campus Service Request** ที่เขียนแบบ DOM-driven ในสัปดาห์ที่ 3 ให้เป็น **State-driven UI ด้วย React** โดยแยกเป็น component (`App`, `SummaryPanel`, `RequestForm`, `FilterBar`, `RequestList`, `RequestCard`) ให้ `App` เป็นเจ้าของ state หลัก (`requests`, `statusFilter`) ส่งข้อมูลลงด้วย props และรับเหตุการณ์กลับด้วย callback

ฟังก์ชันที่ต้องทำได้: แสดงรายการคำร้องและตัวเลขสรุป, กรอกฟอร์มแบบ controlled input พร้อม validation, เพิ่มคำร้อง, กรองตามสถานะ, ลบคำร้อง, แสดง empty state, ใช้งานบนมือถือ 375px ได้ และใช้คีย์บอร์ดได้

รายละเอียดสถาปัตยกรรมและ Component Tree อยู่ที่ [`source/README.md`](source/README.md)

## 2. วิธีรัน

```bash
cd labs/week-04/source
npm install
npm run dev        # เปิด http://localhost:5173
npm run build      # build ลง dist/
npm run preview    # ดูผล build
```
ต้องใช้ Node 22 (`nvm use` อ่านจาก `.nvmrc`)

## 3. วิธีทดสอบ

```bash
npm run check      # ตัวตรวจอัตโนมัติของ LAB 4
npm run build      # ต้อง build ผ่านโดยไม่มี error
```
จากนั้นทดสอบด้วยมือตามกรณี TC-01–TC-12 ในเบราว์เซอร์ (รายละเอียดอยู่ใน [`source/README.md`](source/README.md))

### ผลการทดสอบ

| รายการ | ผล |
|---|---|
| `npm run check` | PASS |
| `npm run build` | ผ่าน (build สำเร็จ) |
| หน้าจอ 375px | ไม่มีแถบเลื่อนแนวนอน (`scrollWidth = 375`) |
| Console error ระหว่างใช้งาน | ไม่มี |

## 4. หลักฐาน

ภาพทั้งหมดอยู่ใน [`evidence/`](evidence/) เป็นไฟล์ `.jpg` ถ่ายจากการรันโปรแกรมจริง (หน้าเว็บจับภาพด้วย Chromium ที่ความกว้าง 1280px และ 375px ส่วนผลคำสั่งใน terminal เรนเดอร์จากผลลัพธ์จริงของคำสั่งนั้น) เมื่อวันที่ 29 ตุลาคม 2569

| # | ภาพ | สิ่งที่แสดง |
|---|---|---|
| 1 | [01-desktop-initial.jpg](evidence/01-desktop-initial.jpg) | TC-01 หน้าแรก แสดงคำร้องเริ่มต้น 3 รายการ และตัวเลขสรุป |
| 2 | [02-validation-error.jpg](evidence/02-validation-error.jpg) | TC-03 กดส่งฟอร์มเปล่า — แสดงข้อความผิดพลาดสีแดงใต้ช่องที่ผิด |
| 3 | [03-form-filled.jpg](evidence/03-form-filled.jpg) | TC-02 กรอกฟอร์ม (controlled input) |
| 4 | [04-add-success.jpg](evidence/04-add-success.jpg) | TC-04 เพิ่มคำร้องสำเร็จ — คำร้องใหม่อยู่บนสุด ตัวเลขสรุปเพิ่ม |
| 5 | [05-filter-pending.jpg](evidence/05-filter-pending.jpg) | TC-05 กรองสถานะ “รอดำเนินการ” |
| 6 | [06-filter-completed.jpg](evidence/06-filter-completed.jpg) | TC-05 กรองสถานะ “เสร็จสิ้น” |
| 7 | [07-after-delete.jpg](evidence/07-after-delete.jpg) | TC-08 ลบคำร้อง — รายการและตัวเลขสรุปอัปเดต |
| 8 | [08-empty-state.jpg](evidence/08-empty-state.jpg) | TC-07 empty state เมื่อไม่มีคำร้อง |
| 9 | [09-mobile-375.jpg](evidence/09-mobile-375.jpg) | TC-09 มือถือ 375px — เลย์เอาต์ 1 คอลัมน์ |
| 10 | [10-keyboard-focus.jpg](evidence/10-keyboard-focus.jpg) | TC-10 กด Tab แล้วมีกรอบ focus |
| 11 | [11-npm-run-check.jpg](evidence/11-npm-run-check.jpg) | ผล `npm run check` = PASS |
| 12 | [12-npm-run-build.jpg](evidence/12-npm-run-build.jpg) | ผล `npm run build` สำเร็จ |

## 5. การส่งงาน

- Source code: [`source/`](source/)
- เว็บที่ build แล้ว: `publish/`
- Submission tag: `lab-04-submission-v1`

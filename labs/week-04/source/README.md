# ENGSE203 LAB 4 — Student Evidence README

## ผู้จัดทำ

- ชื่อ–นามสกุล: นายญาณากร หวังระบอบ
- รหัสนักศึกษา: 68543210023
- Section: 2

## URLs

- Repository: https://github.com/Folkyanakorn/engse203-student-labs-68543210023
- Pull Request: https://github.com/Folkyanakorn/engse203-student-labs-68543210023/pull/4
- GitHub Pages: https://Folkyanakorn.github.io/engse203-student-labs-68543210023/labs/week-04/

## Component Tree

```text
App (State Owner: requests, statusFilter)
├── AppHeader
├── SummaryPanel (รับ props: summary)
├── RequestForm (State Owner: formData, errors, feedback | รับ props: onAddRequest)
├── FilterBar (รับ props: value, onFilterChange)
└── RequestList (รับ props: requests, onDeleteRequest)
    └── RequestCard (รับ props: request, onDeleteRequest)
```

## Setup และ Run

```bash
nvm use
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## State / Props / Callback Explanation

State : App เป็น State Owner หลักที่เก็บข้อมูล requests และ statusFilter ส่วน RequestForm จะเป็นเจ้าของ State ที่ใช้จัดการฟอร์มของตัวเอง (formData, errors, feedback)

Props (Data Flow) : ข้อมูลจะไหลจากบนลงล่าง (Top-down) โดย App จะคำนวณและส่งข้อมูลที่จำเป็นไปให้ Component ลูก เช่น ส่ง summary ไปให้ SummaryPanel และส่ง filteredRequests ไปให้ RequestList

Callback (Event Flow) : เหตุการณ์จะไหลจากล่างขึ้นบน (Bottom-up) เช่น เมื่อผู้ใช้กดปุ่มลบใน RequestCard จะเรียกใช้ฟังก์ชัน onDeleteRequest ที่ถูกส่งต่อมาเป็นทอดๆ เพื่อกลับไปสั่งให้ App อัปเดต State requests หลัก

## Test Evidence

| Test ID | Actual Result | Pass/Fail | Evidence/Screenshot |
|---|---|---|---|
| TC-01 Initial | หน้าเว็บแสดงคำร้องเริ่มต้น 3 รายการถูกต้อง ค่า Summary (Total, Pending, In-Progress, Completed) นับได้ถูกต้อง และไม่มี Error ใน Console | Pass | [evidence/desktop.png](../evidence/desktop.png) |
| TC-02 Controlled input | เมื่อพิมพ์ข้อความ หรือเลือกตัวเลือกในฟอร์ม ข้อมูลบนหน้าจอจะสะท้อนตาม State ทันที | Pass | [evidence/desktop2.png](../evidence/desktop2.png) |
| TC-03 Invalid | หากกรอกข้อมูลไม่ครบหรือสั้นเกินไป ระบบไม่บันทึกคำร้อง และแสดงข้อความ Error สีแดงพร้อมขอบสีแดงใต้ช่องที่ผิด | Pass | [evidence/validation.png](../evidence/validation.png) |
| TC-04 Valid add | เมื่อกรอกข้อมูลถูกต้อง ระบบเพิ่มคำร้องใหม่ไว้บนสุดในสถานะ Pending ฟอร์มถูกล้างค่า และมีข้อความสีเขียวแจ้งว่า "เพิ่มคำร้องสำเร็จ" | Pass | [evidence/success-result.png](../evidence/success-result.png) |
| TC-05 Filter | เมื่อคลิกปุ่มกรองสถานะ เช่น "รอดำเนินการ" รายการคำร้องจะแสดงเฉพาะคำร้องที่ตรงกับสถานะที่เลือกเท่านั้น | Pass | [evidence/desktop3.png](../evidence/desktop3.png) |
| TC-06 All | เมื่อคลิกปุ่ม "ทั้งหมด" รายการคำร้องทุกสถานะจะกลับมาแสดงครบถ้วนตามปกติ | Pass | [evidence/desktop4.png](../evidence/desktop4.png) |
| TC-07 Empty | เมื่อใช้ตัวกรองที่ไม่มีคำร้อง หรือกดลบจนหมด หน้าจอจะแสดงกล่องข้อความ "ยังไม่มีคำร้องในสถานะนี้ หรือลองเพิ่มคำร้องใหม่" | Pass | [evidence/empty-state.png](../evidence/empty-state.png) |
| TC-08 Delete | เมื่อกดปุ่ม "ลบ" ที่คำร้องใด คำร้องนั้นจะหายไปจากรายการทันที และตัวเลขใน Summary จะอัปเดตลดลงถูกต้อง | Pass | [evidence/desktop5.png](../evidence/desktop5.png) |
| TC-09 Mobile | เมื่อปรับขนาดหน้าจอเป็น 375px เลย์เอาต์จะเปลี่ยนเป็น 1 คอลัมน์ อ่านง่าย และไม่มีการเลื่อนแนวนอน (No horizontal scroll) | Pass | [evidence/mobile-375.png](../evidence/mobile-375.png) |
| TC-10 Keyboard | สามารถกดปุ่ม Tab เพื่อเลื่อน Focus ไปตามช่องต่างๆ ได้ โดยมีกรอบสีฟ้า (Outline) แสดงชัดเจน และกด Enter เพื่อ Submit ได้ | Pass | [evidence/desktop6.png](../evidence/desktop6.png) |
| TC-11 Build | รันคำสั่ง npm run build ผ่านโดยไม่มี Error และสามารถรัน npm run preview เพื่อดูผลลัพธ์ได้ปกติ | Pass | - |
| TC-12 Pages | เมื่อนำลิงก์ GitHub Pages ไปเปิดในหน้าต่าง Incognito ตัวเว็บและ CSS สามารถโหลดมาแสดงผลได้สมบูรณ์ ไม่มีแจ้งเตือน 404 Not Found | Pass | [evidence/pages-incognito.png](../evidence/pages-incognito.png) |

## Screenshots

- Desktop: `evidence/desktop.png`
- Mobile 375px: `evidence/mobile-375.png`
- Validation/empty state: `evidence/validation.png`, `evidence/empty-state.png`
- Success add: `evidence/success-result.png`
- Keyboard focus: `evidence/desktop6.png`

## Week 03 → Week 04 Reflection

จากการเขียนโค้ดใน Week 03 ที่เป็นแบบ DOM-driven เราต้องคอยใช้คำสั่งอย่าง document.querySelector เพื่อค้นหา Element และอัปเดตค่าต่างๆ ด้วยตัวเองทีละจุด เช่น การแก้ textContent, setAttribute หรือการต่อแท็ก HTML ใหม่ด้วย createElement และ appendChild วิธีการนี้เมื่อ UI มีความซับซ้อนมากขึ้น จะทำให้โค้ดยาวและคอยติดตามการเปลี่ยนแปลงได้ยาก แต่ใน Week 04 ที่เปลี่ยนมาใช้ State-driven UI ด้วย React เพียงแค่กำหนดข้อมูลลงในตัวแปร State และเขียนโครงสร้าง UI รอไว้ด้วย JSX เมื่อข้อมูลใน State เปลี่ยนแปลง React จะรับหน้าที่คำนวณและอัปเดต DOM ในส่วนที่เกี่ยวข้องทั้งหมดให้โดยอัตโนมัติ ซึ่งช่วยลดข้อผิดพลาดและทำให้โค้ดเป็นระเบียบมากขึ้น

## AI / External Resource Disclosure

ใช้ Gemini ในการช่วยให้คำปรึกษาและตรวจสอบโค้ดในจุดต่างๆ ดังนี้:
1. แนะนำการเขียน CSS สำหรับดักจับสถานะ `:focus-visible` และ `[aria-invalid="true"]` เพื่อให้ตรงกับ Requirement R12
2. ช่วยเรียบเรียงข้อความในส่วน Week 03 → Week 04 Reflection และช่วยจัดทำรูปแบบตาราง Test Evidence

วิธีตรวจสอบความถูกต้อง: หลังจากนำโค้ดและ CSS มาปรับใช้ ได้ทำการรัน `npm run dev` เพื่อทดสอบการใช้งานจริงบนเบราว์เซอร์ครบทุก Test Case (TC-01 ถึง TC-10) และรัน `npm run check` เพื่อยืนยันว่าโค้ดผ่านเงื่อนไขทั้งหมดเรียบร้อยแล้ว


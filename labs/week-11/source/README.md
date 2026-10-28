# Campus Service — Full-Stack (Week 11 · starter)


## สถาปัตยกรรม 3 ชั้น
```text
┌─────────┐  HTTP   ┌──────────┐  SQL   ┌─────────┐
│ React   │ ──────► │ Express  │ ─────► │ SQLite  │
└─────────┘  JSON   └──────────┘  rows  └─────────┘
```

| ชั้น | หน้าที่ | โฟลเดอร์ |
|---|---|---|
| Frontend | หน้าจอผู้ใช้ | `frontend/` |
| API | route · controller · service | `api/src/` |
| Database | เก็บข้อมูล | `api/data/` |

## วิธีรัน (Dev)
เปิด 2 Terminal เข้าโฟลเดอร์ `labs/week-11/source/`

**Terminal 1 API เข้าไปที่โฟลเดอร์ `labs/week-11/source/api`**
```bash
cd api
npm install
npm run dev
# API จะรันอยู่ที่ http://localhost:3001
```
**Terminal 2 Frontend เข้าไปที่โฟลเดอร์ `labs/week-11/source/frontend`**
```bash
cd frontend
npm install
npm run dev
# หน้าเว็บจะรันอยู่ที่ http://localhost:5173
```
## วิธีรัน (Production)
ให้ไปที่ `labs/week-11/source/`
```bash
cd frontend 
npm run build
# รัน production mode เข้าไปที่ api/
cd ../api
# รันแอปพลิเคชันรวมเป็นพอร์ตเดียว (จำลองพอร์ต 10000 เพื่อไม่ให้ชนกับค่าเดิม)
NODE_ENV=production PORT=10000 npm start
# เปิด http://localhost:10000/ เพื่อใช้งานหน้าเว็บ
```

## ตาราง Environment Variables

**ฝั่ง API (api/.env)**
| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| PORT | 3001 | พอร์ตที่ API ใช้รับคำขอ |
| CORS_ORIGIN | http://localhost:5173 | Origin ที่อนุญาตให้เรียกใช้งาน API ข้ามโดเมนได้ |
| NODE_ENV | development | ตัวแยกโหมดการทำงาน |
| DB_FILE | ไฟล์ campus.db ใน data/ | ตำแหน่งอ้างอิงของไฟล์ฐานข้อมูล SQLite |

---

**ฝั่ง Frontend (.env.production)**
| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| VITE_API_BASE_URL | - | กำหนดให้เรียก API ด้วย path สัมพัทธ์ /api/... (บน origin เดียวกับหน้าเว็บ) เมื่อทำการ build เป็น production |
---

## การตัดสินใจออกแบบ
- การแบ่งสถาปัตยกรรม 3 ชั้น การแยก Frontend, API และ Database ออกจากกันอย่างชัดเจนช่วยลดความซับซ้อนของโค้ด หากจำเป็นต้องเปลี่ยนเทคโนโลยีในชั้นใดชั้นหนึ่ง (เช่น เปลี่ยนฐานข้อมูล) ก็จะส่งผลกระทบและทำการแก้ไขเฉพาะในชั้นของ Service เท่านั้น โดยไม่ต้องแก้ไขโค้ดที่ฝั่ง Frontend

## Live Demo
🔗 TODO: ใส่ลิงก์ Render ของคุณ

หมายเหตุ: Render free tier — เปิดครั้งแรกช้า 30–60 วินาที
ข้อมูลที่เพิ่มจะกลับเป็นค่าตั้งต้นเมื่อ restart (ephemeral filesystem)
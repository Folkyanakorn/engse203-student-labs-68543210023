import { useState } from 'react';

function RequestForm({ onAddRequest }) {
  const initialForm = {
    requesterName: '',
    requestType: '',
    location: '',
    details: '',
    priority: 'normal',
  };
  const [formData , setFormData] = useState(initialForm);
  const [errors , setErrors] = useState({});
  const [feedback , setFeedback] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    // TODO LAB4-R05–R07: validate controlled state แล้วเรียก onAddRequest
    const nextErrors ={};
    if (formData.requesterName.trim().length < 2) {
      nextErrors.requesterName = 'ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร';
    }
    if (!formData.requestType) {
      nextErrors.requestType = 'กรุณาเลือกประเภทคำร้อง';
    }
    if (formData.location.trim().length ===0) {
      nextErrors.location = 'กรุณาระบุสถานที่';
    }
    if (formData.details.trim().length < 10) {
      nextErrors.details = 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร';
    }
    if (Object.keys(nextErrors).length >0) {
      setErrors(nextErrors);
      setFeedback('');
      return;
    }

    onAddRequest(formData);
    setFormData(initialForm);
    setErrors({});
    setFeedback('เพิ่มคำร้องสำเร็จ');
  }

  return (
    <section className="panel" aria-labelledby="request-form-title">
      <p className="eyebrow dark">CONTROLLED FORM</p>
      <h2 id="request-form-title">สร้างคำร้องใหม่</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>
          <input 
            id="requesterName" 
            name="requesterName" 
            value={formData.requesterName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requesterName)}
            aria-describedby={errors.requesterName ? "requesterName-error" : undefined}
          />
          <small className="error" id="requesterName-error">{errors.requesterName}</small>
        </div>

        <div className="field">
          <label htmlFor="requestType">ประเภทคำร้อง</label>
          <select 
            id="requestType" 
            name="requestType" 
            value={formData.requestType}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requestType)}
            aria-describedby={errors.requestType ? "requestType-error" : undefined}
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="แจ้งซ่อม">แจ้งซ่อม</option>
            <option value="ขอใช้ห้อง">ขอใช้ห้อง</option>
            <option value="บริการบัญชีผู้ใช้">บริการบัญชีผู้ใช้</option>
          </select>
          <small className="error" id="requestType-error">{errors.requestType}</small>
        </div>

        <div className="field">
          <label htmlFor="location">สถานที่</label>
          <input 
            id="location" 
            name="location" 
            value={formData.location}
            onChange={handleChange}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-error" : undefined}
          />
          <small className="error" id="location-error">{errors.location}</small>
        </div>

        <div className="field">
          <label htmlFor="details">รายละเอียด</label>
          <textarea 
            id="details" 
            name="details" 
            rows="4"
            value={formData.details}
            onChange={handleChange}
            aria-invalid={Boolean(errors.details)}
            aria-describedby={errors.details ? "details-error" : undefined}
          ></textarea>
          <small className="error" id="details-error">{errors.details}</small>
        </div>

        <fieldset className="field">
          <legend>ความเร่งด่วน</legend>
          <label>
            <input 
              type="radio" 
              name="priority" 
              value="normal" 
              checked={formData.priority === 'normal'}
              onChange={handleChange} /> ปกติ
            </label>
          <label>
            <input 
              type="radio" 
              name="priority" 
              value="urgent" 
              checked={formData.priority === 'urgent'}
              onChange={handleChange} /> เร่งด่วน
          </label>
          <small className="error" id="priority-error"></small>
        </fieldset>

        <button type="submit">เพิ่มคำร้อง</button>
        {feedback && <p className="status" role="status" style={{ color: 'green' }}>{feedback}</p>}
      </form>
    </section>
  );
}

export default RequestForm;


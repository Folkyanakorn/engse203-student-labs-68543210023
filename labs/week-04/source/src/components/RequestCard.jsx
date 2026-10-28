function RequestCard({ request, onDeleteRequest }) {
  return (
    <article className="request-card">
      <div>
        <p className="request-id">
          <span style={{ marginRight: '0.5rem' }}>{request.id}</span>
          <span className={`badge ${request.priority}`}>
            {request.priority === 'urgent' ? 'เร่งด่วน' : 'ปกติ'}
          </span>
          <span className={`badge ${request.status}`}>
            {request.status === 'pending' ? 'รอดำเนินการ' : 
             request.status === 'in-progress' ? 'กำลังดำเนินการ' : 'เสร็จสิ้น'}
          </span>
        </p>
        <h3>{request.requestType}</h3>
        <p>ผู้แจ้ง: {request.requesterName}</p>
        <p>สถานที่: {request.location}</p>
        <p>{request.details}</p>
      </div>
      <button type="button" onClick={() => onDeleteRequest(request.id)}>ลบ</button>
    </article>
  );
}

export default RequestCard;
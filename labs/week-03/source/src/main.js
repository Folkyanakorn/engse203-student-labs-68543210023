import "./style.css";

const form = document.querySelector("#request-form");

// TODO 1: query preview/status/list elements
const preview = {
  name: document.querySelector("#preview-name"),
  type: document.querySelector("#preview-type"),
  details: document.querySelector("#preview-details"),
};

const status = document.querySelector("#form-status");
const requestList = document.querySelector("#request-list");
const detailsCount = document.querySelector("#goal-count");

// TODO 2: readForm()
function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

// TODO 3: renderPreview(data)
function renderPreview(data) {
  preview.name.textContent = data.requesterName?.trim() || "ยังไม่ระบุชื่อ";
  preview.type.textContent = data.requestType || "ยังไม่เลือกประเภท";
  preview.details.textContent = data.details?.trim() || "ยังไม่มีรายละเอียด";
  const length = data.details ? data.details.trim().length : 0;
  detailsCount.textContent = `${length} ตัวอักษร`;
}

// TODO 4: validate(data)
function validate(data) {
  const errors = {};
  if (data.requesterName.trim().length < 2) {
    errors.requesterName = "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร";
  }

  if (!data.requestType) {
    errors.requestType = "กรุณาเลือกประเภทบริการ";
  }

  if (data.details.trim().length < 10) {
    errors.details = "กรุณาระบุรายละเอียดปัญหาอย่างน้อย 10 ตัวอักษร";
  }
  return errors;
}

// TODO 5: renderErrors(errors)
function renderErrors(errors) {
  for (const name of ["requesterName", "requestType", "details"]) {
    const field = form.elements[name];
    const output = document.querySelector(`#${name}-error`);
    const message = errors[name] ?? "";

    output.textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }
}
// TODO 6: input and submit listeners
form.addEventListener("input", () => {
  const data = readForm();
  renderPreview(data);
});

function renderStatus(state, message) {
  status.dataset.state = state;
  status.textContent = message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = readForm();
  const errors = validate(data);
  renderErrors(errors);

  if (Object.keys(errors).length > 0) {
    renderStatus("invalid", "กรุณาตรวจสอบและแก้ไขข้อมูลให้ถูกต้อง");
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  renderStatus("success", `ส่งคำร้องขอรับบริการ ${data.requestType} สำเร็จ!`);

  const listItem = document.createElement("li");
  const typeDiv = document.createElement("div");
  typeDiv.style.cssText =
    "font-size: 0.8rem; color: var(--muted); font-weight: 800; text-transform: uppercase; margin-bottom: 0.3rem;";
  typeDiv.textContent = data.requestType;
  const contentDiv = document.createElement("div");
  contentDiv.style.color = "var(--navy)";
  const strongName = document.createElement("strong");
  strongName.textContent = data.requesterName;

  contentDiv.appendChild(strongName);
  contentDiv.appendChild(document.createTextNode(`: ${data.details}`));

  listItem.appendChild(typeDiv);
  listItem.appendChild(contentDiv);
  requestList.appendChild(listItem);
  form.reset();
});

renderPreview(readForm());

console.log("LAB 3 starter ready", form);

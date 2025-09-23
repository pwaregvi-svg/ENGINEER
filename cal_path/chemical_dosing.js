export function initChemicalDosing() {
  window.calculateChemicalDosing = function () {
    const Q = parseFloat(document.getElementById("Q").value);
    const ppm = parseFloat(document.getElementById("ppm").value);
    const c = parseFloat(document.getElementById("c").value);
    const result = document.getElementById("result");

    if ([Q, ppm, c].some(v => isNaN(v) || v <= 0)) {
      result.innerHTML = "⚠️ กรุณากรอกข้อมูลให้ถูกต้องครบถ้วน";
      return;
    }

    // คำนวณ
    const q = (Q * ppm) / (c * 10);

    result.innerHTML = `
      <b>อัตราการจ่ายสารเคมีที่ต้องการ:</b><br>
      💧 <b>${q.toFixed(2)}</b> ลิตร/ชั่วโมง
    `;
  };
}

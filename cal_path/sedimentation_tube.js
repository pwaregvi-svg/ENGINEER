export function initSedimentation() {
  window.calculateSedimentation = function () {
    const Q = parseFloat(document.getElementById("Q").value);
    const W = parseFloat(document.getElementById("W").value);
    const L = parseFloat(document.getElementById("L").value);
    const D = parseFloat(document.getElementById("D").value);
    const dw = parseFloat(document.getElementById("dw").value);
    const So = parseFloat(document.getElementById("So").value);
    const w = parseFloat(document.getElementById("w").value);
    const degree = parseFloat(document.getElementById("degree").value);
    const h = parseFloat(document.getElementById("h").value);
    const SF = parseFloat(document.getElementById("SF").value);
    const At = parseFloat(document.getElementById("At").value);
    const result = document.getElementById("result");

    if ([Q, W, L, D, dw, So, w, degree, h, SF, At].some(v => isNaN(v) || v <= 0)) {
      result.innerHTML = "⚠️ กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง";
      return;
    }

    const V = W * L * D;
    const d = D - dw;
    const M = Q / (W * d);
    const Mmin = M / 60;

    const angleRad = degree * (Math.PI / 180);
    const A = (Q / So) * (w / ((h * Math.cos(angleRad)) + (w * Math.sin(angleRad))));
    const AwithSF = A * (1 + (SF / 100));
    const settlerLength = At / W;

    result.innerHTML = `
      <b>ปริมาตรถังตกตะกอน:</b> ${V.toFixed(2)} ลบ.ม.<br>
      <b>ความลึกส่วนที่แคบที่สุด:</b> ${d.toFixed(2)} ม.<br>
      <b>Mean Flow Velocity:</b> ${M.toFixed(2)} ม./ชม. (${Mmin.toFixed(3)} ม./นาที)<br><br>

      <b>พื้นที่ที่ต้องการติดตั้ง Tube Settler:</b> ${A.toFixed(2)} ตร.ม.<br>
      <b>รวม Safety Factor:</b> ${AwithSF.toFixed(2)} ตร.ม.<br>
      <b>ความยาว Tube Settler ที่ต้องการ:</b> ${settlerLength.toFixed(2)} ม.
    `;
  };
}

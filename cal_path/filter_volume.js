export function initFilterVolume() {
  window.calculateFilterVolume = function () {
    const n = parseInt(document.getElementById("n").value);
    const W = parseFloat(document.getElementById("W").value);
    const L = parseFloat(document.getElementById("L").value);
    const SF = parseFloat(document.getElementById("SF").value);
    const Ds = parseFloat(document.getElementById("Ds").value);
    const Dg = parseFloat(document.getElementById("Dg").value);
    const result = document.getElementById("result");

    if ([n, W, L, SF, Ds, Dg].some(v => isNaN(v) || v <= 0)) {
      result.innerHTML = "⚠️ กรุณากรอกข้อมูลให้ครบและถูกต้อง";
      return;
    }

    const A = W * L;
    const Vs = ((A * Ds) + (A * Ds * (SF / 100))) * n;
    const Vg = ((A * Dg) + (A * Dg * (SF / 100))) * n;

    result.innerHTML = `
      <b>พื้นที่ของถังทรายกรอง:</b> ${A.toFixed(2)} ตร.ม.<br>
      🟫 <b>ปริมาตรของทรายกรอง:</b> ${Vs.toFixed(2)} ลบ.ม.<br>
      ⚪ <b>ปริมาตรของกรวดกรอง:</b> ${Vg.toFixed(2)} ลบ.ม.
    `;
  };
}

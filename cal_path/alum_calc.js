export function initAlumCalc() {
  const Q = document.getElementById("Q");
  const P = document.getElementById("P");
  const T = document.getElementById("T");
  const Pr = document.getElementById("Pr");
  const result = document.getElementById("result");

  if (!Q || !P || !T || !Pr || !result) {
    console.error("❌ ไม่พบองค์ประกอบของฟอร์ม");
    return;
  }

  window.calculateAlum = function () {
    const q = parseFloat(Q.value);
    const p = parseFloat(P.value);
    const t = parseFloat(T.value);
    const pr = parseFloat(Pr.value);

    if ([q, p, t, pr].some(v => isNaN(v) || v <= 0)) {
      result.innerHTML = "⚠️ กรุณากรอกข้อมูลให้ครบและถูกต้อง";
      return;
    }

    // คำนวณตามสูตร Python
    const S = (115.01e-6 * q) * ((2.2 * p) + (8.34 * t * 2));
    const dailyS = S * pr;
    const sludgeWater = dailyS / (0.02 * 1.012 * 1000);
    const clearWater = sludgeWater * 0.5;

    result.innerHTML = `
      <b>ผลการคำนวณ:</b><br>
      🔹 ปริมาณตะกอน (กก./ชม.): <b>${S.toFixed(3)}</b><br>
      🔹 ปริมาณตะกอน (กก./วัน): <b>${dailyS.toFixed(3)}</b><br>
      💧 ปริมาณน้ำตะกอน (ลบ.ม./วัน): <b>${sludgeWater.toFixed(2)}</b><br>
      💦 ปริมาณน้ำใส (ลบ.ม./วัน): <b>${clearWater.toFixed(2)}</b>
    `;
  };
}

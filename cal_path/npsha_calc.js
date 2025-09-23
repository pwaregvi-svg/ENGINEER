export function initNpshaCalc() {
  // ค่าคงที่
  const Hatm = 10.33; // เมตร
  const Hv = 0.43;    // เมตร

  window.calculateNPSHa = function () {
    const Hs = parseFloat(document.getElementById("Hs").value);
    const hf = parseFloat(document.getElementById("hf").value);
    const NPSHr = parseFloat(document.getElementById("NPSHr").value);
    const result = document.getElementById("result");

    if ([Hs, hf, NPSHr].some(v => isNaN(v))) {
      result.innerHTML = "⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง";
      return;
    }

    // คำนวณ NPSHa
    const NPSHa = Hatm + Hs - Hv - hf;

    const isEnough = NPSHa >= NPSHr;

    result.innerHTML = `
      <b>NPSHa:</b> ${NPSHa.toFixed(2)} เมตร<br>
      ${
        isEnough
          ? '✅ <b>เพียงพอ</b> (NPSHa ≥ NPSHr)'
          : '❌ <b>ไม่เพียงพอ</b> (NPSHa < NPSHr)'
      }
    `;
  };
}

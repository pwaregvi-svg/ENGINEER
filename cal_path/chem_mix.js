export function initChemMix() {
  const WATER_DENSITY = 1000; // kg/ลบ.ม.

  const tankTypeEl = document.getElementById("tankType");
  const roundInputs = document.getElementById("roundInputs");
  const rectInputs = document.getElementById("rectInputs");
  const resultEl = document.getElementById("result");

  if (!tankTypeEl || !roundInputs || !rectInputs || !resultEl) {
    console.error("❌ ไม่พบ DOM สำหรับ chem_mix");
    return;
  }

  // สลับ input ตามชนิดถัง
  tankTypeEl.addEventListener("change", e => {
    const type = e.target.value;
    roundInputs.style.display = type === "round" ? "block" : "none";
    rectInputs.style.display = type === "rect" ? "block" : "none";
  });

  // ฟังก์ชันคำนวณ
  window.calculate = function () {
    const tankType = tankTypeEl.value;
    const percent = parseFloat(document.getElementById("percent").value);
    let volume = 0;

    if (isNaN(percent) || percent <= 0 || percent >= 100) {
      resultEl.innerHTML = "⚠️ กรุณาใส่ค่าความเข้มข้นระหว่าง 0-100";
      return;
    }

    if (tankType === "round") {
      const d = parseFloat(document.getElementById("diameter").value);
      const h = parseFloat(document.getElementById("heightRound").value);
      if (isNaN(d) || isNaN(h)) {
        resultEl.innerHTML = "⚠️ กรุณาใส่ค่าถังกลมให้ครบ";
        return;
      }
      const r = d / 2;
      volume = Math.PI * (r ** 2) * h;
    } else {
      const w = parseFloat(document.getElementById("width").value);
      const l = parseFloat(document.getElementById("length").value);
      const h = parseFloat(document.getElementById("heightRect").value);
      if (isNaN(w) || isNaN(l) || isNaN(h)) {
        resultEl.innerHTML = "⚠️ กรุณาใส่ค่าถังสี่เหลี่ยมให้ครบ";
        return;
      }
      volume = w * l * h;
    }

    const waterWeight = volume * WATER_DENSITY;
    const requiredWeight = (waterWeight * percent) / (100 - percent);

    resultEl.innerHTML = `
      <b>ปริมาตรถัง:</b> ${volume.toFixed(2)} ลบ.ม.<br>
      <b>น้ำหนักน้ำ:</b> ${waterWeight.toFixed(2)} กก.<br>
      <b>✅ น้ำหนักสารที่ต้องผสม:</b> ${requiredWeight.toFixed(2)} กก.
    `;
  };
}

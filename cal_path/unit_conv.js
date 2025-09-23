export function initUnitConv() {
  const valueInput = document.getElementById("value");
  const category = document.getElementById("category");
  const fromUnit = document.getElementById("from-unit");
  const toUnit = document.getElementById("to-unit");
  const result = document.getElementById("result");
  const btn = document.getElementById("convert-btn");

  const units = {
    length: { m: 1, cm: 0.01, mm: 0.001, km: 1000, inch: 0.0254, ft: 0.3048 },
    mass: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.453592, ton: 1000 },
    volume: { L: 1, mL: 0.001, m3: 1000, gallon: 3.78541 },
    time: { sec: 1, min: 60, hr: 3600, day: 86400 },
    temperature: ["C", "F", "K"], // ใช้สูตร
    speed: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704 },
    force: { N: 1, kN: 1000, kgf: 9.80665 },
    energy: { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600 },
    power: { W: 1, kW: 1000, hp: 745.7 },
    pressure: { Pa: 1, kPa: 1000, bar: 100000, atm: 101325, psi: 6894.76 },
    density: { "kg/m3": 1, "g/cm3": 1000 }
  };

  // ฟังก์ชันเติมหน่วย
  function populateUnits(cat) {
    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    const unitList = units[cat];
    if (!unitList) return;

    if (Array.isArray(unitList)) {
      unitList.forEach(u => {
        fromUnit.innerHTML += `<option value="${u}">${u}</option>`;
        toUnit.innerHTML += `<option value="${u}">${u}</option>`;
      });
    } else {
      Object.keys(unitList).forEach(u => {
        fromUnit.innerHTML += `<option value="${u}">${u}</option>`;
        toUnit.innerHTML += `<option value="${u}">${u}</option>`;
      });
    }
  }

  // โหลด default
  populateUnits(category.value);

  // เมื่อเลือก Category ใหม่
  category.addEventListener("change", () => {
    populateUnits(category.value);
  });

  // ปุ่มแปลง
  btn.addEventListener("click", () => {
    const val = parseFloat(valueInput.value);
    const cat = category.value;
    const from = fromUnit.value;
    const to = toUnit.value;

    if (isNaN(val)) {
      result.textContent = "⚠️ กรุณากรอกตัวเลข";
      return;
    }

    let converted;
    if (cat === "temperature") {
      if (from === "C" && to === "F") converted = (val * 9) / 5 + 32;
      else if (from === "F" && to === "C") converted = ((val - 32) * 5) / 9;
      else if (from === "C" && to === "K") converted = val + 273.15;
      else if (from === "K" && to === "C") converted = val - 273.15;
      else if (from === "F" && to === "K") converted = ((val - 32) * 5) / 9 + 273.15;
      else if (from === "K" && to === "F") converted = ((val - 273.15) * 9) / 5 + 32;
      else converted = val;
    } else {
      converted = val * (units[cat][from] / units[cat][to]);
    }

    result.textContent = `✅ ผลลัพธ์: ${converted} ${to}`;
  });
}

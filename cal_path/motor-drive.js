const { jsPDF } = window.jspdf;

// SI multipliers สำหรับ parsing input
const SI_MULTIPLIERS = {
  q: 1e-30, r: 1e-27, y: 1e-24, z: 1e-21, a: 1e-18, f: 1e-15, p: 1e-12, n: 1e-9,
  u: 1e-6, µ: 1e-6, m: 1e-3, '': 1, k: 1e3, M: 1e6, G: 1e9, T: 1e12, P: 1e15,
  E: 1e18, Z: 1e21, Y: 1e24, R: 1e27, Q: 1e30
};

// SI multipliers สำหรับ output
const SI_OUTPUT = [
  { suffix: 'Q', value: 1e30 },
  { suffix: 'R', value: 1e27 },
  { suffix: 'Y', value: 1e24 },
  { suffix: 'Z', value: 1e21 },
  { suffix: 'E', value: 1e18 },
  { suffix: 'P', value: 1e15 },
  { suffix: 'T', value: 1e12 },
  { suffix: 'G', value: 1e9 },
  { suffix: 'M', value: 1e6 },
  { suffix: 'k', value: 1e3 },
  { suffix: '', value: 1 },
  { suffix: 'm', value: 1e-3 },
  { suffix: 'µ', value: 1e-6 },
  { suffix: 'n', value: 1e-9 },
  { suffix: 'p', value: 1e-12 },
  { suffix: 'f', value: 1e-15 },
  { suffix: 'a', value: 1e-18 },
  { suffix: 'z', value: 1e-21 },
  { suffix: 'y', value: 1e-24 },
  { suffix: 'r', value: 1e-27 },
  { suffix: 'q', value: 1e-30 }
];

// Update legend numbers
function updateLegendNumbers() {
  const fieldsets = document.querySelectorAll('#motor-sets fieldset');
  fieldsets.forEach((fs, index) => {
    fs.querySelector('legend').textContent = `Set ${index + 1}`;
  });
}

// Parse power input
function parsePowerInput(value) {
  if (!value) return NaN;
  value = value.trim();
  const regex = /^([+-]?[\d.]+(?:[eE][+-]?\d+)?)([a-zA-Zµ]*)$/;
  const match = value.match(regex);
  if (!match) return NaN;
  const num = parseFloat(match[1]);
  const suffix = match[2] || '';
  return isNaN(num) ? NaN : num * (SI_MULTIPLIERS[suffix] || NaN);
}

// Format number to SI suffix or exponential
function formatSI(value) {
  const abs = Math.abs(value);
  const minSI = 9_999.9999e-30;
  const maxSI = 9_999.999e30;

  if (abs < minSI || abs > maxSI) {
    return value.toExponential(4);
  }

  for (const si of SI_OUTPUT) {
    if (abs >= si.value) {
      return (value / si.value).toFixed(4) + si.suffix;
    }
  }

  return value.toFixed(4);
}

// Validate input
function validateInput(input, type) {
  const value = input.value.trim();
  let valid = true;
  let message = '';

  if (type === 'power') {
    if (isNaN(parsePowerInput(value)) || parsePowerInput(value) <= 0) {
      valid = false;
      message = 'Invalid power (number + optional SI suffix or e notation)';
    }
  } else if (type === 'voltage') {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0) { valid = false; message = 'Invalid voltage'; }
  } else if (type === 'efficiency') {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0 || v > 100) { valid = false; message = '0–100% only'; }
  } else if (type === 'pf') {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0 || v > 100) { valid = false; message = '0–100% only'; }
  }

  let warningDiv = input.nextElementSibling;
  if (!warningDiv || !warningDiv.classList.contains('warning')) {
    warningDiv = document.createElement('div');
    warningDiv.classList.add('warning');
    warningDiv.style.color = 'red';
    warningDiv.style.fontSize = '0.9em';
    input.insertAdjacentElement('afterend', warningDiv);
  }
  warningDiv.textContent = valid ? '' : message;

  return valid;
}

// Create a new calculation set
function createCalculationSet() {
  const container = document.createElement('fieldset');
  container.innerHTML = `
    <legend>Set</legend>
    
    <label>Load Type :</label>
    <select class="load_type">
      <option value="R">Resistive Load</option>
      <option value="L" selected>Inductive Load</option>
      <option value="C">Capacitive Load</option>
    </select>

    <label>Circuit Protector Type :</label>
    <select class="Circuit_Protector_Type">
      <option value="Delay_Fuse">Delay Fuse</option>
      <option value="Non_Time_Fuse">Non Time Fuse</option>
      <option value="cut_cb">Cut off CB</option>
      <option value="Time_cb" selected>Time Invest CB</option>
    </select>

    <label>Number of Phase :</label>
    <input type="number" class="phase" step="1" value="3" min="0">    
    <label>Power (W):</label>
    <input type="text" class="power" placeholder="e.g. 2k, 1e3, 200">
    <label>Voltage (V):</label>
    <input type="number" class="voltage" step="0.01" value="400" min="0">
    <label>Efficiency (%):</label>
    <input type="number" class="efficiency" step="0.01" value="90" min="0" max="100">
    <label>Power Factor (%):</label>
    <input type="number" class="pf" step="0.01" value="85" min="0" max="100">
    <label>Ambient (°C):</label>
    <input type="number" class="ambient" step="0.01" value="40">
    <label>Cable Group :</label>
    <input type="number" class="Cg" step="1" value="1" min="0">    
    <button class="remove-set">🗑️ Remove Set</button>
    <div class="result-line"></div>
  `;

  container.querySelector('.remove-set').addEventListener('click', e => {
    e.preventDefault();
    container.remove();
    updateLegendNumbers();
  });

  container.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      validateInput(input, input.className);
      calculateSet(container);
    });
    input.addEventListener('touchstart', e => {
      e.preventDefault();
      input.focus();
    });
  });

  document.getElementById('motor-sets').appendChild(container);
  updateLegendNumbers();
}

// Calculate current
function calculateSet(fieldset) {
  const inputs = fieldset.querySelectorAll('input');
  let allValid = true;
  inputs.forEach(input => {
    if (!validateInput(input, input.className)) allValid = false;
  });
  if (!allValid) {
    fieldset.querySelector('.result-line').textContent = '';
    return;
  }

  const power = parsePowerInput(fieldset.querySelector('.power').value);
  const voltage = parseFloat(fieldset.querySelector('.voltage').value);
  const efficiency = parseFloat(fieldset.querySelector('.efficiency').value);
  const pf = parseFloat(fieldset.querySelector('.pf').value);

  const I = power / (Math.sqrt(3) * voltage * (efficiency / 100) * (pf / 100));
  const display = formatSI(I);
  const resultDiv = fieldset.querySelector('.result-line');

  resultDiv.style.wordBreak = 'break-word'; // mobile friendly
  resultDiv.style.overflowWrap = 'break-word';
  resultDiv.textContent = `Current: ${display} A`;
}

// Export PDF
function exportToPDF() {
  const doc = new jsPDF();
  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.text('Motor Current Calculation', 105, 15, { align: 'center' });

  const sets = document.querySelectorAll('#motor-sets fieldset');
  let y = 30;
  let setNumber = 1;

  sets.forEach(set => {
    const rawPower = set.querySelector('.power').value || '-';
    const voltage = set.querySelector('.voltage').value || '-';
    const eff = set.querySelector('.efficiency').value || '-';
    const pf = set.querySelector('.pf').value || '-';
    const ambient = set.querySelector('.ambient').value || '-';
    const result = set.querySelector('.result-line').textContent || '-';

    doc.setFontSize(12);
    doc.text(`Set ${setNumber++}`, 10, y); y += 8;
    doc.text(`• Power: ${rawPower} W`, 15, y); y += 7;
    doc.text(`• Voltage: ${voltage} V`, 15, y); y += 7;
    doc.text(`• Efficiency: ${eff} %`, 15, y); y += 7;
    doc.text(`• Power Factor: ${pf} %`, 15, y); y += 7;
    doc.text(`• Ambient: ${ambient} °C`, 15, y); y += 7;
    doc.text(`✅ ${result}`, 15, y); y += 12;

    if (y > 270) { doc.addPage(); y = 20; }
  });

  doc.save('motor-calculation.pdf');
}

// Event binding
document.getElementById('add-set').addEventListener('click', createCalculationSet);
document.getElementById('export-pdf').addEventListener('click', exportToPDF);

// Mobile touch support for buttons
['add-set','export-pdf'].forEach(id=>{
  const btn=document.getElementById(id);
  if(btn){
    btn.addEventListener('touchstart', e=>{ e.preventDefault(); btn.click(); });
  }
});

// Scroll input into view on focus (mobile)
document.querySelectorAll('input, select').forEach(el=>{
  el.addEventListener('focus', e=>{
    e.target.scrollIntoView({behavior:'smooth', block:'center'});
  });
});

window.addEventListener('load', () => createCalculationSet());

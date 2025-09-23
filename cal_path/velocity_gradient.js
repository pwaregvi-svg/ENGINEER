export function initVelocityGradient() {
  // ค่าคงที่
  const g = 9.81; // ม./วท.²
  const ks = 1;
  const ku = 1.4;
  const KV = 0.898e-6; // ม.²/วท.

  window.calculateVelocityGradient = function () {
    const stage = parseInt(document.getElementById("stage").value);
    const Q = parseFloat(document.getElementById("Q").value);
    const w = parseFloat(document.getElementById("w").value);
    const D = parseFloat(document.getElementById("D").value);
    const W = parseFloat(document.getElementById("W").value);
    const L = parseFloat(document.getElementById("L").value);
    const ns = parseInt(document.getElementById("ns").value);
    const nu = parseInt(document.getElementById("nu").value);
    const result = document.getElementById("result");

    if ([stage, Q, w, D, W, L, ns, nu].some(v => isNaN(v) || v <= 0)) {
      result.innerHTML = "⚠️ กรุณากรอกข้อมูลให้ครบและถูกต้องทุกช่อง";
      return;
    }

    // ความเร็วน้ำ
    const v = (Q / 3600) / (w * D);

    // ปริมาตร
    const V = W * L * D;

    // K
    const K = (ks * ns) + (ku * nu);

    // พลังงานสูญเสีย
    const hl = (K * (v ** 2)) / (2 * g);

    // เวลากักเก็บ (นาที)
    const t = (V / Q) * 60;

    // Gradient (G)
    const G = Math.sqrt((hl * g * (Q / 3600)) / (KV * V));

    result.innerHTML = `
      <b>ผลการคำนวณ Stage ${stage}:</b><br>
      🔹 ความเร็วน้ำ (ม./วินาที): <b>${v.toFixed(4)}</b><br>
      🔹 ปริมาตร (ลบ.ม.): <b>${V.toFixed(2)}</b><br>
      🔹 hl (ม.): <b>${hl.toFixed(4)}</b><br>
      ⏱️ เวลากักเก็บ (นาที): <b>${t.toFixed(2)}</b><br>
      ⚙️ Velocity Gradient (1/วินาที): <b>${G.toFixed(2)}</b>
    `;
  };
}

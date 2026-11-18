const CX = 500;
const CY = 520;
const R = 230; // Radius of arch dome

// Exact nodes from LandingPage.jsx with CSS percentages and sizes
const nodesDef = [
  { id: 'gmail', name: 'Gmail', leftPct: 5, topPct: 22, size: 44, color: '#3b82f6' },
  { id: 'drive', name: 'Google Drive', leftPct: 12, topPct: 8, size: 40, color: '#3b82f6' },
  { id: 'd2l', name: 'D2L', leftPct: 2, topPct: 48, size: 52, color: '#3b82f6' },
  { id: 'sheets', name: 'Excel', leftPct: 10, topPct: 70, size: 40, color: '#10b981' },
  { id: 'pdf', name: 'Adobe PDF', leftPct: 17, topPct: 84, size: 36, color: '#ef4444' },
  { id: 'health', name: 'Health Services', leftPct: 21, topPct: 52, size: 32, color: '#0ea5e9' },
  { id: 'canvas', name: 'Canvas LMS', leftPct: 20, topPct: 14, size: 48, color: '#f43f5e' },
  { id: 'notion', name: 'Notion', leftPct: 32, topPct: 4, size: 40, color: '#475569' },
  { id: 'code', name: 'Terminal Code', leftPct: 36, topPct: 28, size: 32, color: '#475569' },
  { id: 'gpt', name: 'OpenAI GPT-4o', leftPct: 47, topPct: 2, size: 56, color: '#10a37f' },
  { id: 'sparkle', name: 'AI Workflows', leftPct: 43, topPct: 14, size: 32, color: '#3b82f6' },
  { id: 'gemini', name: 'Google Gemini', leftPct: 58, topPct: 8, size: 44, color: '#2563eb' },
  { id: 'claude', name: 'Claude 3.7', leftPct: 68, topPct: 6, size: 48, color: '#d97706' },
  { id: 'discord', name: 'Discord', leftPct: 64, topPct: 32, size: 36, color: '#6366f1' },
  { id: 'teams', name: 'Microsoft Teams', leftPct: 77, topPct: 18, size: 44, color: '#4f46e5' },
  { id: 'deepseek', name: 'DeepSeek', leftPct: 88, topPct: 8, size: 44, color: '#1d4ed8' },
  { id: 'slack', name: 'Slack', leftPct: 83, topPct: 44, size: 40, color: '#3b82f6' },
  { id: 'hubspot', name: 'HubSpot', leftPct: 92, topPct: 58, size: 44, color: '#f97316' },
  { id: 'figma', name: 'Figma', leftPct: 75, topPct: 76, size: 36, color: '#a855f7' },
  { id: 'web', name: 'Web & API', leftPct: 87, topPct: 82, size: 36, color: '#0284c7' }
];

// Calculate exact center in 1000x520 space
const nodes = nodesDef.map(n => {
  const r = n.size / 2;
  // In 1000x520 space:
  // leftPct is % of 1000 => leftPct * 10
  // topPct is % of 520 => topPct * 5.2
  const cx = n.leftPct * 10 + r;
  const cy = n.topPct * 5.2 + r;
  return {
    ...n,
    cx,
    cy,
    r
  };
});

// Compute polar sweep angle alpha around arch center (CX, CY)
const processed = nodes.map(n => {
  const dx = n.cx - CX;
  const dy = n.cy - CY;
  const phi = Math.atan2(dy, dx); // in [-PI, 0]
  const alpha = phi + Math.PI; // in [0, PI]
  return { ...n, alpha, dx, dy };
});

// Sort strictly by alpha so lines NEVER cross
processed.sort((a, b) => a.alpha - b.alpha);

// Map each node to a unique, non-overlapping target angle on the dome
// Dome span: 10 deg to 170 deg (left to right)
const minBeta = (12 * Math.PI) / 180;
const maxBeta = (168 * Math.PI) / 180;

const resultCurves = processed.map((n, i) => {
  const t = i / (processed.length - 1);
  const beta = minBeta + t * (maxBeta - minBeta);

  // Target coordinates on arch dome
  const phi_t = beta - Math.PI;
  const tx = CX + R * Math.cos(phi_t);
  const ty = CY + R * Math.sin(phi_t);

  // Direction from node center to arch target
  const dir = Math.atan2(ty - n.cy, tx - n.cx);
  // Pin dot sits on the perimeter facing the target (like in user screenshot)
  const px = n.cx + (n.r + 3) * Math.cos(dir);
  const py = n.cy + (n.r + 3) * Math.sin(dir);

  const dist = Math.hypot(tx - px, ty - py);

  // Bezier control points:
  // C1 continues smoothly out from the node's pin
  const c1x = px + Math.cos(dir) * (dist * 0.38);
  const c1y = py + Math.sin(dir) * (dist * 0.38);

  // C2 arrives perpendicular to the arch dome (along normal vector pointing out from arch center)
  const c2x = tx + Math.cos(phi_t) * (dist * 0.38);
  const c2y = ty + Math.sin(phi_t) * (dist * 0.38);

  return {
    id: n.id,
    name: n.name,
    color: n.color,
    pin: { x: Number(px.toFixed(1)), y: Number(py.toFixed(1)) },
    target: { x: Number(tx.toFixed(1)), y: Number(ty.toFixed(1)) },
    path: `M ${px.toFixed(1)} ${py.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`
  };
});

console.log(JSON.stringify(resultCurves, null, 2));

const CX = 500;
const CY = 520;
const R = 230;

// Nodes list matching exact abstractNodes index
const nodesDef = [
  { id: 'gmail', name: 'Gmail', leftPct: 5, topPct: 22, size: 44, color: '#3b82f6', idx: 0 },
  { id: 'drive', name: 'Google Drive', leftPct: 12, topPct: 8, size: 40, color: '#3b82f6', idx: 1 },
  { id: 'd2l', name: 'D2L', leftPct: 2, topPct: 48, size: 52, color: '#3b82f6', idx: 2 },
  { id: 'sheets', name: 'Excel', leftPct: 10, topPct: 70, size: 40, color: '#10b981', idx: 3 },
  { id: 'pdf', name: 'Adobe PDF', leftPct: 17, topPct: 84, size: 36, color: '#ef4444', idx: 4 },
  { id: 'health', name: 'Health Services', leftPct: 21, topPct: 52, size: 32, color: '#0ea5e9', idx: 5 },
  { id: 'canvas', name: 'Canvas LMS', leftPct: 20, topPct: 14, size: 48, color: '#f43f5e', idx: 6 },
  { id: 'notion', name: 'Notion', leftPct: 32, topPct: 4, size: 40, color: '#475569', idx: 7 },
  { id: 'code', name: 'Terminal Code', leftPct: 36, topPct: 28, size: 32, color: '#475569', idx: 8 },
  { id: 'gpt', name: 'OpenAI GPT-4o', leftPct: 47, topPct: 2, size: 56, color: '#10a37f', idx: 9 },
  { id: 'sparkle', name: 'AI Workflows', leftPct: 43, topPct: 14, size: 32, color: '#3b82f6', idx: 10 },
  { id: 'gemini', name: 'Google Gemini', leftPct: 58, topPct: 8, size: 44, color: '#2563eb', idx: 11 },
  { id: 'claude', name: 'Claude 3.7', leftPct: 68, topPct: 6, size: 48, color: '#d97706', idx: 12 },
  { id: 'discord', name: 'Discord', leftPct: 64, topPct: 32, size: 36, color: '#6366f1', idx: 13 },
  { id: 'teams', name: 'Microsoft Teams', leftPct: 77, topPct: 18, size: 44, color: '#4f46e5', idx: 14 },
  { id: 'deepseek', name: 'DeepSeek', leftPct: 88, topPct: 8, size: 44, color: '#1d4ed8', idx: 15 },
  { id: 'slack', name: 'Slack', leftPct: 83, topPct: 44, size: 40, color: '#3b82f6', idx: 16 },
  { id: 'hubspot', name: 'HubSpot', leftPct: 92, topPct: 58, size: 44, color: '#f97316', idx: 17 },
  { id: 'figma', name: 'Figma', leftPct: 75, topPct: 76, size: 36, color: '#a855f7', idx: 18 },
  { id: 'web', name: 'Web & API', leftPct: 87, topPct: 82, size: 36, color: '#0284c7', idx: 19 }
];

const processed = nodesDef.map((n) => {
  const r = n.size / 2;
  const bx = n.leftPct * 10 + r;
  const by = n.topPct * 5.2 + r;
  const dx = bx - CX;
  const dy = by - CY;
  const alpha = Math.atan2(dy, dx) + Math.PI;
  return { ...n, bx, by, r, alpha };
});

processed.sort((a, b) => a.alpha - b.alpha);

const minBeta = (12 * Math.PI) / 180;
const maxBeta = (168 * Math.PI) / 180;

const config = processed.map((n, i) => {
  const t = i / (processed.length - 1);
  const beta = minBeta + t * (maxBeta - minBeta);
  const phi_t = beta - Math.PI;
  const tx = CX + R * Math.cos(phi_t);
  const ty = CY + R * Math.sin(phi_t);

  return {
    id: n.id,
    name: n.name,
    color: n.color,
    origIndex: n.idx,
    bx: Number(n.bx.toFixed(1)),
    by: Number(n.by.toFixed(1)),
    r: n.r,
    tx: Number(tx.toFixed(1)),
    ty: Number(ty.toFixed(1)),
    phi_t: Number(phi_t.toFixed(4)),
    ampX: Number((2.0 + (i % 3) * 0.8).toFixed(1)),
    ampY: Number((3.0 + (i % 4) * 0.9).toFixed(1)),
    freqX: Number((1.1 + (i % 5) * 0.15).toFixed(2)),
    freqY: Number((0.9 + (i % 4) * 0.2).toFixed(2)),
    phase: Number((i * 0.45).toFixed(2))
  };
});

console.log('const cablesData = ' + JSON.stringify(config, null, 2) + ';');

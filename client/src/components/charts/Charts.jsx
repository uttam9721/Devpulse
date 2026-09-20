import React, { useState } from 'react';
import { fmtDur, fmtN } from '../../utils/mockData';

export function Sparkline({ data, color, width = 84, height = 28 }) {
  if (!data || data.length < 2) return null;
  const mx = Math.max(1, ...data);
  const n = data.length;
  const pts = data.map((v, i) => `${(i * (width - 4) / (n - 1) + 2).toFixed(1)},${(height - 3 - v / mx * (height - 6)).toFixed(1)}`).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function niceMax(v) {
  const raw = Math.max(v, 4) / 4;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const c = [1, 2, 3, 4, 5, 6, 8, 10].find(m => m * p >= raw) * p;
  return Math.max(4, c * 4);
}

function smooth(pts, y0, y1) {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, t = .18;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, Math.max(y0, Math.min(y1, p1[1] + (p2[1] - p0[1]) * t))];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, Math.max(y0, Math.min(y1, p2[1] - (p3[1] - p1[1]) * t))];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export function LineChart({ labels, long, series, height = 230, axisFmt, tipFmt }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  
  const W = 1000; // SVG internal coordinate width, scaling is handled by CSS
  const H = height;
  const P = { l: 36, r: 10, t: 12, b: 26 };
  const iw = W - P.l - P.r;
  const ih = H - P.t - P.b;
  const n = labels.length;
  
  const vis = series.filter(s => !s.hidden);
  const mx = niceMax(Math.max(0, ...vis.flatMap(s => s.data)));
  
  const X = i => P.l + (n < 2 ? iw / 2 : i * iw / (n - 1));
  const Y = v => P.t + ih - v / mx * ih;

  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 56))));

  return (
    <div 
      className="relative w-full touch-pan-y" 
      style={{ height }}
      onPointerLeave={() => setHoverIdx(null)}
      onPointerMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const scaleX = W / rect.width;
        const svgX = rawX * scaleX;
        let i = Math.round((svgX - P.l) / iw * (n - 1));
        i = Math.max(0, Math.min(n - 1, i));
        setHoverIdx(i);
      }}
    >
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block overflow-visible">
        <g className="grid-lines">
          {[0, 1, 2, 3, 4].map(i => {
            const v = mx * i / 4;
            const y = Y(v);
            return (
              <g key={i}>
                <line x1={P.l} x2={W - P.r} y1={y} y2={y} className="stroke-line stroke-1" />
                <text x={P.l - 8} y={y + 4} textAnchor="end" className="fill-ink-3 text-[11px] font-sans">
                  {axisFmt ? axisFmt(v) : fmtN(v)}
                </text>
              </g>
            );
          })}
        </g>
        <g className="x-axis">
          {labels.map((l, i) => (
            (n - 1 - i) % every === 0 && (
              <text key={i} x={X(i)} y={H - 7} textAnchor="middle" className="fill-ink-3 text-[11px] font-sans">
                {l}
              </text>
            )
          ))}
        </g>
        
        {vis.map((s, idx) => {
          const pts = s.data.map((v, i) => [X(i), Y(v)]);
          const dp = smooth(pts, P.t, P.t + ih);
          return (
            <g key={idx}>
              {vis.length <= 2 && (
                <path d={`${dp}L${X(n - 1)},${P.t + ih}L${X(0)},${P.t + ih}Z`} style={{ fill: s.c, opacity: 0.09, stroke: 'none' }} />
              )}
              <path d={dp} style={{ stroke: s.c }} fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}

        {hoverIdx !== null && (
          <line x1={X(hoverIdx)} x2={X(hoverIdx)} y1={P.t} y2={P.t + ih} className="stroke-line-2 stroke-1" />
        )}

        {hoverIdx !== null && vis.map((s, idx) => (
          <circle key={'dot'+idx} r="4.5" cx={X(hoverIdx)} cy={Y(s.data[hoverIdx])} style={{ stroke: s.c }} className="fill-surface stroke-[2.4px]" />
        ))}
      </svg>
      
      {/* Tooltip */}
      {hoverIdx !== null && (
        <div 
          className="absolute z-50 pointer-events-none bg-ink text-bg px-[11px] py-[8px] rounded-[9px] text-[12px] min-w-[120px] shadow-custom transition-opacity duration-120"
          style={{ 
            left: Math.max(8, (hoverIdx / (n-1)) * 100) + '%', 
            top: P.t + 6,
            transform: 'translateX(-50%)'
          }}
        >
          <b>{long ? long[hoverIdx] : labels[hoverIdx]}</b>
          {vis.map((s, j) => (
            <div key={j} className="flex items-center gap-[6px] mt-[3px]">
              <i className="w-2 h-2 rounded-full inline-block" style={{ background: s.c }}></i>
              {s.name}
              <b className="ml-auto pl-[10px]">{tipFmt ? tipFmt(s.data[hoverIdx]) : s.data[hoverIdx]}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function VerticalBars({ items, height = 170, valFmt }) {
  const mx = Math.max(1, ...items.map(i => i.v));
  return (
    <div className="flex items-stretch gap-2" style={{ height }}>
      {items.map((i, idx) => (
        <div key={idx} className={`flex-1 flex flex-col items-center gap-[6px] min-w-0 ${i.hi ? 'hi' : ''}`} title={`${i.l}: ${i.v}`}>
          <span className="text-[11.5px] text-ink-3 tabular-nums">{valFmt ? valFmt(i.v) : i.v}</span>
          <div className="flex-1 w-full flex items-end">
            <div 
              className={`w-full rounded-t-[3px] rounded-b-[7px] transition-all duration-500 ease-out ${i.hi ? 'bg-accent' : 'bg-c-commit'}`}
              style={{ height: `${Math.max(2, i.v / mx * 100)}%`, backgroundColor: i.hi ? undefined : i.c }}
            ></div>
          </div>
          <span className="text-[12px] text-ink-2 whitespace-nowrap">{i.l}</span>
        </div>
      ))}
    </div>
  );
}

export function HorizontalBars({ items, color }) {
  const mx = Math.max(1e-9, ...items.map(i => i.v));
  return (
    <div className="flex flex-col">
      {items.map((i, idx) => (
        <div key={idx} className="grid grid-cols-[minmax(76px,150px)_1fr_auto] items-center gap-3 text-[13.5px] py-1.5">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-2">
            {i.dot && <i className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: i.dot }}></i>}
            {i.l}
          </span>
          <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.max(1.5, i.v / mx * 100)}%`, backgroundColor: i.c || color || 'var(--color-c-commit)' }}></div>
          </div>
          <span className="text-ink-2 text-[13px] min-w-[38px] text-right num">{i.t !== undefined ? i.t : i.v}</span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ items, center }) {
  const t = items.reduce((sum, i) => sum + i.v, 0) || 1;
  const C = 2 * Math.PI * 54;
  let off = 0;

  return (
    <div className="flex items-center gap-[18px] flex-wrap">
      <svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label={center[1]}>
        <circle cx="70" cy="70" r="54" fill="none" strokeWidth="16" className="stroke-surface-2" />
        {items.filter(i => i.v > 0).map((i, idx) => {
          const len = i.v / t * C;
          const dash = Math.max(0, len - 2);
          const currentOff = off;
          off += len;
          return (
            <circle 
              key={idx} cx="70" cy="70" r="54" fill="none" strokeWidth="16" 
              style={{ stroke: i.c }} 
              strokeDasharray={`${dash} ${C - dash}`} 
              strokeDashoffset={-currentOff} 
              transform="rotate(-90 70 70)" 
            />
          );
        })}
        <text x="70" y="70" textAnchor="middle" className="font-display font-bold text-[22px] fill-ink">{center[0]}</text>
        <text x="70" y="88" textAnchor="middle" className="font-sans font-normal text-[11px] fill-ink-3">{center[1]}</text>
      </svg>
      <ul className="flex flex-col gap-[7px] text-[13px] min-w-0 flex-1 list-none p-0 m-0">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <i className="w-[10px] h-[10px] rounded-[3px] shrink-0" style={{ background: i.c }}></i>
            <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{i.l}</span>
            <b className="num">{i.t !== undefined ? i.t : Math.round(i.v / t * 100) + '%'}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";
import React from "react";
import { PostureState } from "@/lib/types";

export default function SpineVisualizer({ 
  spinalAngle = 78.5, 
  spineTilt = 0, 
  roll = 0, 
  state = PostureState.GOOD,
  className = "" 
}) {
  const theme = {
    [PostureState.GOOD]: {
      spineStroke: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.4)",
      badgeBg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
      accentBg: "from-emerald-500/20 to-teal-500/5",
      label: "Optimal Alignment",
    },
    [PostureState.WARNING]: {
      spineStroke: "#f59e0b",
      glowColor: "rgba(245, 158, 11, 0.4)",
      badgeBg: "bg-amber-500/20 border-amber-500/40 text-amber-400",
      accentBg: "from-amber-500/20 to-orange-500/5",
      label: "Mild Deviation",
    },
    [PostureState.BAD]: {
      spineStroke: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.5)",
      badgeBg: "bg-red-500/20 border-red-500/40 text-red-400",
      accentBg: "from-red-500/20 to-rose-500/5",
      label: "Severe Slouch Alert",
    },
  }[state] || {
    spineStroke: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    badgeBg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    accentBg: "from-emerald-500/20 to-teal-500/5",
    label: "Optimal Alignment",
  };

  const angleDeficit = Math.max(0, 80.0 - (Number(spinalAngle) || 78.5));
  const curvatureFactor = (angleDeficit / 25.0) * 45.0;
  const lateralDeflection = ((Number(roll) || 0) / 20.0) * 18.0;

  const vertebraeCount = 10;
  const vertebrae = [];
  const startY = 35;
  const totalHeight = 180;
  const segmentHeight = totalHeight / (vertebraeCount - 1);

  for (let i = 0; i < vertebraeCount; i++) {
    const t = i / (vertebraeCount - 1);
    const arc = Math.sin(t * Math.PI) * curvatureFactor;
    const lateralShift = t * lateralDeflection;

    const cx = 100 + arc + lateralShift;
    const cy = startY + (i * segmentHeight);
    vertebrae.push({ cx, cy, index: i, t });
  }

  let pathD = `M ${vertebrae[0].cx} ${vertebrae[0].cy}`;
  for (let i = 1; i < vertebrae.length; i++) {
    const prev = vertebrae[i - 1];
    const curr = vertebrae[i];
    const midX = (prev.cx + curr.cx) / 2;
    const midY = (prev.cy + curr.cy) / 2;
    pathD += ` Q ${prev.cx} ${prev.cy} ${midX} ${midY}`;
  }
  pathD += ` L ${vertebrae[vertebrae.length - 1].cx} ${vertebrae[vertebrae.length - 1].cy}`;

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-3xl backdrop-blur-md border border-white/10 bg-gradient-to-b ${theme.accentBg} transition-all duration-500 shadow-2xl ${className}`}>
      <div 
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.glowColor }}
      />

      <div className="flex items-center justify-between w-full mb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: theme.spineStroke }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Biomechanical Model</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${theme.badgeBg}`}>
          {theme.label}
        </span>
      </div>

      <div className="relative w-full h-64 flex items-center justify-center z-10">
        <svg viewBox="0 0 200 240" className="w-full h-full filter drop-shadow-md">
          <defs>
            <linearGradient id="spineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.spineStroke} stopOpacity="0.8" />
              <stop offset="50%" stopColor={theme.spineStroke} stopOpacity="1.0" />
              <stop offset="100%" stopColor={theme.spineStroke} stopOpacity="0.6" />
            </linearGradient>

            <radialGradient id="craniumGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
          </defs>

          <line 
            x1="100" 
            y1="25" 
            x2="100" 
            y2="225" 
            stroke="rgba(255, 255, 255, 0.1)" 
            strokeWidth="1" 
            strokeDasharray="4,4" 
          />

          <ellipse
            cx={vertebrae[0].cx}
            cy={vertebrae[0].cy - 16}
            rx="14"
            ry="17"
            fill="url(#craniumGrad)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            className="transition-all duration-300 ease-out"
          />

          <path
            d={pathD}
            fill="none"
            stroke="url(#spineGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />

          {vertebrae.map((v, i) => {
            const isStressPeak = (state === PostureState.BAD || state === PostureState.WARNING) && (i >= 3 && i <= 6);
            return (
              <g key={i} className="transition-all duration-300 ease-out">
                <line
                  x1={v.cx - (12 - Math.abs(i - 4.5))}
                  y1={v.cy}
                  x2={v.cx + (12 - Math.abs(i - 4.5))}
                  y2={v.cy}
                  stroke={isStressPeak ? "#ef4444" : "rgba(255,255,255,0.6)"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx={v.cx}
                  cy={v.cy}
                  r={isStressPeak ? "4.5" : "3.5"}
                  fill={isStressPeak ? "#ef4444" : theme.spineStroke}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          <ellipse
            cx={vertebrae[vertebrae.length - 1].cx}
            cy={vertebrae[vertebrae.length - 1].cy + 6}
            rx="24"
            ry="7"
            fill="#334155"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
            className="transition-all duration-300 ease-out"
          />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mt-2 pt-3 border-t border-white/10 text-center z-10">
        <div className="bg-white/5 rounded-xl p-2">
          <p className="text-[10px] text-gray-400 uppercase">Spine Angle</p>
          <p className="text-sm font-bold text-white">{Number(spinalAngle).toFixed(1)}°</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2">
          <p className="text-[10px] text-gray-400 uppercase">Spine Tilt</p>
          <p className="text-sm font-bold text-white">{Number(spineTilt).toFixed(1)}°</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2">
          <p className="text-[10px] text-gray-400 uppercase">Lateral Roll</p>
          <p className="text-sm font-bold text-white">{Number(roll).toFixed(1)}°</p>
        </div>
      </div>
    </div>
  );
}


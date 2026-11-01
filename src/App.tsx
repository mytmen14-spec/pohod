import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/* ─── SVG Filters (shared) ─── */
const SVGFilters = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <filter id="blur-far">
        <feGaussianBlur stdDeviation="2" />
      </filter>
      <filter id="blur-mid">
        <feGaussianBlur stdDeviation="1" />
      </filter>
      <filter id="glow-orange-filter">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feFlood floodColor="#FF6B35" floodOpacity="0.6" />
        <feComposite in2="blur" operator="in" />
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="glow-red-filter">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feFlood floodColor="#E63946" floodOpacity="0.7" />
        <feComposite in2="blur" operator="in" />
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  </svg>
);

/* ─── Mountain Layers ─── */
const MountainLayers = ({ variant = 'sunset' }: { variant?: string }) => {
  const c = variant === 'sunset'
    ? ['#3D2A5C', '#4E3870', '#6B4E9B', '#8B6EAB']
    : ['#1E4430', '#2D5F3F', '#3A7050', '#4A8060'];
  return (
    <g className="mountain-layers">
      <path d="M-20,420 Q60,330 140,370 Q220,300 300,350 Q380,280 460,330 Q540,300 620,360 L620,960 L-20,960Z" fill={c[0]} filter="url(#blur-far)" opacity="0.6" />
      <path d="M-20,470 Q80,400 180,440 Q280,380 380,420 Q460,380 540,410 Q600,390 620,420 L620,960 L-20,960Z" fill={c[1]} filter="url(#blur-mid)" opacity="0.75" />
      <path d="M-20,530 Q80,470 180,500 Q280,450 380,490 Q460,460 540,485 Q600,470 620,490 L620,960 L-20,960Z" fill={c[2]} opacity="0.88" />
      <path d="M-20,590 Q80,540 180,565 Q280,530 380,555 Q460,535 540,555 Q600,540 620,560 L620,960 L-20,960Z" fill={c[3]} />
    </g>
  );
};

/* ─── Clouds ─── */
const Clouds = () => (
  <g className="clouds-group" opacity="0.35">
    <g className="cloud" data-speed="0.3">
      <ellipse cx="90" cy="200" rx="55" ry="18" fill="#F5E6D3" filter="url(#blur-far)" />
      <ellipse cx="110" cy="195" rx="35" ry="14" fill="#F5E6D3" filter="url(#blur-far)" />
    </g>
    <g className="cloud" data-speed="0.5">
      <ellipse cx="380" cy="160" rx="70" ry="22" fill="#F5E6D3" filter="url(#blur-far)" />
      <ellipse cx="410" cy="155" rx="40" ry="16" fill="#F5E6D3" filter="url(#blur-far)" />
    </g>
    <g className="cloud" data-speed="0.2">
      <ellipse cx="520" cy="260" rx="45" ry="15" fill="#F5E6D3" filter="url(#blur-mid)" />
    </g>
    <g className="cloud" data-speed="0.4">
      <ellipse cx="200" cy="310" rx="60" ry="18" fill="#F5E6D3" filter="url(#blur-mid)" />
    </g>
  </g>
);

/* ─── Particles ─── */
const Particles = () => {
  const pts = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    cx: 10 + Math.random() * 520,
    cy: Math.random() * 900,
    r: 1.5 + Math.random() * 2.5,
    op: 0.2 + Math.random() * 0.5,
  }));
  return (
    <g className="particles-group">
      {pts.map(p => (
        <circle key={p.id} className="particle-dot" cx={p.cx} cy={p.cy} r={p.r} fill="#F5E6D3" opacity={p.op} />
      ))}
    </g>
  );
};

/* ─── Film Grain Overlay ─── */
const GrainOverlay = () => (
  <div className="grain-overlay" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
    opacity: 0.035,
    mixBlendMode: 'overlay',
  }} />
);

/* ═══════════════════════════════════════════
   SCENE 1 — HOOK (0:00 – 0:03)
   ═══════════════════════════════════════════ */
const Scene1 = () => (
  <div className="scene" id="scene1">
    <svg viewBox="0 0 540 960" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B4E9B" />
          <stop offset="35%" stopColor="#9B5E8B" />
          <stop offset="65%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FFB347" />
        </linearGradient>
        <radialGradient id="sun1" cx="50%" cy="68%" r="35%">
          <stop offset="0%" stopColor="#FFB347" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bp-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A8B5A" />
          <stop offset="100%" stopColor="#2D5F3F" />
        </linearGradient>
      </defs>
      <rect width="540" height="960" fill="url(#sky1)" />
      <circle cx="270" cy="640" r="220" fill="url(#sun1)" />
      <MountainLayers />
      <Clouds />
      <Particles />

      {/* Backpack */}
      <g id="backpack" transform="translate(270, 500)">
        <rect x="-65" y="-85" width="130" height="170" rx="18" fill="url(#bp-body)" />
        <path d="M-58,-85 Q-58,-118 0,-118 Q58,-118 58,-85" fill="#3A7B4A" />
        <rect x="-52" y="-75" width="14" height="105" rx="7" fill="#2D5F3F" />
        <rect x="38" y="-75" width="14" height="105" rx="7" fill="#2D5F3F" />
        <rect x="-38" y="10" width="76" height="55" rx="10" fill="#3A7B4A" />
        <rect x="-10" y="-100" width="20" height="14" rx="4" fill="#F5E6D3" />
        <line x1="-32" y1="38" x2="32" y2="38" stroke="#F5E6D3" strokeWidth="2" strokeDasharray="5,4" />
        {/* Side pockets */}
        <rect x="-72" y="-20" width="14" height="45" rx="5" fill="#3A7B4A" />
        <rect x="58" y="-20" width="14" height="45" rx="5" fill="#3A7B4A" />
      </g>

      {/* Flying items */}
      <g id="fly-jeans" opacity="0" transform="translate(160, 370)">
        <rect x="-22" y="-28" width="44" height="56" rx="6" fill="#5B86C5" />
        <line x1="-16" y1="-22" x2="-16" y2="22" stroke="#4A75B5" strokeWidth="2" />
        <line x1="16" y1="-22" x2="16" y2="22" stroke="#4A75B5" strokeWidth="2" />
        <rect x="-22" y="-32" width="44" height="8" rx="2" fill="#4A75B5" />
      </g>
      <g id="fly-boot" opacity="0" transform="translate(390, 350)">
        <path d="M-18,-22 L18,-22 L18,12 L28,12 L28,22 L-22,22 L-22,12 L-18,12Z" fill="#A0522D" />
        <rect x="-22" y="18" width="50" height="8" rx="2" fill="#6B3410" />
        <line x1="-8" y1="-18" x2="8" y2="-18" stroke="#F5E6D3" strokeWidth="1.5" />
        <line x1="-8" y1="-10" x2="8" y2="-10" stroke="#F5E6D3" strokeWidth="1.5" />
      </g>
      <g id="fly-towel" opacity="0" transform="translate(290, 310)">
        <rect x="-28" y="-18" width="56" height="36" rx="4" fill="#F5E6D3" />
        <line x1="-22" y1="-12" x2="22" y2="-12" stroke="#E0D0BD" strokeWidth="1" />
        <line x1="-22" y1="-6" x2="22" y2="-6" stroke="#E0D0BD" strokeWidth="1" />
        <line x1="-22" y1="0" x2="22" y2="0" stroke="#E0D0BD" strokeWidth="1" />
        <line x1="-22" y1="6" x2="22" y2="6" stroke="#E0D0BD" strokeWidth="1" />
      </g>

      {/* Text */}
      <g id="scene1-text">
        <text x="270" y="155" textAnchor="middle" fontFamily="Rye, sans-serif" fontSize="44" fontWeight="900" fill="#F5E6D3" className="text-glow-white">
          НЕ БЕРИ ЭТО
        </text>
        <text x="270" y="215" textAnchor="middle" fontFamily="Rye, sans-serif" fontSize="56" fontWeight="900" fill="#FF6B35" className="text-glow">
          В ПОХОД 🚫
        </text>
        <text x="270" y="268" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="22" fill="#F5E6D3" opacity="0.85">
          3 ошибки походника
        </text>
      </g>
    </svg>
    <div className="vignette" />
    <GrainOverlay />
  </div>
);

/* ═══════════════════════════════════════════
   SCENE 2 — JEANS (0:03 – 0:10)
   ═══════════════════════════════════════════ */
const Scene2 = () => (
  <div className="scene" id="scene2">
    <svg viewBox="0 0 540 960" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B4E9B" />
          <stop offset="100%" stopColor="#1A1A2E" />
        </linearGradient>
        <linearGradient id="jeans-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B9BD2" />
          <stop offset="100%" stopColor="#4A75B5" />
        </linearGradient>
        <linearGradient id="wet-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A5F95" stopOpacity="0" />
          <stop offset="60%" stopColor="#2A4F75" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1A3F65" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="540" height="960" fill="url(#sky2)" />
      <MountainLayers />
      <Particles />

      {/* Jeans */}
      <g id="jeans-group" transform="translate(270, 440)">
        <g id="jeans-main">
          <path d="M-65,-130 L65,-130 L60,0 L42,130 L12,130 L0,20 L-12,130 L-42,130 L-60,0Z" fill="url(#jeans-g)" />
          <rect x="-65" y="-142" width="130" height="22" rx="4" fill="#5B86C5" />
          {/* Belt loops */}
          {[-45, -18, 8, 32, 50].map((x, i) => (
            <rect key={i} x={x} y="-148" width="8" height="28" rx="2" fill="#4A75B5" />
          ))}
          {/* Pockets */}
          <path d="M-50,-120 L-22,-120 L-28,-88 L-50,-92Z" fill="none" stroke="#4A75B5" strokeWidth="2" />
          <path d="M50,-120 L22,-120 L28,-88 L50,-92Z" fill="none" stroke="#4A75B5" strokeWidth="2" />
          {/* Seam */}
          <line x1="0" y1="-110" x2="0" y2="20" stroke="#4A75B5" strokeWidth="1.5" strokeDasharray="4,3" />
          {/* Rivets */}
          <circle cx="-48" cy="-118" r="3" fill="#C4A040" />
          <circle cx="48" cy="-118" r="3" fill="#C4A040" />
          {/* Wet overlay */}
          <path id="wet-overlay" d="M-65,-130 L65,-130 L60,0 L42,130 L12,130 L0,20 L-12,130 L-42,130 L-60,0Z" fill="url(#wet-g)" opacity="0" />
        </g>
        {/* Water drops */}
        <g id="water-drops">
          {[[-30, 135], [5, 145], [30, 138], [-15, 150], [42, 132]].map(([cx, cy], i) => (
            <ellipse key={i} className="water-drop" cx={cx} cy={cy} rx={3 + (i % 2)} ry={5 + (i % 2)} fill="#6BB8E8" opacity="0" />
          ))}
        </g>
        {/* Cross */}
        <g id="cross1" opacity="0">
          <line x1="-85" y1="-150" x2="85" y2="150" stroke="#E63946" strokeWidth="8" strokeLinecap="round" filter="url(#glow-red-filter)" />
          <line x1="85" y1="-150" x2="-85" y2="150" stroke="#E63946" strokeWidth="8" strokeLinecap="round" filter="url(#glow-red-filter)" />
        </g>
      </g>

      {/* Thermometer */}
      <g id="thermometer" transform="translate(460, 320)">
        <rect x="-9" y="-65" width="18" height="110" rx="9" fill="#F5E6D3" opacity="0.9" />
        <circle cx="0" cy="55" r="18" fill="#E63946" />
        <rect id="thermo-level" x="-5" y="-45" width="10" height="90" rx="5" fill="#E63946" />
        {/* Tick marks */}
        {[-40, -20, 0, 20].map((y, i) => (
          <line key={i} x1="12" y1={y} x2="18" y2={y} stroke="#F5E6D3" strokeWidth="1.5" opacity="0.6" />
        ))}
      </g>

      {/* Text */}
      <g id="scene2-text">
        <text x="270" y="115" textAnchor="middle" fontFamily="Rye, sans-serif" fontSize="34" fontWeight="700" fill="#F5E6D3" className="text-glow-white">
          1. ДЖИНСЫ И ХЛОПОК
        </text>
        <text x="270" y="160" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="19" fill="#F5E6D3" opacity="0.8">
          Мокнут → Не сохнут → Переохлаждение
        </text>
      </g>
    </svg>
    <div className="vignette" />
    <GrainOverlay />
  </div>
);

/* ═══════════════════════════════════════════
   SCENE 3 — BOOTS (0:10 – 0:17)
   ═══════════════════════════════════════════ */
const Scene3 = () => (
  <div className="scene" id="scene3">
    <svg viewBox="0 0 540 960" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C3D7A" />
          <stop offset="100%" stopColor="#1A1A2E" />
        </linearGradient>
        <linearGradient id="boot-new" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8652A" />
          <stop offset="100%" stopColor="#7B4015" />
        </linearGradient>
        <linearGradient id="boot-old" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#5C4A32" />
        </linearGradient>
        <radialGradient id="pain-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E63946" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#E63946" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E63946" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="540" height="960" fill="url(#sky3)" />
      <MountainLayers />
      <Particles />

      {/* New Boot */}
      <g id="new-boot" transform="translate(200, 460)">
        <path d="M-55,-85 L55,-85 L55,20 L85,20 L85,52 L-65,52 L-65,20 L-55,20Z" fill="url(#boot-new)" />
        <rect x="-65" y="48" width="150" height="16" rx="5" fill="#3D2B1F" />
        {/* Sole tread */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={-58 + i * 18} y="52" width="12" height="8" rx="1" fill="#2A1A10" />
        ))}
        {/* Laces */}
        {[-72, -56, -40, -24].map((y, i) => (
          <g key={i}>
            <line x1="-22" y1={y} x2="22" y2={y} stroke="#F5E6D3" strokeWidth="2.5" />
            <circle cx="-22" cy={y} r="2" fill="#C4A040" />
            <circle cx="22" cy={y} r="2" fill="#C4A040" />
          </g>
        ))}
        {/* Tongue */}
        <path d="M-28,-85 L28,-85 L22,-98 Q0,-104 -22,-98Z" fill="#C87530" />
        {/* NEW tag */}
        <g id="new-tag">
          <rect x="35" y="-98" width="44" height="22" rx="4" fill="#E63946" />
          <text x="57" y="-82" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white" fontFamily="Inter, sans-serif">NEW</text>
        </g>
        {/* Pain zone */}
        <circle id="pain-zone" cx="-42" cy="32" r="35" fill="url(#pain-g)" opacity="0" />
        {/* Cross */}
        <g id="cross2" opacity="0">
          <line x1="-85" y1="-105" x2="105" y2="72" stroke="#E63946" strokeWidth="8" strokeLinecap="round" filter="url(#glow-red-filter)" />
          <line x1="105" y1="-105" x2="-85" y2="72" stroke="#E63946" strokeWidth="8" strokeLinecap="round" filter="url(#glow-red-filter)" />
        </g>
      </g>

      {/* Old boot */}
      <g id="old-boot" transform="translate(400, 640)" opacity="0">
        <path d="M-42,-62 L42,-62 L42,16 L68,16 L68,42 L-52,42 L-52,16 L-42,16Z" fill="url(#boot-old)" />
        <rect x="-52" y="38" width="120" height="12" rx="3" fill="#3D2B1F" />
        {[-52, -40, -28].map((y, i) => (
          <line key={i} x1="-16" y1={y} x2="16" y2={y} stroke="#C4A882" strokeWidth="2" />
        ))}
        {/* Scuffs */}
        <ellipse cx="-32" cy="2" rx="10" ry="5" fill="#4A3A28" opacity="0.4" />
        <ellipse cx="22" cy="12" rx="8" ry="4" fill="#4A3A28" opacity="0.4" />
        {/* Checkmark */}
        <g id="check1">
          <circle cx="52" cy="-52" r="20" fill="#2D5F3F" />
          <path d="M42,-52 L49,-45 L62,-60" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="0" y="70" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="15" fill="#F5E6D3" opacity="0.7">Разношенная ✓</text>
      </g>

      {/* Text */}
      <g id="scene3-text">
        <text x="270" y="115" textAnchor="middle" fontFamily="Rye, sans-serif" fontSize="38" fontWeight="700" fill="#F5E6D3" className="text-glow-white">
          2. НОВАЯ ОБУВЬ
        </text>
        <text x="270" y="160" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="19" fill="#F5E6D3" opacity="0.8">
          Первый выход = кровавые мозоли
        </text>
      </g>
    </svg>
    <div className="vignette" />
    <GrainOverlay />
  </div>
);

/* ═══════════════════════════════════════════
   SCENE 4 — TOWEL (0:17 – 0:24)
   ═══════════════════════════════════════════ */
const Scene4 = () => (
  <div className="scene" id="scene4">
    <svg viewBox="0 0 540 960" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3570" />
          <stop offset="100%" stopColor="#1A1A2E" />
        </linearGradient>
        <linearGradient id="towel-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF5EB" />
          <stop offset="100%" stopColor="#E8D5B7" />
        </linearGradient>
        <linearGradient id="micro-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7CC8F0" />
          <stop offset="100%" stopColor="#4A90C4" />
        </linearGradient>
      </defs>
      <rect width="540" height="960" fill="url(#sky4)" />
      <MountainLayers />
      <Particles />

      {/* Big Towel */}
      <g id="towel-group" transform="translate(220, 440)">
        <g id="towel-main">
          <rect x="-85" y="-65" width="170" height="130" rx="10" fill="url(#towel-g)" />
          {/* Fluffy texture */}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1="-75" y1={-55 + i * 14} x2="75" y2={-55 + i * 14} stroke="#D4C4A8" strokeWidth="1.2" opacity="0.5" />
          ))}
          {/* Fold shadow */}
          <path d="M-85,-65 Q-65,-78 -42,-65" fill="none" stroke="#D4C4A8" strokeWidth="2.5" />
          <path d="M85,-65 Q65,-78 42,-65" fill="none" stroke="#D4C4A8" strokeWidth="2.5" />
          {/* Border */}
          <rect x="-80" y="-60" width="160" height="120" rx="6" fill="none" stroke="#D4C4A8" strokeWidth="1" strokeDasharray="3,3" />
        </g>
        {/* Weight arrow */}
        <g id="weight-arrow" opacity="0">
          <line x1="0" y1="75" x2="0" y2="140" stroke="#E63946" strokeWidth="4" strokeLinecap="round" />
          <polygon points="-10,132 10,132 0,150" fill="#E63946" />
        </g>
        <g id="weight-label" opacity="0">
          <rect x="-35" y="155" width="70" height="28" rx="6" fill="#E63946" />
          <text x="0" y="174" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" fontFamily="Inter, sans-serif">500г</text>
        </g>
        {/* Cross */}
        <g id="cross3" opacity="0">
          <line x1="-105" y1="-85" x2="105" y2="85" stroke="#E63946" strokeWidth="8" strokeLinecap="round" filter="url(#glow-red-filter)" />
          <line x1="105" y1="-85" x2="-105" y2="85" stroke="#E63946" strokeWidth="8" strokeLinecap="round" filter="url(#glow-red-filter)" />
        </g>
      </g>

      {/* Microfiber */}
      <g id="microfiber" transform="translate(420, 640)" opacity="0">
        <rect x="-38" y="-28" width="76" height="56" rx="6" fill="url(#micro-g)" />
        <rect x="-32" y="-22" width="64" height="44" rx="4" fill="none" stroke="#3A7AB4" strokeWidth="1" strokeDasharray="3,2" />
        <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="600" fill="white" fontFamily="Inter, sans-serif">50г</text>
        {/* Checkmark */}
        <g id="check2">
          <circle cx="44" cy="-22" r="18" fill="#2D5F3F" />
          <path d="M35,-22 L41,-16 L53,-28" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="0" y="50" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="15" fill="#F5E6D3" opacity="0.7">Микрофибра ✓</text>
      </g>

      {/* Scale */}
      <g id="scale" transform="translate(100, 660)" opacity="0">
        <rect x="-4" y="-45" width="8" height="90" rx="4" fill="#F5E6D3" opacity="0.8" />
        <line x1="-45" y1="-45" x2="45" y2="-45" stroke="#F5E6D3" strokeWidth="3" strokeLinecap="round" />
        <circle cx="0" cy="-45" r="6" fill="#F5E6D3" />
        <g id="scale-tilt">
          <rect x="-55" y="-58" width="35" height="22" rx="4" fill="#E63946" opacity="0.8" />
          <text x="-38" y="-42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="Inter, sans-serif">500г</text>
        </g>
      </g>

      {/* Text */}
      <g id="scene4-text">
        <text x="270" y="115" textAnchor="middle" fontFamily="Rye, sans-serif" fontSize="28" fontWeight="700" fill="#F5E6D3" className="text-glow-white">
          3. МАХРОВОЕ ПОЛОТЕНЦЕ
        </text>
        <text x="270" y="160" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="19" fill="#F5E6D3" opacity="0.8">
          Вес кирпича. Сохнет сутками.
        </text>
      </g>
    </svg>
    <div className="vignette" />
    <GrainOverlay />
  </div>
);

/* ═══════════════════════════════════════════
   SCENE 5 — CTA (0:24 – 0:30)
   ═══════════════════════════════════════════ */
const Scene5 = () => (
  <div className="scene" id="scene5">
    <svg viewBox="0 0 540 960" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="25%" stopColor="#FF6B35" />
          <stop offset="55%" stopColor="#9B5E8B" />
          <stop offset="100%" stopColor="#6B4E9B" />
        </linearGradient>
        <radialGradient id="sun5" cx="50%" cy="38%" r="45%">
          <stop offset="0%" stopColor="#FFB347" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="logo-glow-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="540" height="960" fill="url(#sky5)" />
      <circle cx="270" cy="360" r="280" fill="url(#sun5)" />
      <MountainLayers />
      <Clouds />
      <Particles />

      {/* Hiker silhouette */}
      <g id="hiker" transform="translate(270, 510)">
        <path d="M-110,80 L0,-30 L110,80Z" fill="#2D5F3F" />
        <g id="hiker-figure" opacity="0">
          <circle cx="0" cy="-58" r="9" fill="#1A1A2E" />
          <line x1="0" y1="-49" x2="0" y2="-18" stroke="#1A1A2E" strokeWidth="5" strokeLinecap="round" />
          <line x1="0" y1="-40" x2="-18" y2="-55" stroke="#1A1A2E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="0" y1="-40" x2="18" y2="-55" stroke="#1A1A2E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="0" y1="-18" x2="-10" y2="5" stroke="#1A1A2E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="0" y1="-18" x2="10" y2="5" stroke="#1A1A2E" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="4" y="-46" width="14" height="20" rx="4" fill="#1A1A2E" />
        </g>
      </g>

      {/* Logo */}
      <g id="logo-group" transform="translate(270, 240)">
        <circle id="logo-glow-circle" cx="0" cy="0" r="90" fill="url(#logo-glow-g)" opacity="0" />
        <circle id="logo-circle" cx="0" cy="0" r="62" fill="none" stroke="#FF6B35" strokeWidth="3" opacity="0" />
        <circle cx="0" cy="0" r="58" fill="rgba(26,26,46,0.5)" opacity="0" id="logo-bg" />
        <text id="logo-text1" x="0" y="-12" textAnchor="middle" fontFamily="Rye, sans-serif" fontSize="22" fontWeight="700" fill="#F5E6D3" opacity="0">TRAVEL</text>
        <text id="logo-text2" x="0" y="16" textAnchor="middle" fontFamily="Rye, sans-serif" fontSize="20" fontWeight="400" fill="#FF6B35" opacity="0">WILD</text>
        <text id="logo-text3" x="0" y="42" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fill="#F5E6D3" opacity="0">⛰️ ADVENTURES</text>
      </g>

      {/* CTA */}
      <g id="cta-text">
        <text x="270" y="710" textAnchor="middle" fontFamily="Rye, sans-serif" fontSize="30" fontWeight="700" fill="#F5E6D3" className="text-glow-white">
          Забирай ЧЕК-ЛИСТ
        </text>
        <text x="270" y="750" textAnchor="middle" fontFamily="Rye, sans-serif" fontSize="30" fontWeight="700" fill="#F5E6D3" className="text-glow-white">
          туриста 📋
        </text>
        <text x="270" y="810" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="600" fill="#FF6B35">
          Пиши &apos;ПОХОД&apos; в комментарии 👇
        </text>
        <g id="bouncing-arrow" transform="translate(270, 865)">
          <polygon points="-20,0 20,0 0,24" fill="#FF6B35" />
          <polygon points="-16,30 16,30 0,50" fill="#FF6B35" opacity="0.5" />
        </g>
      </g>
    </svg>
    <div className="vignette" />
    <GrainOverlay />
  </div>
);

/* ═══════════════════════════════════════════
   MAIN APP — GSAP Timeline
   ═══════════════════════════════════════════ */
function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (played.current) return;
    played.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 }).timeScale(0.7);

      /* ── Particle ambient animation (runs throughout) ── */
      gsap.to('.particle-dot', {
        y: '+=120',
        opacity: 0,
        duration: 6,
        stagger: { each: 0.15, from: 'random' },
        ease: 'none',
        repeat: 4,
      });
      /* Cloud drift */
      gsap.to('.cloud', {
        x: '+=30',
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 3,
      });

      /* ═══ SCENE 1 — HOOK ═══ */
      tl.set('#scene1', { opacity: 1, scale: 1 })
        .from('#backpack', { scale: 0.3, opacity: 0, duration: 1.1, ease: 'elastic.out(1, 0.6)' })
        .from('#scene1-text text', { y: 40, opacity: 0, duration: 0.7, stagger: 0.18, ease: 'back.out(1.7)' }, '-=0.6')
        .to('#fly-jeans', { opacity: 1, x: -40, y: -60, rotation: -20, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .to('#fly-boot', { opacity: 1, x: 40, y: -50, rotation: 15, duration: 0.7, ease: 'power3.out' }, '-=0.45')
        .to('#fly-towel', { opacity: 1, x: 15, y: -70, rotation: -8, duration: 0.7, ease: 'power3.out' }, '-=0.45');

      /* ═══ TRANSITION → SCENE 2 ═══ */
      tl.to('#scene1', { opacity: 0, scale: 0.95, duration: 0.6, ease: 'power3.in' })
        .set('#scene2', { opacity: 1, scale: 0.95 })
        .to('#scene2', { scale: 1, duration: 0.6, ease: 'power3.out' });

      /* ═══ SCENE 2 — JEANS ═══ */
      tl.from('#scene2-text text', { x: -40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' })
        .from('#jeans-main', { y: 60, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.3')
        .to('#wet-overlay', { opacity: 0.8, duration: 2.2, ease: 'power2.in' })
        .to('.water-drop', { opacity: 0.9, y: 50, duration: 0.8, stagger: 0.1, ease: 'power2.in' }, '-=1.5')
        .from('#thermometer', { y: -40, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=1')
        .to('#thermo-level', { attr: { height: 35, y: 5 }, duration: 1.5, ease: 'power2.in' }, '-=0.8')
        .to('#cross1', { opacity: 1, duration: 0.35, ease: 'back.out(2.5)' });

      /* ═══ TRANSITION → SCENE 3 ═══ */
      tl.to('#scene2', { opacity: 0, scale: 0.95, duration: 0.6, ease: 'power3.in' })
        .set('#scene3', { opacity: 1, scale: 0.95 })
        .to('#scene3', { scale: 1, duration: 0.6, ease: 'power3.out' });

      /* ═══ SCENE 3 — BOOTS ═══ */
      tl.from('#scene3-text text', { y: -25, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' })
        .from('#new-boot', { x: -60, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.3')
        .to('#pain-zone', { opacity: 0.9, scale: 1.4, duration: 0.55, ease: 'power2.out', yoyo: true, repeat: 3 })
        .to('#cross2', { opacity: 1, duration: 0.35, ease: 'back.out(2.5)' })
        .to('#old-boot', { opacity: 1, duration: 0.7, ease: 'power3.out' })
        .from('#check1', { scale: 0, transformOrigin: 'center', duration: 0.5, ease: 'elastic.out(1, 0.5)' }, '-=0.3');

      /* ═══ TRANSITION → SCENE 4 ═══ */
      tl.to('#scene3', { opacity: 0, scale: 0.95, duration: 0.6, ease: 'power3.in' })
        .set('#scene4', { opacity: 1, scale: 0.95 })
        .to('#scene4', { scale: 1, duration: 0.6, ease: 'power3.out' });

      /* ═══ SCENE 4 — TOWEL ═══ */
      tl.from('#scene4-text text', { y: -25, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' })
        .from('#towel-main', { y: -100, opacity: 0, duration: 0.9, ease: 'bounce.out' }, '-=0.3')
        .to('#weight-arrow', { opacity: 1, duration: 0.4 })
        .to('#weight-label', { opacity: 1, duration: 0.4 }, '-=0.2')
        .to('#scale', { opacity: 1, duration: 0.5 })
        .to('#scale-tilt', { rotation: 18, transformOrigin: '0 -45', duration: 0.7, ease: 'power2.in' })
        .to('#cross3', { opacity: 1, duration: 0.35, ease: 'back.out(2.5)' })
        .to('#microfiber', { opacity: 1, duration: 0.7, ease: 'power3.out' })
        .from('#check2', { scale: 0, transformOrigin: 'center', duration: 0.5, ease: 'elastic.out(1, 0.5)' }, '-=0.3');

      /* ═══ TRANSITION → SCENE 5 ═══ */
      tl.to('#scene4', { opacity: 0, scale: 0.95, duration: 0.6, ease: 'power3.in' })
        .set('#scene5', { opacity: 1, scale: 0.95 })
        .to('#scene5', { scale: 1, duration: 0.6, ease: 'power3.out' });

      /* ═══ SCENE 5 — CTA ═══ */
      tl.from('#hiker-figure', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' })
        .to('#logo-bg', { opacity: 1, duration: 0.4 }, '-=0.4')
        .to('#logo-glow-circle', { opacity: 1, duration: 0.6 })
        .to('#logo-circle', { opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.7)' }, '-=0.3')
        .to('#logo-text1', { opacity: 1, duration: 0.35 })
        .to('#logo-text2', { opacity: 1, duration: 0.35 }, '-=0.15')
        .to('#logo-text3', { opacity: 1, duration: 0.35 }, '-=0.15')
        .from('#cta-text text', { y: 25, opacity: 0, duration: 0.6, stagger: 0.18, ease: 'back.out(1.7)' })
        .to('#bouncing-arrow', { y: 12, duration: 0.55, ease: 'power2.inOut', yoyo: true, repeat: 5 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0D0D1A] overflow-hidden">
      <div className="video-container" ref={containerRef}>
        <SVGFilters />
        <Scene1 />
        <Scene2 />
        <Scene3 />
        <Scene4 />
        <Scene5 />
      </div>
    </div>
  );
}

export default App;

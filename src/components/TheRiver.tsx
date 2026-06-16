/**
 * TheRiver — clean funnel spiral.
 *
 * Path traces each ring's ellipse precisely using proper bezier quarter-arc
 * approximations (k=0.5523), connected by tight crossing S-curves between
 * each ring. The result is a clean, cone-shaped funnel — wide outer orbit
 * → mid orbit → tight inner orbit → converges at The Key.
 *
 * Key geometry (matches HeroFrame rings):
 *   Ring 1 (outer):  cx=720 cy=380 rx=550 ry=180
 *   Ring 2 (middle): cx=720 cy=540 rx=350 ry=110
 *   Ring 3 (inner):  cx=720 cy=700 rx=180 ry=50
 *   The Key:         x=720  y=780
 *
 * Bezier quarter-arc formula:
 *   k = 0.5523 → ctrl-pt offset = k * radius
 *   e.g. right→top on Ring 1:
 *     C (1270, 480-k*180), (720+k*550, 200), (720, 200)
 *     = C (1270, 280), (1023, 200), (720, 200)
 */

import { forwardRef } from 'react'

// ── Path ──────────────────────────────────────────────────────────────────────
//
// Ring geometry (matches HeroFrame rings — fitted to actual planet positions):
//   Ring 1 (gold):   cx=700  cy=365  rx=510  ry=165
//   Ring 2 (indigo): cx=720  cy=535  rx=340  ry=105
//   Ring 3 (red):    cx=720  cy=700  rx=145  ry=45
//   The Key:         x=720   y=780
//
// Key points (k=0.5523 for bezier quarter-arc approximation):
//   Ring 1 top=(700,200)  right=(1210,365)  bottom=(700,530)  left=(190,365)
//   Ring 2 top=(720,430)  right=(1060,535)  bottom=(720,640)  left=(380,535)
//   Ring 3 top=(720,655)  right=(865,700)   bottom=(720,745)  left=(575,700)
//
// STRUCTURE:
//   Entry path → visually serves as Ring 1 left arc (off-screen → Ring 1 top)
//   Ring 1     → top → right → bottom  (no separate left arc)
//   Crossing A → Ring 1 bottom (700,530) → Ring 2 left (380,535)
//                Near-horizontal at y≈532, hidden by Ring 1 body — NOT near AURENTUM
//   Ring 2     → full ellipse from left (clockwise)
//   Crossing B → Ring 2 left (380,535) → Ring 3 left (575,700)
//   Ring 3     → full ellipse from left (clockwise)
//   Key        → tight convergence to (720,780)

const D = [
  // Entry — off-screen upper-left, serves as Ring 1's visual left arc
  'M -360 360',
  'C  0 252, 380 196, 700 200',         // → Ring 1 top  (700, 200)

  // Ring 1: top → right → bottom  [k=0.5523, rx=510, ry=165]
  'C  982 200, 1210 274, 1210 365',     // top   → right  (1210, 365)
  'C 1210 456,  982 530,  700 530',     // right → bottom  (700, 530)

  // ── Crossing A: Ring 1 bottom → Ring 2 left ───────────────────────────────
  // (700,530) → (380,535): nearly horizontal, y≈532, hidden in Ring 1 body zone
  'C 600 530, 392 533, 380 535',        // → Ring 2 left (380, 535)

  // ── Ring 2: full ellipse from left (clockwise) ─────────────────────────────
  // [k=0.5523, rx=340, ry=105]
  'C 380 477,  532 430,  720 430',      // left   → top   (720, 430)
  'C 908 430, 1060 477, 1060 535',      // top    → right (1060, 535)
  'C 1060 593, 908 640,  720 640',      // right  → bottom (720, 640)
  'C 532 640,  380 593,  380 535',      // bottom → left   (380, 535)

  // ── Crossing B: Ring 2 left → Ring 3 left ─────────────────────────────────
  // (380,535) → (575,700): short S-curve ~251px, in lower-left
  'C 386 578,  568 660,  575 700',      // → Ring 3 left (575, 700)

  // ── Ring 3: full ellipse from left (clockwise) ─────────────────────────────
  // [k=0.5523, rx=145, ry=45]
  'C 575 675,  640 655,  720 655',      // left   → top   (720, 655)
  'C 800 655,  865 675,  865 700',      // top    → right  (865, 700)
  'C 865 725,  800 745,  720 745',      // right  → bottom (720, 745)
  'C 640 745,  575 725,  575 700',      // bottom → left   (575, 700)

  // ── Convergence → The Key (720, 780) ──────────────────────────────────────
  'C 575 718,  660 778,  720 780',
].join(' ')


// ── Particles ─────────────────────────────────────────────────────────────────
const PARTS: [number, number, number, string, number][] = [
  [34, -2,  1.0, '#FFFFFF', 0.88],
  [28, -7,  0.7, '#F5C842', 0.74],
  [40, -12, 1.2, '#FFFFFF', 0.64],
  [26, -17, 0.8, '#2ECFCF', 0.70],
  [36, -22, 1.0, '#FFFFFF', 0.60],
  [30, -27, 0.6, '#F5C842', 0.64],
  [42, -32, 1.3, '#FFFFFF', 0.54],
  [31, -5,  0.9, '#7B2FBE', 0.58],
  [38, -10, 0.7, '#FFFFFF', 0.74],
  [25, -15, 1.1, '#FF2020', 0.62],
  [33, -20, 0.8, '#FFFFFF', 0.68],
  [39, -25, 1.0, '#2ECFCF', 0.58],
  [24, -30, 0.6, '#F5C842', 0.52],
  [44, -35, 1.4, '#FFFFFF', 0.48],
  [32, -40, 0.9, '#FFFFFF', 0.66],
  [27, -45, 0.7, '#FF2020', 0.58],
  [35, -50, 1.0, '#FFFFFF', 0.72],
  [29, -55, 0.8, '#F5C842', 0.56],
]

// ── Component ─────────────────────────────────────────────────────────────────
export const TheRiver = forwardRef<SVGSVGElement, { className?: string }>(
  ({ className = '' }, ref) => (
    <svg
      ref={ref}
      className={`absolute inset-0 w-full h-full pointer-events-none will-change-transform ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/*
         * Radial gradient from The Key — outer = amber, inner = crimson/white.
         * Correct zone color is automatic regardless of path curvature.
         */}
        <radialGradient
          id="riv-zone"
          cx="720" cy="780" r="730"
          fx="720" fy="780"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="5%"   stopColor="#FF9060" />
          <stop offset="16%"  stopColor="#FF2020" />
          <stop offset="34%"  stopColor="#9B3FDE" />
          <stop offset="52%"  stopColor="#2ECFCF" />
          <stop offset="72%"  stopColor="#80D840" />
          <stop offset="87%"  stopColor="#F5C842" />
          <stop offset="100%" stopColor="#F5C842" stopOpacity="0" />
        </radialGradient>

        <filter id="riv-haze" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
        <filter id="riv-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
        {/* Tight bloom for The Key — smaller stdDeviation for a focused point */}
        <filter id="key-focus" x="-250%" y="-250%" width="600%" height="600%">
          <feGaussianBlur stdDeviation="10" />
        </filter>

        <path id="riv" d={D} />
      </defs>

      {/* 1. Outer atmospheric haze */}
      <path d={D} fill="none" stroke="url(#riv-zone)"
        strokeWidth="54" opacity="0.18"
        filter="url(#riv-haze)" strokeLinecap="round" />

      {/* 2. Colored body glow */}
      <path d={D} fill="none" stroke="url(#riv-zone)"
        strokeWidth="20" opacity="0.62"
        filter="url(#riv-glow)" strokeLinecap="round" />

      {/* 3. Main visible body (edges are clear here) */}
      <path d={D} fill="none" stroke="url(#riv-zone)"
        strokeWidth="10" opacity="0.92"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* 4. Bright inner shoulder */}
      <path d={D} fill="none" stroke="url(#riv-zone)"
        strokeWidth="4" opacity="1.0"
        strokeLinecap="round" />

      {/* 5. Near-white core */}
      <path d={D} fill="none" stroke="white"
        strokeWidth="2" opacity="0.88"
        strokeLinecap="round" />

      {/* 6. Pure white thread */}
      <path d={D} fill="none" stroke="white"
        strokeWidth="0.8" opacity="0.96"
        strokeLinecap="round" />

      {/* Animated flow dashes */}
      <path d={D} fill="none" stroke="rgba(255,255,255,0.52)"
        strokeWidth="1.4" strokeLinecap="round"
        strokeDasharray="5 62"
        style={{ animation: 'flow 28s linear infinite' }} />
      <path d={D} fill="none" stroke="url(#riv-zone)"
        strokeWidth="2.2" opacity="0.28" strokeLinecap="round"
        strokeDasharray="3 105"
        style={{ animation: 'flow 42s linear infinite', animationDelay: '-14s' }} />

      {/* Particles */}
      {PARTS.map(([dur, begin, r, fill, opacity], i) => (
        <circle key={i} r={r} fill={fill} opacity={opacity}>
          <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite">
            <mpath href="#riv" />
          </animateMotion>
        </circle>
      ))}

      {/*
       * The Key — focused, tight energy point (NOT a wide bloom).
       * stdDeviation=10 keeps it contained; radii are small.
       */}
      {/* Tight crimson halo */}
      <circle cx="720" cy="780" r="28"
        fill="#FF2020" opacity="0.28"
        filter="url(#key-focus)"
        style={{ animation: 'pulse-glow 2.8s ease-in-out infinite' }} />
      {/* Bright white focal point */}
      <circle cx="720" cy="780" r="14"
        fill="white" opacity="0.60"
        filter="url(#key-focus)"
        style={{ animation: 'pulse-glow 2.8s ease-in-out infinite' }} />
      {/* Inner core */}
      <circle cx="720" cy="780" r="5"
        fill="white" opacity="0.96"
        style={{ animation: 'pulse-glow 2.8s ease-in-out infinite' }} />
      {/* Pinpoint */}
      <circle cx="720" cy="780" r="2" fill="white" opacity="1.0" />

      {/* Subtle lens cross */}
      <line x1="710" y1="780" x2="730" y2="780"
        stroke="white" strokeWidth="0.5" opacity="0.45" />
      <line x1="720" y1="770" x2="720" y2="790"
        stroke="white" strokeWidth="0.5" opacity="0.45" />
    </svg>
  )
)

TheRiver.displayName = 'TheRiver'

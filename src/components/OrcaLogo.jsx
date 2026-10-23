import React from 'react';

/**
 * Reforca Orca Mascot Logo
 * Sleek Oceanic Edition with Cyan Glow & Teal Mint accents
 */
export default function OrcaLogo({ className = "w-10 h-10", size = 40 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Orca Reforca"
    >
      <defs>
        <linearGradient id="orcaGradClean" x1="4" y1="8" x2="44" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="60%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="orcaWaveClean" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Subtle wave splash base */}
      <path 
        d="M6 36C12 33 18 37 24 35C30 33 36 36 42 34" 
        stroke="url(#orcaWaveClean)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeOpacity="0.9"
      />

      {/* Main Orca Body */}
      <path
        d="M8 29C6 24 9 17 17 13C23 10 32 9 39 12C41.5 13 43.5 14.5 44 16C44.5 17.5 43 19 40 19.5C36 20 32 21 28 24C24 27 20 30 14 31C11 31.5 9 31 8 29Z"
        fill="url(#orcaGradClean)"
        stroke="#1E293B"
        strokeWidth="1.2"
      />

      {/* Orca Dorsal Fin */}
      <path
        d="M23 12C24 6 26.5 3 29 2C29.8 1.6 30.5 2.2 30.2 3.1L27.5 10.8L23 12Z"
        fill="#1D4ED8"
        stroke="#1E40AF"
        strokeWidth="1"
      />

      {/* Orca Tail Fluke */}
      <path
        d="M8.5 29.5L4 26C3 25.2 3.5 24 4.5 24.2L8 26L8.5 29.5Z"
        fill="#0F172A"
      />
      <path
        d="M7.5 30.5L3.5 33C2.5 33.6 2.5 35 3.8 34.8L7.5 31.5L7.5 30.5Z"
        fill="#0F172A"
      />

      {/* Orca Pectoral Fin */}
      <path
        d="M21 24C19 28 16 31 14 33C13.2 33.8 12.2 33 12.6 32L15 26L21 24Z"
        fill="#0F172A"
        stroke="#3B82F6"
        strokeWidth="0.8"
      />

      {/* Orca Iconic White Eye Patch */}
      <ellipse 
        cx="36.5" 
        cy="14" 
        rx="2.6" 
        ry="1.4" 
        transform="rotate(-20 36.5 14)" 
        fill="#FFFFFF" 
      />

      {/* Orca White Belly Marking */}
      <path
        d="M14 29C18 30 23 29 27 26.5C24 28 19 28.8 14 29Z"
        fill="#FFFFFF"
        opacity="0.95"
      />

      {/* Blue Dot */}
      <circle cx="39" cy="15.5" r="0.9" fill="#1D4ED8" />
    </svg>
  );
}

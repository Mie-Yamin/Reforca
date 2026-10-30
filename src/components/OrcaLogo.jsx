import React from 'react';
import reforcaLogo from '../assets/reforca-logo.png';

/**
 * Logo Resmi Reforca (Report For Care)
 * Menggunakan gambar resmi dari src/assets/reforca-logo.png
 */
export default function OrcaLogo({ 
  className = "h-11 sm:h-13 md:h-14 w-auto", 
  height, 
  invert = false,
  alt = "Reforca - Report For Care" 
}) {
  return (
    <img
      src={reforcaLogo}
      alt={alt}
      className={`${className} ${invert ? 'brightness-0 invert' : ''} object-contain transition-transform`}
      style={height ? { height: `${height}px` } : undefined}
      loading="eager"
    />
  );
}

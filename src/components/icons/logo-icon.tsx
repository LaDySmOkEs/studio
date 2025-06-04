// src/components/icons/logo-icon.tsx
import type React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  // You can add specific props if needed, e.g., size
}

export const LogoIcon: React.FC<LogoIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100" // Adjusted viewBox for simplicity
    width="32" // Default width
    height="32" // Default height
    {...props}
  >
    {/* Simplified representation of the logo */}
    {/* Top book */}
    <rect x="15" y="55" width="70" height="12" fill="#D97706" stroke="#1F2937" strokeWidth="2" rx="2" />
    <rect x="18" y="57" width="64" height="3" fill="#FFFBEB" />
    <rect x="70" y="55" width="3" height="12" fill="#1F2937" /> 
    
    {/* Bottom book */}
    <rect x="15" y="68" width="70" height="12" fill="#F59E0B" stroke="#1F2937" strokeWidth="2" rx="2" />
    <rect x="18" y="70" width="64" height="3" fill="#FFFBEB" />
    <rect x="70" y="68" width="3" height="12" fill="#1F2937" />

    {/* Scales */}
    {/* Base */}
    <rect x="42.5" y="40" width="15" height="15" fill="#1F2937" rx="1" />
    {/* Stem */}
    <rect x="48" y="15" width="4" height="25" fill="#1F2937" />
    {/* Beam */}
    <rect x="10" y="12" width="80" height="4" fill="#1F2937" rx="1" />
    
    {/* Left Pan Support */}
    <path d="M 20 16 L 20 25 L 30 45 L 10 45 Z" fill="#1F2937" />
    {/* Right Pan Support */}
    <path d="M 80 16 L 80 25 L 70 45 L 90 45 Z" fill="#1F2937" />
  </svg>
);

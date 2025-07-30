// components/SpoolIcon.jsx - Versión detallada
import React from 'react';

const SpoolIcon = ({ color = '#ff0000', width = 60, height = 60 }) => {
  // Calcular color más oscuro para bordes
  const darkerColor = adjustBrightness(color, -20);
  
  return (
    <svg width={width} height={height} viewBox="0 0 60 60">
      {/* Parte trasera del carrete */}
      <ellipse cx="30" cy="50" rx="25" ry="8" fill="#ddd" stroke="#999" strokeWidth="1"/>
      
      {/* Cilindro central */}
      <rect x="15" y="25" width="30" height="25" fill="#666" stroke="#444" strokeWidth="1"/>
      
      {/* Filamento enrollado (ESTAS PARTES CAMBIAN DE COLOR) */}
      <ellipse cx="30" cy="30" rx="20" ry="6" fill={color} stroke={darkerColor} strokeWidth="1"/>
      <rect x="10" y="30" width="40" height="15" fill={color}/>
      <ellipse cx="30" cy="45" rx="20" ry="6" fill={color} stroke={darkerColor} strokeWidth="1"/>
      
      {/* Parte delantera del carrete */}
      <ellipse cx="30" cy="25" rx="25" ry="8" fill="#eee" stroke="#999" strokeWidth="1"/>
      
      {/* Agujero central */}
      <ellipse cx="30" cy="25" rx="6" ry="2" fill="#333"/>
      <ellipse cx="30" cy="25" rx="4" ry="1.5" fill="#666"/>
    </svg>
  );
};

// Función helper para oscurecer colores
const adjustBrightness = (hex: string, percent: number) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

export default SpoolIcon;
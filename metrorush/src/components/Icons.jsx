import React from 'react';

const stroke = (color, w = 2.5) => ({
  fill: 'none', stroke: color, strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round'
});

export const PlayIcon = ({ size = 20, color = '#1D2B53' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" /></svg>
);

export const ReplayIcon = ({ size = 20, color = '#1D2B53', w = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, w)} aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
);

export const TrophyIcon = ({ size = 20, color = '#FFC93C' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color)} aria-hidden="true"><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3" /><path d="M7 5H4v2a3 3 0 0 0 3 3" /></svg>
);

export const GearIcon = ({ size = 22, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color)} aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
);

export const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...stroke('#FFFFFF', 3)} aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
);

export const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" /><rect x="14" y="5" width="4" height="14" rx="1.5" /></svg>
);

export const TrainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...stroke('#FFFFFF')} aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14" /><path d="M9 21l2-4" /><path d="M15 21l-2-4" /></svg>
);

export const MusicIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke(color)} aria-hidden="true"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
);

export const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...stroke('#FFFFFF')} aria-hidden="true"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M10 2h4" /></svg>
);

export const BurstIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC93C" aria-hidden="true"><path d="M12 2l2.2 5.6L20 6l-2.6 5.2L22 15l-5.8.6L15 22l-3-5-3 5-1.2-6.4L2 15l4.6-3.8L4 6l5.8 1.6z" /></svg>
);

export const StarIcon = ({ size = 22, fill = '#1D2B53', strokeColor }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={strokeColor} strokeWidth={strokeColor ? 1.5 : 0} aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
);


export const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke('#1D2B53')} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7" /><path d="M12 17h.01" /></svg>
);

export const TrashIcon = ({ color = '#B3261A' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke(color)} aria-hidden="true"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" /></svg>
);

export const HandIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#1D2B53" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 11V9a2 2 0 0 0-4 0v1" /><path d="M14 10V8a2 2 0 0 0-4 0v2" /><path d="M10 10.5V4a2 2 0 0 0-4 0v10" /><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.3l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15" /></svg>
);

export const RotateIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" {...stroke('#FFFFFF', 2)} aria-hidden="true"><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M8 3h8" /><path d="M16 21H8" /></svg>
);

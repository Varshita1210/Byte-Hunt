import React from 'react';

interface PuzzleVisualProps {
  assetKey?: string;
  type?: string;
}

export const PuzzleVisual: React.FC<PuzzleVisualProps> = ({ assetKey, type }) => {
  if (!assetKey) return null;

  const renderGraphic = () => {
    switch (assetKey) {
      case 'server':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] shadow-inner max-w-sm mx-auto">
            <svg viewBox="0 0 160 140" className="w-44 h-40">
              {/* Server rack enclosure */}
              <rect x="25" y="15" width="110" height="105" rx="12" fill="#2E394A" />
              {/* Unit 1 */}
              <rect x="35" y="25" width="90" height="24" rx="4" fill="#1C2430" />
              <circle cx="45" cy="37" r="3" fill="#34D399" />
              <circle cx="55" cy="37" r="3" fill="#34D399" />
              <line x1="68" y1="33" x2="115" y2="33" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="68" y1="41" x2="115" y2="41" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              {/* Unit 2 */}
              <rect x="35" y="55" width="90" height="24" rx="4" fill="#1C2430" />
              <circle cx="45" cy="67" r="3" fill="#F59E0B" />
              <circle cx="55" cy="67" r="3" fill="#34D399" />
              <line x1="68" y1="63" x2="115" y2="63" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="68" y1="71" x2="115" y2="71" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              {/* Unit 3 */}
              <rect x="35" y="85" width="90" height="24" rx="4" fill="#1C2430" />
              <circle cx="45" cy="97" r="3" fill="#34D399" />
              <circle cx="55" cy="97" r="3" fill="#34D399" />
              <line x1="68" y1="93" x2="115" y2="93" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="68" y1="101" x2="115" y2="101" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              {/* Stand */}
              <rect x="65" y="123" width="30" height="6" rx="2" fill="#2E394A" />
            </svg>
          </div>
        );

      case 'firewall':
        return (
          <div className="flex items-center justify-center gap-3 p-4 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-md mx-auto">
            {/* Fire */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 70" className="w-20 h-24">
                <path d="M30 5 C30 20 48 30 48 48 C48 60 38 68 28 68 C15 68 8 58 8 44 C8 32 20 22 25 15 C26 22 30 26 34 26 C36 20 33 12 30 5 Z" fill="#EA580C" />
                <path d="M28 25 C30 35 40 42 40 52 C40 60 32 64 26 64 C18 64 16 56 16 48 C16 40 22 32 28 25 Z" fill="#FBBF24" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#68734A]">+</span>
            {/* Wall */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 80 60" className="w-24 h-24">
                <rect x="5" y="5" width="70" height="50" rx="3" fill="#B45309" />
                {/* Horizontal mortar lines */}
                <line x1="5" y1="18" x2="75" y2="18" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="5" y1="31" x2="75" y2="31" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="5" y1="44" x2="75" y2="44" stroke="#FEF3C7" strokeWidth="2" />
                {/* Vertical joints */}
                <line x1="28" y1="5" x2="28" y2="18" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="52" y1="5" x2="52" y2="18" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="16" y1="18" x2="16" y2="31" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="40" y1="18" x2="40" y2="31" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="64" y1="18" x2="64" y2="31" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="28" y1="31" x2="28" y2="44" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="52" y1="31" x2="52" y2="44" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="16" y1="44" x2="16" y2="55" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="40" y1="44" x2="40" y2="55" stroke="#FEF3C7" strokeWidth="2" />
                <line x1="64" y1="44" x2="64" y2="55" stroke="#FEF3C7" strokeWidth="2" />
              </svg>
            </div>
          </div>
        );

      case 'webpage':
        return (
          <div className="flex items-center justify-center gap-3 p-4 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-md mx-auto">
            {/* Spiderweb */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 60" className="w-20 h-24">
                <circle cx="30" cy="30" r="24" stroke="#334155" strokeWidth="1.5" fill="none" />
                <circle cx="30" cy="30" r="16" stroke="#334155" strokeWidth="1.5" fill="none" />
                <circle cx="30" cy="30" r="8" stroke="#334155" strokeWidth="1.5" fill="none" />
                <line x1="30" y1="4" x2="30" y2="56" stroke="#334155" strokeWidth="1.5" />
                <line x1="4" y1="30" x2="56" y2="30" stroke="#334155" strokeWidth="1.5" />
                <line x1="12" y1="12" x2="48" y2="48" stroke="#334155" strokeWidth="1.5" />
                <line x1="12" y1="48" x2="48" y2="12" stroke="#334155" strokeWidth="1.5" />
                {/* Spider */}
                <circle cx="38" cy="20" r="4" fill="#0F172A" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#68734A]">+</span>
            {/* Page */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 70" className="w-20 h-24">
                <path d="M12 5 L38 5 L50 17 L50 65 L12 65 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
                <path d="M38 5 L38 17 L50 17 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
                <line x1="18" y1="28" x2="44" y2="28" stroke="#68734A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="18" y1="37" x2="44" y2="37" stroke="#68734A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="18" y1="46" x2="38" y2="46" stroke="#68734A" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 120 100" className="w-36 h-32">
              <rect x="15" y="20" width="90" height="60" rx="8" fill="white" stroke="#1E293B" strokeWidth="3" />
              <path d="M16 22 L60 55 L104 22" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinejoin="round" />
              {/* @ badge */}
              <circle cx="85" cy="65" r="14" fill="#4B6B40" stroke="white" strokeWidth="2" />
              <text x="85" y="70" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">@</text>
            </svg>
          </div>
        );

      case 'network':
        return (
          <div className="flex items-center justify-center gap-3 p-4 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-md mx-auto">
            {/* Racket Net */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 70" className="w-20 h-24">
                <ellipse cx="30" cy="28" rx="20" ry="24" fill="#FEF3C7" stroke="#334155" strokeWidth="2.5" />
                <line x1="20" y1="6" x2="20" y2="50" stroke="#94A3B8" strokeWidth="1" />
                <line x1="30" y1="4" x2="30" y2="52" stroke="#94A3B8" strokeWidth="1" />
                <line x1="40" y1="6" x2="40" y2="50" stroke="#94A3B8" strokeWidth="1" />
                <line x1="12" y1="18" x2="48" y2="18" stroke="#94A3B8" strokeWidth="1" />
                <line x1="10" y1="28" x2="50" y2="28" stroke="#94A3B8" strokeWidth="1" />
                <line x1="12" y1="38" x2="48" y2="38" stroke="#94A3B8" strokeWidth="1" />
                <rect x="27" y="52" width="6" height="16" rx="2" fill="#92400E" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#68734A]">+</span>
            {/* Briefcase (Work) */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 70 60" className="w-24 h-24">
                <rect x="10" y="20" width="50" height="35" rx="5" fill="#92400E" stroke="#572608" strokeWidth="2" />
                <path d="M25 20 L25 12 C25 9 45 9 45 12 L45 20" fill="none" stroke="#572608" strokeWidth="3" />
                <rect x="30" y="28" width="10" height="8" rx="1.5" fill="#F59E0B" />
              </svg>
            </div>
          </div>
        );

      case 'youtube':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 120 90" className="w-36 h-28">
              <rect x="15" y="15" width="90" height="60" rx="18" fill="#DC2626" />
              <polygon points="52,30 78,45 52,60" fill="white" />
            </svg>
          </div>
        );

      case 'usb':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 80 120" className="w-28 h-36">
              {/* USB plug connector */}
              <rect x="25" y="10" width="30" height="30" rx="2" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
              <rect x="31" y="16" width="6" height="8" fill="#1E293B" />
              <rect x="43" y="16" width="6" height="8" fill="#1E293B" />
              {/* USB Body */}
              <rect x="20" y="38" width="40" height="65" rx="8" fill="#1E293B" />
              <line x1="28" y1="52" x2="52" y2="52" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="40" cy="85" r="4" fill="white" />
            </svg>
          </div>
        );

      case 'motherboard':
        return (
          <div className="flex items-center justify-center gap-3 p-4 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-md mx-auto">
            {/* Mother + Child */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 70" className="w-20 h-24">
                {/* Mother */}
                <circle cx="22" cy="16" r="6" fill="#D97706" />
                <path d="M12 28 C12 24 32 24 32 28 L35 55 L9 55 Z" fill="#65A30D" />
                {/* Child */}
                <circle cx="44" cy="30" r="5" fill="#D97706" />
                <path d="M36 40 C36 36 52 36 52 40 L54 60 L34 60 Z" fill="#EAB308" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#68734A]">+</span>
            {/* Board */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 70 70" className="w-24 h-24">
                <rect x="5" y="5" width="60" height="60" rx="4" fill="#15803D" stroke="#166534" strokeWidth="2" />
                <rect x="18" y="18" width="16" height="16" rx="2" fill="#334155" />
                <rect x="42" y="12" width="6" height="30" fill="#1E293B" />
                <line x1="26" y1="34" x2="26" y2="50" stroke="#86EFAC" strokeWidth="2" />
                <line x1="26" y1="50" x2="44" y2="50" stroke="#86EFAC" strokeWidth="2" />
                <circle cx="44" cy="50" r="2.5" fill="#FEF08A" />
              </svg>
            </div>
          </div>
        );

      case 'notification':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <path d="M50 15 C38 15 30 25 30 38 L30 55 L22 65 L78 65 L70 55 L70 38 C70 25 62 15 50 15 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <path d="M42 68 C42 73 58 73 58 68" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              {/* Badge 1 */}
              <circle cx="72" cy="28" r="14" fill="#EF4444" stroke="white" strokeWidth="2" />
              <text x="72" y="34" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
            </svg>
          </div>
        );

      case 'bug':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {/* Beetle body */}
              <ellipse cx="50" cy="55" rx="24" ry="30" fill="#3F6212" stroke="#1E293B" strokeWidth="2" />
              {/* Head */}
              <circle cx="50" cy="24" r="12" fill="#1E293B" />
              {/* Eyes */}
              <circle cx="45" cy="20" r="2" fill="white" />
              <circle cx="55" cy="20" r="2" fill="white" />
              {/* Antennae */}
              <path d="M46 14 Q38 4 30 8" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M54 14 Q62 4 70 8" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              {/* Legs */}
              <path d="M26 40 L10 35 M26 55 L8 55 M26 70 L12 78" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <path d="M74 40 L90 35 M74 55 L92 55 M74 70 L88 78" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              {/* Dots */}
              <circle cx="40" cy="45" r="3" fill="#1E293B" />
              <circle cx="60" cy="45" r="3" fill="#1E293B" />
              <circle cx="42" cy="62" r="3" fill="#1E293B" />
              <circle cx="58" cy="62" r="3" fill="#1E293B" />
            </svg>
          </div>
        );

      case 'cloud':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 80" className="w-36 h-28">
              <path d="M30 65 L75 65 A15 15 0 0 0 82 38 A20 20 0 0 0 45 25 A16 16 0 0 0 25 45 A16 16 0 0 0 30 65 Z" fill="#1E293B" />
              {/* Upload arrow */}
              <line x1="52" y1="55" x2="52" y2="35" stroke="white" strokeWidth="4" strokeLinecap="round" />
              <polyline points="42,43 52,33 62,43" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );

      case 'keyboard':
        return (
          <div className="flex items-center justify-center gap-3 p-4 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-md mx-auto">
            {/* Key */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 60" className="w-20 h-24">
                <circle cx="20" cy="30" r="12" fill="none" stroke="#D97706" strokeWidth="4" />
                <line x1="32" y1="30" x2="52" y2="30" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
                <line x1="44" y1="30" x2="44" y2="38" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
                <line x1="50" y1="30" x2="50" y2="38" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#68734A]">+</span>
            {/* Board */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 70 70" className="w-24 h-24">
                <rect x="8" y="10" width="54" height="38" rx="2" fill="#1E3A2F" stroke="#92400E" strokeWidth="3" />
                <line x1="16" y1="20" x2="38" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="28" x2="44" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
                {/* Stand */}
                <line x1="16" y1="48" x2="10" y2="65" stroke="#92400E" strokeWidth="3" />
                <line x1="54" y1="48" x2="60" y2="65" stroke="#92400E" strokeWidth="3" />
              </svg>
            </div>
          </div>
        );

      case 'bluetooth':
        return (
          <div className="flex items-center justify-center gap-3 p-4 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-md mx-auto">
            {/* Blue circle */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 60" className="w-20 h-24">
                <circle cx="30" cy="30" r="22" fill="#2563EB" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#68734A]">+</span>
            {/* Tooth */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 70" className="w-20 h-24">
                <path d="M15 15 C15 5 45 5 45 15 C45 30 50 45 42 62 C38 70 34 50 30 40 C26 50 22 70 18 62 C10 45 15 30 15 15 Z" fill="white" stroke="#1E293B" strokeWidth="2" />
              </svg>
            </div>
          </div>
        );

      case 'tablet':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 80" className="w-36 h-28">
              <rect x="15" y="8" width="70" height="64" rx="8" fill="#1E293B" />
              <rect x="20" y="14" width="60" height="52" rx="4" fill="#F8FAFC" />
              {/* App icons */}
              <rect x="25" y="20" width="10" height="10" rx="2" fill="#3B82F6" />
              <rect x="40" y="20" width="10" height="10" rx="2" fill="#F59E0B" />
              <rect x="55" y="20" width="10" height="10" rx="2" fill="#10B981" />
              <rect x="25" y="36" width="10" height="10" rx="2" fill="#EF4444" />
              <rect x="40" y="36" width="10" height="10" rx="2" fill="#8B5CF6" />
              <rect x="55" y="36" width="10" height="10" rx="2" fill="#06B6D4" />
            </svg>
          </div>
        );

      case 'incognito':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {/* Fedora hat */}
              <ellipse cx="50" cy="40" rx="40" ry="10" fill="#334155" />
              <path d="M25 40 Q25 15 50 15 Q75 15 75 40 Z" fill="#1E293B" />
              <rect x="25" y="34" width="50" height="6" fill="#0EA5E9" />
              {/* Glasses */}
              <circle cx="36" cy="62" r="14" fill="#0F172A" />
              <circle cx="64" cy="62" r="14" fill="#0F172A" />
              <line x1="50" y1="62" x2="50" y2="62" stroke="#0F172A" strokeWidth="4" />
            </svg>
          </div>
        );

      case 'cookie':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <path d="M50 15 C70 15 85 30 85 50 C80 50 78 45 74 48 C70 52 75 58 72 62 C70 65 65 62 60 68 C70 80 55 85 50 85 C30 85 15 70 15 50 C15 30 30 15 50 15 Z" fill="#D97706" />
              {/* Choc chips */}
              <circle cx="35" cy="38" r="3.5" fill="#451A03" />
              <circle cx="48" cy="48" r="3.5" fill="#451A03" />
              <circle cx="38" cy="60" r="3.5" fill="#451A03" />
              <circle cx="58" cy="32" r="3.5" fill="#451A03" />
            </svg>
          </div>
        );

      case 'mouse':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 80 110" className="w-28 h-36">
              <rect x="18" y="25" width="44" height="65" rx="22" fill="#F8FAFC" stroke="#1E293B" strokeWidth="3" />
              {/* Divider & scroll wheel */}
              <line x1="40" y1="25" x2="40" y2="55" stroke="#1E293B" strokeWidth="2" />
              <rect x="36" y="32" width="8" height="15" rx="4" fill="#3B82F6" />
              {/* Wire */}
              <path d="M40 25 C40 10 50 12 50 4" fill="none" stroke="#1E293B" strokeWidth="2.5" />
            </svg>
          </div>
        );

      case 'notebook':
        return (
          <div className="flex items-center justify-center gap-3 p-4 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-md mx-auto">
            {/* Note */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 60" className="w-20 h-24">
                <rect x="8" y="8" width="44" height="44" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
                <circle cx="30" cy="14" r="3" fill="#DC2626" />
                <line x1="16" y1="24" x2="44" y2="24" stroke="#854D0E" strokeWidth="2" />
                <line x1="16" y1="32" x2="44" y2="32" stroke="#854D0E" strokeWidth="2" />
                <line x1="16" y1="40" x2="36" y2="40" stroke="#854D0E" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#68734A]">+</span>
            {/* Book */}
            <div className="p-3 bg-white rounded-xl shadow-sm border border-[#E6E0D2] flex flex-col items-center">
              <svg viewBox="0 0 60 70" className="w-20 h-24">
                <rect x="12" y="10" width="38" height="50" rx="3" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
                <rect x="18" y="18" width="18" height="4" fill="white" />
                <rect x="18" y="26" width="12" height="4" fill="white" />
                {/* Bookmark ribbon */}
                <path d="M38 60 L38 68 L42 65 L46 68 L46 60 Z" fill="#DC2626" />
              </svg>
            </div>
          </div>
        );

      case 'recycle-bin':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <rect x="30" y="20" width="40" height="8" rx="3" fill="#1E293B" />
              <path d="M26 30 L32 85 C32 88 68 88 68 85 L74 30 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="3" />
              {/* Recycling symbol */}
              <polygon points="50,45 62,65 38,65" fill="none" stroke="#16A34A" strokeWidth="4" strokeLinejoin="round" />
            </svg>
          </div>
        );

      case 'chip':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <rect x="25" y="25" width="50" height="50" rx="4" fill="#1E293B" stroke="#D97706" strokeWidth="2" />
              <rect x="34" y="34" width="32" height="32" rx="2" fill="#0F172A" />
              <circle cx="31" cy="31" r="2.5" fill="#FBBF24" />
              {/* Pins */}
              <line x1="32" y1="25" x2="32" y2="15" stroke="#FBBF24" strokeWidth="2.5" />
              <line x1="44" y1="25" x2="44" y2="15" stroke="#FBBF24" strokeWidth="2.5" />
              <line x1="56" y1="25" x2="56" y2="15" stroke="#FBBF24" strokeWidth="2.5" />
              <line x1="68" y1="25" x2="68" y2="15" stroke="#FBBF24" strokeWidth="2.5" />
              <line x1="32" y1="75" x2="32" y2="85" stroke="#FBBF24" strokeWidth="2.5" />
              <line x1="44" y1="75" x2="44" y2="85" stroke="#FBBF24" strokeWidth="2.5" />
              <line x1="56" y1="75" x2="56" y2="85" stroke="#FBBF24" strokeWidth="2.5" />
              <line x1="68" y1="75" x2="68" y2="85" stroke="#FBBF24" strokeWidth="2.5" />
            </svg>
          </div>
        );

      case 'link':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <rect x="20" y="35" width="38" height="24" rx="12" transform="rotate(-45 39 47)" fill="none" stroke="#2563EB" strokeWidth="6" />
              <rect x="42" y="35" width="38" height="24" rx="12" transform="rotate(-45 61 47)" fill="none" stroke="#475569" strokeWidth="6" />
            </svg>
          </div>
        );

      case 'key':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 80" className="w-32 h-28">
              <circle cx="32" cy="40" r="18" fill="none" stroke="#D97706" strokeWidth="6" />
              <line x1="50" y1="40" x2="85" y2="40" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
              <line x1="72" y1="40" x2="72" y2="54" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
              <line x1="82" y1="40" x2="82" y2="54" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'zip':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 80" className="w-36 h-28">
              <path d="M15 20 L40 20 L50 28 L85 28 L85 68 L15 68 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
              {/* Zipper teeth */}
              <line x1="50" y1="28" x2="50" y2="68" stroke="#1E293B" strokeWidth="5" strokeDasharray="3,3" />
              <rect x="46" y="52" width="8" height="12" rx="2" fill="#475569" />
            </svg>
          </div>
        );

      case 'router':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 90" className="w-36 h-32">
              <line x1="30" y1="45" x2="25" y2="18" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              <line x1="70" y1="45" x2="75" y2="18" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              <rect x="18" y="45" width="64" height="28" rx="8" fill="#1E293B" />
              {/* LED signals */}
              <circle cx="32" cy="59" r="3" fill="#34D399" />
              <circle cx="44" cy="59" r="3" fill="#34D399" />
              <circle cx="56" cy="59" r="3" fill="#F59E0B" />
            </svg>
          </div>
        );

      case 'camera':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 80" className="w-36 h-28">
              <rect x="20" y="24" width="60" height="46" rx="8" fill="#334155" />
              <path d="M38 24 L44 16 L56 16 L62 24 Z" fill="#334155" />
              <circle cx="50" cy="47" r="15" fill="#0EA5E9" stroke="#1E293B" strokeWidth="3" />
              <circle cx="50" cy="47" r="8" fill="#0369A1" />
              <circle cx="70" cy="32" r="3" fill="#EF4444" />
            </svg>
          </div>
        );

      case 'lock':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 90 90" className="w-32 h-32">
              <path d="M30 40 L30 25 C30 15 60 15 60 25 L60 40" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
              <rect x="22" y="38" width="46" height="42" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <circle cx="45" cy="55" r="4" fill="#78350F" />
              <line x1="45" y1="57" x2="45" y2="67" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'folder':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 80" className="w-36 h-28">
              <path d="M15 20 L40 20 L48 26 L85 26 L85 68 L15 68 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            </svg>
          </div>
        );

      case 'monitor':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 90" className="w-36 h-32">
              <rect x="15" y="15" width="70" height="50" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <rect x="20" y="20" width="60" height="40" fill="#F8FAFC" />
              <line x1="50" y1="65" x2="50" y2="76" stroke="#475569" strokeWidth="5" />
              <line x1="35" y1="76" x2="65" y2="76" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'laptop':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 80" className="w-36 h-28">
              <rect x="22" y="15" width="56" height="38" rx="3" fill="#1E293B" />
              <rect x="26" y="19" width="48" height="30" fill="#E2E8F0" />
              <path d="M10 56 L90 56 L84 65 L16 65 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
            </svg>
          </div>
        );

      case 'globe':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-[#F5F2E9] rounded-2xl border border-[#DFD7C5] max-w-sm mx-auto">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <circle cx="50" cy="50" r="36" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
              {/* Continents */}
              <path d="M35 30 Q45 25 55 35 Q50 50 35 45 Z" fill="#22C55E" />
              <path d="M60 55 Q75 60 70 75 Q55 70 60 55 Z" fill="#22C55E" />
              {/* Latitude/longitude grid */}
              <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1="50" y1="14" x2="50" y2="86" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="my-4 flex justify-center">
      {renderGraphic()}
    </div>
  );
};

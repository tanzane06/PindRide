import React from 'react';

export const HomeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const RouteIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

export const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const SmsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

export const LocationMarkerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const SignalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6.253v11.494A2.25 2.25 0 0117.75 20H6.25A2.25 2.25 0 014 17.747V6.253A2.25 2.25 0 016.25 4h11.5A2.25 2.25 0 0120 6.253zM8 16h8" />
  </svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const BusIcon = ({ className, ...props }: { className?: string, [key: string]: any }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
        <path d="M18.9 2.1c-1.3-1.3-3.1-2.1-5-2.1H10c-1.9 0-3.7.8-5,2.1C3.7,3.4,3,5.2,3,7.1v10.8c0,1.9.8,3.7,2.1,5C6.4,24.2,8.2,25,10.1,25h3.8c1.9,0,3.7-.8,5-2.1,1.3-1.3,2.1-3.1,2.1-5V7.1c0-1.9-.8-3.7-2.1-5zM9,22c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2S10.1,22,9,22zm6,0c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2S16.1,22,15,22zM19,13H5V7c0-1.1.4-2.1,1.2-2.8.7-.7,1.7-1.2,2.8-1.2h4c1.1,0,2.1.4,2.8,1.2.7.7,1.2,1.7,1.2,2.8v6z" />
    </svg>
);

export const StarIcon = ({ className, filled }: { className?: string, filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

export const PunjabMapIcon = ({ className, theme }: { className?: string; theme: 'light' | 'dark' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
        {/* Base Map Shape */}
        <path d="M45.6,11.3c-2.7,0-5.3,0.1-8,0.2c-2.1,0.1-4.2,0.1-6.3,0.3c-2.3,0.2-4.5,0.4-6.8,0.7c-2.3,0.3-4.6,0.8-6.9,1.3 c-2.2,0.5-4.4,1.1-6.5,1.9c-1,0.4-2,0.8-3,1.3c-0.6,0.3-1.2,0.6-1.8,1c-0.5,0.3-1,0.7-1.4,1.1c-0.3,0.3-0.5,0.5-0.7,0.8 c-0.1,0.1-0.2,0.3-0.2,0.4c-0.1,0.2-0.2,0.4-0.2,0.6c-0.1,0.4-0.1,0.8-0.1,1.2c0,0.6,0,1.2,0.1,1.8c0.1,0.7,0.1,1.4,0.2,2.1 c0.1,0.7,0.2,1.4,0.4,2.1c0.2,0.7,0.3,1.4,0.5,2.1c0.2,0.7,0.4,1.5,0.7,2.2c0.3,0.8,0.6,1.5,0.9,2.3c0.3,0.8,0.7,1.6,1.1,2.4 c0.2,0.4,0.4,0.8,0.6,1.2c0.2,0.4,0.5,0.9,0.7,1.3c0.3,0.5,0.5,0.9,0.8,1.4c0.1,0.2,0.3,0.5,0.4,0.7c0.1,0.2,0.3,0.5,0.4,0.7 c0.1,0.2,0.3,0.5,0.4,0.7c0.1,0.2,0.2,0.3,0.3,0.5c0.1,0.2,0.2,0.3,0.3,0.5c0.1,0.2,0.2,0.3,0.3,0.5c0.1,0.1,0.1,0.2,0.2,0.3 c0.1,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.3,0.3,0.4c0.1,0.1,0.2,0.3,0.3,0.4 c0.1,0.1,0.2,0.3,0.3,0.4c0.2,0.3,0.4,0.6,0.7,0.9c0.3,0.3,0.6,0.7,0.9,1c0.1,0.1,0.2,0.3,0.3,0.4c0.1,0.1,0.2,0.3,0.3,0.4 c0.1,0.1,0.2,0.3,0.3,0.4c0.2,0.3,0.4,0.6,0.7,0.9c0.5,0.6,1.1,1.2,1.7,1.7c0.6,0.5,1.2,1.1,1.9,1.6c0.7,0.5,1.4,1,2.1,1.5 c0.7,0.5,1.4,0.9,2.2,1.4c0.8,0.5,1.5,0.9,2.3,1.3c0.8,0.4,1.6,0.8,2.5,1.1c1.8,0.7,3.6,1.2,5.5,1.7c1.9,0.5,3.9,0.8,5.8,1 c1.9,0.2,3.9,0.3,5.8,0.3c2,0,3.9-0.1,5.9-0.2c2-0.2,4-0.4,5.9-0.7c2-0.3,3.9-0.7,5.8-1.2c1.9-0.5,3.8-1.1,5.7-1.8 c1.8-0.7,3.6-1.5,5.4-2.4c1.8-0.9,3.5-2,5.2-3.2c1.4-1,2.8-2.1,4.1-3.3c0.7-0.6,1.3-1.3,2-2c0.6-0.6,1.2-1.3,1.8-2 c0.6-0.7,1.1-1.4,1.6-2.1c0.5-0.7,1-1.5,1.4-2.3c0.4-0.8,0.8-1.6,1.2-2.4c0.4-0.8,0.7-1.7,1-2.5c0.3-0.8,0.6-1.6,0.8-2.5 c0.2-0.8,0.4-1.7,0.6-2.5c0.2-0.9,0.3-1.7,0.4-2.6c0.1-0.9,0.2-1.8,0.2-2.7c0-0.9,0-1.8-0.1-2.7c-0.1-0.9-0.2-1.8-0.3-2.7 c-0.2-0.9-0.3-1.8-0.5-2.6c-0.2-0.9-0.5-1.8-0.7-2.6c-0.3-0.9-0.5-1.7-0.8-2.6c-0.3-0.8-0.7-1.6-1-2.4c-0.2-0.5-0.4-0.9-0.6-1.4 c-0.2-0.5-0.5-1-0.7-1.4c-0.3-0.5-0.6-1-0.9-1.5c-0.3-0.5-0.7-0.9-1-1.4c-0.4-0.5-0.8-0.9-1.2-1.3c-0.4-0.4-0.9-0.8-1.3-1.2 c-0.5-0.4-0.9-0.8-1.4-1.1c-0.5-0.3-1-0.7-1.6-1c-0.6-0.3-1.2-0.6-1.8-0.8c-0.6-0.2-1.2-0.5-1.8-0.7c-0.7-0.2-1.3-0.4-2-0.6 c-0.7-0.2-1.4-0.4-2.1-0.6c-0.7-0.2-1.5-0.4-2.2-0.5c-0.8-0.1-1.5-0.3-2.3-0.4c-0.8-0.1-1.6-0.2-2.4-0.3 c-0.8-0.1-1.7-0.2-2.5-0.3c-0.8-0.1-1.7-0.1-2.5-0.2c-0.9-0.1-1.7-0.1-2.6-0.1C50,11.3,47.8,11.3,45.6,11.3z" 
            fill={theme === 'dark' ? '#44403c' : '#f5f5f4'}
            stroke={theme === 'dark' ? '#57534e' : '#d6d3d1'}
            strokeWidth="0.5" />
        {/* Rivers */}
        <path d="M 55 45 Q 45 55, 38 60 T 25 78" stroke={theme === 'dark' ? '#0ea5e9' : '#bae6fd'} strokeWidth="0.8" fill="none" />
        <path d="M 82 38 Q 70 35, 55 45 T 40 42" stroke={theme === 'dark' ? '#0ea5e9' : '#bae6fd'} strokeWidth="0.6" fill="none" />
        {/* Major Roads */}
        <path d="M 82 38 L 75 60 L 60 64 L 48 65 L 32 80 L 12 68" stroke={theme === 'dark' ? '#64748b' : '#e7e5e4'} strokeWidth="0.7" fill="none" />
        <path d="M 55 45 L 48 65" stroke={theme === 'dark' ? '#64748b' : '#e7e5e4'} strokeWidth="0.5" fill="none" />
        <path d="M 82 38 L 55 45 L 30 40" stroke={theme === 'dark' ? '#64748b' : '#e7e5e4'} strokeWidth="0.5" fill="none" />
    </svg>
);

export const BellIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export const MoonIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);


export const GlobeAltIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
    </svg>
);

export const WifiOffIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L5.636 18.364M5.636 5.636l12.728 12.728" />
    </svg>
);
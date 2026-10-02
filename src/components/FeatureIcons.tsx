import React from 'react';

interface FeatureIconProps {
  className?: string;
  size?: number;
  active?: boolean;
}

/**
 * 1. DAFTAR SR (Sambungan Baru)
 * Simple, elegant, modern vector: Minimalist water droplet with connection node / pen
 */
export const FeatureIconSR: React.FC<FeatureIconProps> = ({
  className = '',
  size = 20,
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background soft glow when active */}
      {active && (
        <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
      )}
      {/* Sleek water droplet base */}
      <path
        d="M12 2.5C12 2.5 5 10.8 5 15.2C5 19.1 8.1 22 12 22C15.9 22 19 19.1 19 15.2C19 10.8 12 2.5 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner modern document / registration checkmark & plus lines */}
      <path
        d="M9 14.5L11 16.5L15 12"
        stroke={active ? 'currentColor' : '#F37021'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Minimalist water fluid curve accent */}
      <path
        d="M8.5 16C8.5 17.5 9.8 18.8 11.5 19"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  );
};

/**
 * 2. TRACKING SAMBUNGAN BARU
 * Simple, elegant, modern vector: Dynamic radar waypoint with concentric orbital pulses
 */
export const FeatureIconTracking: React.FC<FeatureIconProps> = ({
  className = '',
  size = 20,
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer subtle orbital ring */}
      <circle
        cx="12"
        cy="11"
        r="9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="2 3"
        strokeOpacity="0.4"
      />
      {/* Modern Location Pin with precision target */}
      <path
        d="M12 2C8.134 2 5 5.134 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.134 15.866 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Active Radar Node */}
      <circle
        cx="12"
        cy="9"
        r="3"
        fill={active ? 'currentColor' : '#005DAA'}
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* Center pinpoint */}
      <circle cx="12" cy="9" r="1" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * 3. PEMBAYARAN TAGIHAN (Billing)
 * Simple, elegant, modern vector: Water meter dial combined with sleek invoice / digital card
 */
export const FeatureIconBilling: React.FC<FeatureIconProps> = ({
  className = '',
  size = 20,
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sleek rounded credit card / bill card */}
      <rect
        x="2.5"
        y="4"
        width="19"
        height="16"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* Minimalist magnetic chip / bill header band */}
      <path
        d="M2.5 9H21.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeOpacity="0.6"
      />
      {/* Water usage indicator droplet inside */}
      <path
        d="M8 15.5C8 14 9.5 12.2 9.5 12.2C9.5 12.2 11 14 11 15.5C11 16.3 10.3 17 9.5 17C8.7 17 8 16.3 8 15.5Z"
        fill={active ? 'currentColor' : '#005DAA'}
      />
      {/* Quick check/currency bar */}
      <path
        d="M14 13.5H17.5M14 16H16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * 4. SURVEY KEPUASAN
 * Simple, elegant, modern vector: Chat feedback emblem with subtle star of excellence
 */
export const FeatureIconSurvey: React.FC<FeatureIconProps> = ({
  className = '',
  size = 20,
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded conversation bubble with sleek tail */}
      <path
        d="M20 11.5C20 15.642 16.418 19 12 19C10.74 19 9.55 18.72 8.5 18.22L4 19.5L5.4 15.8C4.52 14.54 4 13.08 4 11.5C4 7.358 7.582 4 12 4C16.418 4 20 7.358 20 11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center 4-point satisfaction sparkle / star */}
      <path
        d="M12 7.5L12.9 10.1L15.5 11L12.9 11.9L12 14.5L11.1 11.9L8.5 11L11.1 10.1L12 7.5Z"
        fill={active ? 'currentColor' : '#F37021'}
      />
    </svg>
  );
};

/**
 * 5. PUSAT BANTUAN & FAQ
 * Simple, elegant, modern vector: Knowledge compass / help beacon
 */
export const FeatureIconFAQ: React.FC<FeatureIconProps> = ({
  className = '',
  size = 20,
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* Minimalist sleek Question mark */}
      <path
        d="M9.5 9C9.5 7.6 10.6 6.5 12 6.5C13.4 6.5 14.5 7.6 14.5 9C14.5 10.2 13.7 10.8 12.8 11.4C12.3 11.7 12 12.2 12 12.8V13.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1.1" fill="currentColor" />
    </svg>
  );
};

/**
 * 6. ADMIN / BACKOFFICE DATA PELANGGAN
 * Simple, elegant, modern vector: Verified governance shield & users database node
 */
export const FeatureIconAdmin: React.FC<FeatureIconProps> = ({
  className = '',
  size = 20,
  active = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield Base */}
      <path
        d="M12 2.5L19.5 5.8V11.5C19.5 16.4 16.3 20.2 12 21.5C7.7 20.2 4.5 16.4 4.5 11.5V5.8L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner dashboard verified grid */}
      <path
        d="M9 11.8L11 13.8L15 9.8"
        stroke={active ? 'currentColor' : '#F37021'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

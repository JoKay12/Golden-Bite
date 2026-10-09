import type { ReactNode, SVGProps } from "react";

/**
 * Golden Bite icon set: one family, drawn on a 24 × 24 grid with a 1.75 rounded stroke, coloured
 * by `currentColor` so each icon takes the colour of the text around it. Icons are decorative
 * (aria-hidden): the text next to them always says what they mean.
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Icon({ size = 20, className, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ? `icon ${className}` : "icon"}
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Chat bubble, used for every "send on WhatsApp" action. */
export const ChatIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 4.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8.5L6 21v-3.5H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
    <path d="M8 11h.01M12 11h.01M16 11h.01" strokeWidth={2.5} />
  </Icon>
);

export const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8.6 3.5H5.5a2 2 0 0 0-2 2.2 16.5 16.5 0 0 0 14.8 14.8 2 2 0 0 0 2.2-2v-3.1a1.5 1.5 0 0 0-1.1-1.4l-3-.9a1.5 1.5 0 0 0-1.5.4l-1.3 1.3a12 12 0 0 1-4.9-4.9l1.3-1.3a1.5 1.5 0 0 0 .4-1.5l-.9-3a1.5 1.5 0 0 0-1.4-1.1Z" />
  </Icon>
);

/**
 * Delivery rider on a scooter with a food box (filled silhouette, traced from the artwork the
 * owner chose). Wider than it is tall, so it is drawn a little wider than the other icons.
 */
const RIDER =
  "M8.15 17.70 C7.25 17.52 6.61 16.87 6.27 15.78 L6.17 15.44 L5.79 15.44 C5.31 15.44 5.22 15.36 5.22 14.94 C5.22 14.78 5.24 14.61 5.27 14.56 C5.32 14.47 5.28 14.47 3.28 14.47 L1.25 14.47 L1.07 14.33 C0.88 14.19 0.88 14.18 0.95 14.08 L1.02 13.97 L3.23 13.97 L5.45 13.97 L5.59 13.76 C5.83 13.41 5.88 13.42 4.13 13.42 C2.37 13.42 2.37 13.42 2.50 13.11 L2.56 12.96 L4.35 12.96 L6.14 12.96 L6.21 12.85 C6.30 12.71 6.88 12.27 7.17 12.12 C7.51 11.95 7.61 11.82 7.64 11.52 L7.66 11.27 L7.51 11.27 C7.25 11.27 7.08 10.98 6.96 10.31 C6.88 9.87 6.95 9.89 5.77 9.89 L4.74 9.89 L4.57 9.72 C4.34 9.48 4.31 9.39 4.31 9.03 L4.31 8.70 L2.36 8.70 L0.41 8.70 L0.34 8.59 C0.29 8.51 0.28 8.46 0.32 8.36 L0.36 8.24 L2.31 8.24 L4.26 8.24 L4.26 7.97 L4.26 7.69 L3.69 7.69 C3.08 7.69 3.02 7.67 3.02 7.43 C3.02 7.24 3.16 7.19 3.72 7.19 L4.26 7.19 L4.26 5.97 L4.26 4.75 L4.45 4.48 L4.65 4.22 L7.05 4.22 C9.85 4.21 9.75 4.21 9.92 4.46 C10.08 4.69 10.07 4.57 10.07 7.20 L10.08 9.39 L10.55 9.39 L11.03 9.39 L10.98 9.22 C10.96 9.12 10.95 8.77 10.96 8.41 C11.01 6.59 12.05 3.84 12.92 3.22 C13.05 3.13 13.15 3.05 13.15 3.04 C13.15 3.00 12.99 2.77 12.87 2.63 C12.68 2.41 12.56 1.87 12.63 1.55 C12.76 0.98 13.09 0.55 13.56 0.33 C13.97 0.13 14.68 0.15 15.00 0.35 C15.30 0.55 15.55 0.79 15.72 1.06 L15.86 1.28 L16.24 1.28 L16.61 1.28 L16.67 1.43 C16.75 1.61 16.62 1.74 16.36 1.75 C16.27 1.75 16.16 1.75 16.12 1.76 C16.08 1.77 16.02 1.77 15.98 1.78 C15.93 1.78 15.90 1.85 15.88 2.02 C15.82 2.49 15.55 2.89 15.06 3.19 C14.91 3.28 14.79 3.37 14.79 3.38 C14.79 3.39 14.88 3.52 14.98 3.66 C15.08 3.81 15.38 4.37 15.64 4.90 C16.16 5.94 16.19 5.98 16.59 6.05 C17.11 6.15 17.14 6.15 17.52 6.00 C18.10 5.76 18.83 5.63 19.66 5.60 C20.20 5.58 20.40 5.59 20.45 5.63 C20.54 5.71 20.54 6.51 20.45 6.89 C20.41 7.04 20.38 7.29 20.38 7.44 C20.38 8.14 20.25 8.28 19.67 8.20 C19.48 8.17 19.31 8.15 19.30 8.17 C19.29 8.18 19.63 8.90 20.06 9.78 C20.50 10.65 20.84 11.40 20.83 11.44 C20.81 11.49 20.79 11.56 20.77 11.60 C20.74 11.67 20.78 11.68 21.20 11.68 C21.79 11.68 22.05 11.74 22.57 11.98 C23.43 12.38 23.66 12.78 23.24 13.12 C23.13 13.22 23.04 13.31 23.04 13.34 C23.04 13.36 23.16 13.54 23.31 13.74 C23.67 14.23 23.78 14.52 23.81 15.07 C23.84 15.85 23.61 16.50 23.10 17.01 C22.50 17.60 22.12 17.74 21.17 17.72 C20.57 17.70 20.53 17.70 20.24 17.55 C19.61 17.24 19.11 16.70 18.94 16.16 C18.82 15.78 18.78 15.76 18.51 15.91 C18.23 16.06 18.12 16.06 17.98 15.91 C17.87 15.80 17.85 15.74 17.79 15.35 C17.76 15.12 17.73 15.12 17.53 15.30 L17.37 15.44 L14.33 15.44 L11.29 15.44 L11.21 15.77 C11.01 16.62 10.45 17.29 9.66 17.61 C9.46 17.69 8.44 17.75 8.15 17.70 Z M14.52 13.59 C14.57 13.51 14.61 13.38 14.61 13.31 C14.61 13.24 14.67 13.04 14.74 12.87 C14.86 12.57 14.88 12.42 14.94 10.81 L14.95 10.56 L14.66 10.48 C14.23 10.36 14.22 10.37 14.22 10.72 C14.22 11.15 14.16 11.22 13.84 11.22 C13.53 11.22 13.50 11.25 13.29 11.66 C12.93 12.38 12.98 13.25 13.39 13.51 C13.47 13.56 13.72 13.63 13.97 13.66 C14.21 13.70 14.41 13.73 14.42 13.74 C14.42 13.74 14.47 13.67 14.52 13.59 Z M17.77 12.73 C18.12 12.28 18.33 11.68 18.24 11.36 C18.21 11.27 18.17 11.07 18.16 10.92 C18.14 10.77 18.11 10.58 18.09 10.49 C18.07 10.40 18.01 10.15 17.96 9.94 C17.84 9.45 17.40 8.29 17.25 8.06 L17.14 7.89 L16.10 7.69 L15.07 7.49 L14.84 7.21 C14.72 7.06 14.56 6.80 14.50 6.63 C14.43 6.46 14.36 6.32 14.33 6.32 C14.29 6.32 13.88 7.35 13.77 7.74 C13.68 8.02 13.72 8.11 13.92 8.11 C13.99 8.11 14.16 8.15 14.30 8.19 C14.43 8.24 14.70 8.30 14.89 8.33 C15.08 8.36 15.43 8.44 15.67 8.50 C15.92 8.56 16.16 8.61 16.20 8.61 C16.36 8.61 16.76 8.94 16.87 9.16 C16.96 9.35 16.97 9.42 16.96 10.19 C16.96 10.64 16.94 11.20 16.91 11.43 C16.88 11.65 16.85 12.03 16.83 12.25 L16.80 12.66 L17.16 12.81 C17.36 12.89 17.53 12.95 17.55 12.96 C17.57 12.96 17.67 12.86 17.77 12.73 Z M0.18 12.18 L0.18 11.95 L2.70 11.95 L5.22 11.95 L5.31 12.05 C5.42 12.17 5.42 12.18 5.33 12.31 L5.26 12.41 L2.72 12.41 L0.18 12.41 L0.18 12.18 Z M1.88 11.33 C1.79 11.24 1.79 11.24 1.93 11.09 L2.07 10.95 L4.23 10.96 L6.39 10.97 L6.45 11.17 C6.49 11.28 6.50 11.37 6.49 11.39 C6.48 11.40 5.46 11.41 4.22 11.42 C2.01 11.43 1.96 11.43 1.88 11.33 Z";

export const DeliveryIcon = ({ size = 20, className, ...rest }: IconProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    width={Math.round((size * 24) / 18)}
    height={size}
    viewBox="0 0 24 18"
    fill="currentColor"
    className={className ? `icon icon-rider ${className}` : "icon icon-rider"}
    {...rest}
  >
    <path d={RIDER} />
  </svg>
);

/** Shop front, for pickup. */
export const PickupIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 10.5V20h15v-9.5" />
    <path d="M3 10.5 4.8 4h14.4l1.8 6.5a2.5 2.5 0 0 1-4.5 1.3 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.5 2.5 0 0 1 3 10.5Z" />
    <path d="M10 20v-4.5h4V20" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const PinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </Icon>
);

/** Mobile money: a phone with a coin on screen. */
export const MomoIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <circle cx="12" cy="10.5" r="3.2" />
    <path d="M12 9.2v2.6M10.5 18h3" />
  </Icon>
);

/** Banknote, for cash. */
export const CashIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 12h.01M18 12h.01" strokeWidth={2.5} />
  </Icon>
);

/** Fork and knife, for the menu and choosing a meal. */
export const MealIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 3v5.5a2.5 2.5 0 0 0 5 0V3M8.5 3v18" />
    <path d="M18 21V3c-2.2 1.3-3.5 4-3.5 7.5V13H18" />
  </Icon>
);

/** Serving cloche, for catering. */
export const CateringIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 18h18" />
    <path d="M4.5 18a7.5 7.5 0 0 1 15 0" />
    <path d="M12 10.5V8.5M10.5 8h3" />
    <path d="M5 21h14" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const ArrowDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Icon>
);

/** Shown when the basket is empty. */
export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 7.5h13l1 12.5h-15l1-12.5Z" />
    <path d="M9 7.5a3 3 0 0 1 6 0" />
  </Icon>
);

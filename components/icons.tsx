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

/** Delivery van. */
export const DeliveryIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 16.5V6H3v10.5h1.5" />
    <path d="M14 9h3.5l3.5 4v3.5h-1.5" />
    <path d="M9 16.5h6" />
    <circle cx="6.8" cy="17" r="2" />
    <circle cx="17.3" cy="17" r="2" />
  </Icon>
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

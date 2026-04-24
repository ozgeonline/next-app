import Link from "next/link";
import { ChevronRight, LucideIcon, MousePointerClick } from 'lucide-react';
import styles from "./cta.module.css";

export interface CTAButton {
  label: string;
  href: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
  chevronCount?: number;
}

interface CTAProps {
  primaryButton?: CTAButton;
  secondaryButton?: CTAButton;
  className?: string;
}

const defaultPrimary: CTAButton = {
  label: 'Join Us',
  href: '/community',
  icon: MousePointerClick,
  variant: 'primary',
};

const defaultSecondary: CTAButton = {
  label: 'Explore',
  href: '/meals',
  variant: 'secondary',
  chevronCount: 3,
};

export default function CTA({
  primaryButton = defaultPrimary,
  secondaryButton = defaultSecondary,
  className,
}: CTAProps) {
  const PrimaryIcon = primaryButton.icon ?? MousePointerClick;
  const chevrons = Array.from({ length: secondaryButton.chevronCount ?? 3 });

  return (
    <div className={`highlight-buttons ${className ? ` ${className}` : ''}`}>
      <Link
        href={primaryButton.href}
        className={`highlight-first-button ${styles.cta}`}
      >
        {primaryButton.label}
        <PrimaryIcon size={20} />
      </Link>

      <Link
        href={secondaryButton.href}
        className={`highlight-second-button ${styles.cta}`}
      >
        {secondaryButton.label}
        {chevrons.map((_, i) => (
          <ChevronRight key={i} size={20} />
        ))}
      </Link>
    </div>
  );
}
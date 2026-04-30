import { ChevronRight, LucideIcon, MousePointerClick } from 'lucide-react';
import { Button, ButtonGroup } from "@/components/ui/button/Button";
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
    <ButtonGroup className={className}>
      <Button
        href={primaryButton.href}
        variant="primary"
        className={styles.cta}
        iconRight={<PrimaryIcon size={20} />}
      >
        {primaryButton.label}
      </Button>

      <Button
        href={secondaryButton.href}
        variant="secondary"
        className={styles.cta}
        iconRight={chevrons.map((_, i) => (
          <ChevronRight key={i} size={20} />
        ))}
      >
        {secondaryButton.label}
      </Button>
    </ButtonGroup>
  );
}

import { LucideIcon } from 'lucide-react';
import styles from './features-strip.module.css';

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesStripProps {
  items: FeatureItem[];
  className?: string;
}

export default function FeaturesStrip({ items, className }: FeaturesStripProps) {
  return (
    <div className={`${styles.wrapper}${className ? ` ${className}` : ''}`}>
      <div className={styles.strip}>
        {items.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className={styles.item}>
              <div className={styles.icon}>
                <Icon size={20} strokeWidth={2} />
              </div>
              <div className={styles.text}>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
              {idx < items.length - 1 && <div className={styles.divider} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

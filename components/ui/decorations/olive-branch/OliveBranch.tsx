import styles from './olive-branch.module.css';

interface OliveBranchProps {
  className?: string;
}

export default function OliveBranch({ className }: OliveBranchProps) {
  return (
    <div className={`${styles.oliveBranch} ${className || ''}`} />
  );
}

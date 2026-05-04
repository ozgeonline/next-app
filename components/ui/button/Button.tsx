import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "brand" | "plain";

type ButtonProps = {
  children?: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href">;

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "button-primary",
  secondary: "button-secondary",
  accent: "button-accent",
  brand: "button-brand",
  plain: "",
};

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
  iconLeft,
  iconRight,
  fullWidth,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cx(
    variantClassNames[variant],
    fullWidth && "button-full-width",
    className
  );

  const label =
    typeof children === "string" || typeof children === "number"
      ? <span>{children}</span>
      : children;

  const content = (
    <>
      {iconLeft}
      {label}
      {iconRight}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  );
}

export function ButtonGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("button-group", className)}>
      {children}
    </div>
  );
}

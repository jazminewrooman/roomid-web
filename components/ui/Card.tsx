import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  className?: string;
}>;

export function Card({ title, subtitle, className, children }: CardProps) {
  return (
    <article className={`roomid-card ${className ?? ""}`.trim()}>
      {title ? <h3 className="roomid-card-title">{title}</h3> : null}
      {subtitle ? <p className="roomid-card-subtitle">{subtitle}</p> : null}
      {children}
    </article>
  );
}

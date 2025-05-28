// src/components/layout/page-header.tsx
import type React from "react";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

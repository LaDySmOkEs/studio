"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
              <MenuIcon className="h-5 w-5 md:h-5 md:w-5" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {NAV_ITEMS.map((item) => (
              <DropdownMenuItem key={item.href} asChild className="p-0">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 w-full px-2 py-1.5 text-sm",
                    pathname === item.href
                      ? "font-semibold text-primary bg-accent/50"
                      : "text-popover-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

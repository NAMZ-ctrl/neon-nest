"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CurrencyProvider from "@/context/currency-provider";
import { ModeToggle } from "@/components/mode-toggle";

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, i) => ({
    label: segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

export default function OverviewLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const crumbs = useBreadcrumbs();
  console.log(crumbs);
  return (
    <CurrencyProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
            <div className="flex gap-2 items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {crumbs.map((crumb) => (
                    <Fragment key={crumb.href}>
                      <BreadcrumbItem
                        className={crumb.isLast ? "" : "hidden md:block"}
                      >
                        {crumb.isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!crumb.isLast && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div>
             <ModeToggle/>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </CurrencyProvider>
  );
}

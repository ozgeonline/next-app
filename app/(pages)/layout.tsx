"use client";

import TopScrollButton from "@/components/ui/topScrollButton/TopScrollButton";
export default function PagesLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      {children}
      <TopScrollButton />
    </div>
  );
}
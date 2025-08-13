import React from "react";

type CartoonCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function CartoonCard({ children, className }: CartoonCardProps) {
  return (
    <div
      className={
        "rounded-2xl border-4 border-black bg-yellow-200 text-black shadow-[8px_8px_0_0_#000] p-4 " +
        (className ?? "")
      }
      style={{ filter: "saturate(120%)" }}
    >
      {children}
    </div>
  );
} 
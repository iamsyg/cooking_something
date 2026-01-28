// components/layout/LayoutWrapper.tsx 

"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Header";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { loadAgent } from "@/store/slices/agentSlice";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const dispatch = useAppDispatch();


  // useEffect(() => {
  //   dispatch(loadAgent());
  // }, [dispatch]);

  // Hide sidebar and navbar on login page
  if (pathname === "/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // For all other pages, show full layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Navbar />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
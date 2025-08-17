"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Loader Component
const Loader = () => (
  <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
    <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Detect route changes

  useEffect(() => {
    // Show loader when the route changes
    setLoading(true);

    // Hide loader after a small delay
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // Add a small delay for better UX

    return () => {
      clearTimeout(timeout); // Cleanup timeout to prevent memory leaks
    };
  }, [pathname]); // Trigger on route change

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
}

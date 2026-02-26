import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { isFeatureEnabled } from "@/lib/features";

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function CoursesLayout({
  children,
}: CoursesLayoutProps): JSX.Element {
  if (!isFeatureEnabled("courses")) {
    notFound();
  }

  return (
    <AuthProvider>
      {children}
      <Toaster richColors position="bottom-right" />
    </AuthProvider>
  );
}

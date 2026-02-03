import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthProvider";

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function CoursesLayout({
  children,
}: CoursesLayoutProps): JSX.Element {
  return (
    <AuthProvider>
      {children}
      <Toaster richColors position="bottom-right" />
    </AuthProvider>
  );
}

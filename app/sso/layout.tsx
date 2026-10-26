import { Suspense, type ReactNode } from "react";

export default function SsoLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

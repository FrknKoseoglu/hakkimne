"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#2563eb"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}

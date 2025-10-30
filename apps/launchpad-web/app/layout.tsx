import "./globals.css";
import type { ReactNode } from "react";
import { CoreLogger } from "./core-logger";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CoreLogger />
        {children}
      </body>
    </html>
  );
}

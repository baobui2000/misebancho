import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Submission Tracker",
  description: "Real-time task submission tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} mdl-js`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

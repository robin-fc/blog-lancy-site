import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "墨刻 - 免费公众号排版工具",
    template: "%s | 墨刻",
  },
  description:
    "无需登录的免费公众号排版工具。粘贴文章、选择版式、实时预览，一键复制到微信公众号后台。",
  keywords: ["公众号排版", "微信编辑器", "免费排版工具", "公众号编辑器"],
};

export const viewport: Viewport = {
  themeColor: "#1f211d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

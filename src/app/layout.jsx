import "./globals.css";

export default function RootLayout({ children, params }) {
  const locale = params?.locale || "en";
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}

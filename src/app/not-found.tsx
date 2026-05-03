import Link from "next/link";

export default function NotFound() {
  return (
    <html><body><div style={{ padding: 80, fontFamily: "system-ui", textAlign: "center" }}>
      <h1 style={{ fontSize: 64, margin: 0 }}>404</h1>
      <p>This page drifted out to sea.</p>
      <Link href="/" style={{ color: "#0e7490" }}>Back home</Link>
    </div></body></html>
  );
}

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import GenerateSIP from "@/components/pdf/GenerateSIP";
import { dataPeminjaman } from "@/data/dataPeminjaman";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

export default function Page() {
  const [isClient, setIsClient] = useState(false);
  const peminjaman = dataPeminjaman[1];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <GenerateSIP data={peminjaman} />
      </PDFViewer>
    </div>
  );
}

"use client";

import { PDFViewer } from "@react-pdf/renderer";
import GenerateBA from "@/components/GenerateBA";
import { dataPeminjaman } from "@/data/dataPeminjaman";

export default function Page() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <GenerateBA data={dataPeminjaman[1]} />
      </PDFViewer>
    </div>
  );
}

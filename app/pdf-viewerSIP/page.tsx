"use client";

import { PDFViewer } from "@react-pdf/renderer";
import GenerateSIP from "@/components/pdf/GenerateSIP";
import { dataPeminjaman } from "@/data/dataPeminjaman";

export default function Page() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <GenerateSIP data={dataPeminjaman[1]} />
      </PDFViewer>
    </div>
  );
}

"use client";

import { PDFViewer } from "@react-pdf/renderer";
import GenerateBA from "./GenerateBA";
import GenerateSIP from "./GenerateSIP";
import { Peminjaman } from "@/data/dataPeminjaman";

interface Props {
  data: Peminjaman;
  type: "BA" | "SIP";
}

export default function PDFViewerWrapper({ data, type }: Props) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        {type === "BA" ? (
          <GenerateBA data={data} />
        ) : (
          <GenerateSIP data={data} />
        )}
      </PDFViewer>
    </div>
  );
}

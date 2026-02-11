"use client";

import dynamic from "next/dynamic";
import { dataPeminjaman } from "@/data/dataPeminjaman";

const PDFViewerWrapper = dynamic(
  () => import("@/components/pdf/PDFViewerWrapper"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <p>Loading PDF Viewer...</p>
      </div>
    )
  }
);

export default function Page() {
  return <PDFViewerWrapper data={dataPeminjaman[1]} type="SIP" />;
}

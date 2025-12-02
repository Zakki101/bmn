  "use client";

  import { PDFViewer } from "@react-pdf/renderer";
  import GenerateSIP from "@/components/pdf/GenerateSIP";
  import { dataPeminjaman } from "@/data/dataPeminjaman";
  import { dataBMN } from "@/data/dataBMN"; 

  export default function Page() {
    const peminjaman = dataPeminjaman[1];
     const bmn = dataBMN[1];     

    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <GenerateSIP data={peminjaman} />
        </PDFViewer>
      </div>
    );
  }

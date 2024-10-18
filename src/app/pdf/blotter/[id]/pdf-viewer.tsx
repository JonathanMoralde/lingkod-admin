"use client";

import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import BlotterReportPdf from "@/components/lingkod/blotter-report-pdf";
import { BarangayOfficial } from "@/utils/firebaseUtils";
import { BlotterDocDetails } from "./page";

type Props = {
  barangayCaptain: BarangayOfficial;
  barangaySecretary: BarangayOfficial;
  data: BlotterDocDetails;
};

const BlotterPdfView = (props: Props) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <BlotterReportPdf
        data={props.data}
        barangayCaptain={props.barangayCaptain}
        barangaySecretary={props.barangaySecretary}
      />
    </PDFViewer>
  );
};

export default BlotterPdfView;

"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { BarangayOfficial } from "@/app/pdf/actions";
import BlotterReportPdf from "@/components/lingkod/blotter-report-pdf";

type Props = {
  barangayCaptain: BarangayOfficial;
  barangaySecretary: BarangayOfficial;
};

const BlotterPdfView = (props: Props) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <BlotterReportPdf
        barangayCaptain={props.barangayCaptain}
        barangaySecretary={props.barangaySecretary}
      />
    </PDFViewer>
  );
};

export default BlotterPdfView;

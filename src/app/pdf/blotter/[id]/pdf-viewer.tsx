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
import { BarangayOfficial, BlotterDocDetails } from "@/app/pdf/actions";
import BlotterReportPdf from "@/components/lingkod/blotter-report-pdf";

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

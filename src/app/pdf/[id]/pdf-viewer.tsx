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
import {
  BrgyClearance,
  BrgyIndigency,
  BusinessPermit,
  DocDetails,
  EventPermit,
} from "./actions";
import BarangayClearancePDF from "@/components/lingkod/barangay-clearance-pdf";
import BarangayIndigency from "@/components/lingkod/barangay-indigency-pdf";
import BusinessPermitPdf from "@/components/lingkod/business-permit-pdf";
import EventPermitPdf from "@/components/lingkod/event-permit-pdf";
import BlotterReportPdf from "@/components/lingkod/blotter-report-pdf";
import { BarangayOfficial } from "@/app/pdf/[id]/actions";

type Props = {
  data: DocDetails;
  barangayCaptain: BarangayOfficial;
  barangaySecretary: BarangayOfficial;
};

const PdfView = (props: Props) => {
  let PdfComponent;

  // Dynamically set the PDF component based on the type
  switch (props.data.type) {
    case "Barangay Clearance":
      PdfComponent = BarangayClearancePDF;
      break;
    case "Barangay Indigency":
      PdfComponent = BarangayIndigency;
      break;
    case "Business Permit":
      PdfComponent = BusinessPermitPdf;
      break;
    case "Event Permit":
      PdfComponent = EventPermitPdf;
      break;
      break;
    default:
      return <div>Unknown Document Type</div>;
  }
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <PdfComponent
        data={props.data}
        barangayCaptain={props.barangayCaptain}
        barangaySecretary={props.barangaySecretary}
      />
    </PDFViewer>
  );
};

export default PdfView;

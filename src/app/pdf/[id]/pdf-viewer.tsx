"use client";

import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import BarangayClearancePDF from "@/components/lingkod/barangay-clearance-pdf";
import BarangayIndigency from "@/components/lingkod/barangay-indigency-pdf";
import BusinessPermitPdf from "@/components/lingkod/business-permit-pdf";
import EventPermitPdf from "@/components/lingkod/event-permit-pdf";
import { BarangayOfficial } from "@/utils/firebaseUtils";
import { DocDetails } from "./page";

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

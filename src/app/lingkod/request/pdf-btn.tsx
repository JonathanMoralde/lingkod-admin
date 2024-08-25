"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BarangayClearancePDF from "@/components/lingkod/barangay-clearance-pdf";
import BarangayIndigency from "@/components/lingkod/barangay-indigency-pdf";
import BusinessPermitPdf from "@/components/lingkod/business-permit-pdf";
import EventPermitPdf from "@/components/lingkod/event-permit-pdf";
import BlotterReportPdf from "@/components/lingkod/blotter-report-pdf";

type Props = {};

const PdfBtn = (props: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <PDFDownloadLink
        document={<BarangayClearancePDF />}
        fileName="barangay_clearance.pdf"
      >
        {({ loading }) =>
          loading ? "Loading document..." : "Download Barangay Clearance"
        }
      </PDFDownloadLink>
      <PDFDownloadLink
        document={<BarangayIndigency />}
        fileName="BarangayIndigency.pdf"
      >
        {({ loading }) =>
          loading ? "Loading document..." : "Download BarangayIndigency"
        }
      </PDFDownloadLink>
      <PDFDownloadLink
        document={<BusinessPermitPdf />}
        fileName="BusinessPermitPdf.pdf"
      >
        {({ loading }) =>
          loading ? "Loading document..." : "Download BusinessPermitPdf"
        }
      </PDFDownloadLink>
      <PDFDownloadLink
        document={<EventPermitPdf />}
        fileName="EventPermitPdf.pdf"
      >
        {({ loading }) =>
          loading ? "Loading document..." : "Download EventPermitPdf"
        }
      </PDFDownloadLink>
      <PDFDownloadLink
        document={<BlotterReportPdf />}
        fileName="BlotterReportPdf.pdf"
      >
        {({ loading }) =>
          loading ? "Loading document..." : "Download BlotterReportPdf"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default PdfBtn;

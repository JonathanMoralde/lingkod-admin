"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BarangayClearancePDF from "@/components/lingkod/barangay-clearance-pdf";

type Props = {};

const PdfBtn = (props: Props) => {
  return (
    <PDFDownloadLink
      document={<BarangayClearancePDF />}
      fileName="barangay_clearance.pdf"
    >
      {({ loading }) =>
        loading ? "Loading document..." : "Download Barangay Clearance"
      }
    </PDFDownloadLink>
  );
};

export default PdfBtn;

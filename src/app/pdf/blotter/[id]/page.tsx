import React from "react";
import { barangayOfficial, BarangayOfficial } from "../../actions";
import BlotterPdfView from "./pdf-viewer";

type Props = { params: { id: string } };

const PdfPreview = async (props: Props) => {
  // const docDetails: DocDetails = await getDocRequestDetails(props.params.id);
  const barangayCaptain: BarangayOfficial = await barangayOfficial("Captain");
  const barangaySecretary: BarangayOfficial = await barangayOfficial(
    "Secretary"
  );

  return (
    <main className="h-screen w-full">
      <BlotterPdfView
        barangayCaptain={barangayCaptain}
        barangaySecretary={barangaySecretary}
      />
    </main>
  );
};

export default PdfPreview;

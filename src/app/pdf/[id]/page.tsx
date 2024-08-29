import React from "react";
import { DocDetails, getDocRequestDetails } from "./actions";
import PdfView from "./pdf-viewer";
import { barangayOfficial, BarangayOfficial } from "./actions";

type Props = { params: { id: string } };

const PdfPreview = async (props: Props) => {
  const docDetails: DocDetails = await getDocRequestDetails(props.params.id);
  const barangayCaptain: BarangayOfficial = await barangayOfficial("Captain");
  const barangaySecretary: BarangayOfficial = await barangayOfficial(
    "Secretary"
  );

  return (
    <main className="h-screen w-full">
      <PdfView
        data={docDetails}
        barangayCaptain={barangayCaptain}
        barangaySecretary={barangaySecretary}
      />
    </main>
  );
};

export default PdfPreview;

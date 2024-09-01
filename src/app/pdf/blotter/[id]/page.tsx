import React from "react";
import {
  barangayOfficial,
  BarangayOfficial,
  BlotterDocDetails,
  getDocBlotterDetails,
} from "../../actions";
import BlotterPdfView from "./pdf-viewer";

type Props = { params: { id: string } };

const PdfPreview = async (props: Props) => {
  // const docDetails: DocDetails = await getDocRequestDetails(props.params.id);
  const barangayCaptain: BarangayOfficial = await barangayOfficial("Captain");
  const barangaySecretary: BarangayOfficial = await barangayOfficial(
    "Secretary"
  );
  const blotterDetails: BlotterDocDetails = await getDocBlotterDetails(
    props.params.id
  );

  return (
    <main className="h-screen w-full">
      <BlotterPdfView
        barangayCaptain={barangayCaptain}
        barangaySecretary={barangaySecretary}
        data={blotterDetails}
      />
    </main>
  );
};

export default PdfPreview;

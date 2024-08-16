import React from "react";
type Props = {};

const ResidentDetail = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div>
      <p>Dynamic ID: {id}</p>
    </div>
  );
};

export default ResidentDetail;

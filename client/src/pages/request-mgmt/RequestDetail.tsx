import React from "react";
import { useParams } from "react-router-dom";

const RequestDetail = () => {
  const { requestId } = useParams() as { requestId: string };

  return (
    <div>
      <h1>Request ID: {requestId}</h1>
    </div>
  );
};

export default RequestDetail;

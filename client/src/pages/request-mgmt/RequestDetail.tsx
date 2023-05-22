import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import * as ApiErrorHandler from "../../apis/apiErrorHandler";
import * as Apis from "../../apis/apis";

const RequestDetail = ({ requestId }: { requestId: number }) => {
  useEffect(() => {
    fetchData(requestId);
  }, [requestId]);

  const fetchData = async (requestId: number) => {
    try {
      const { data } = await Apis.getMemberRequestDetail(Number(requestId));
      console.log(data);
    } catch (e) {
      ApiErrorHandler.all(e);
    }
  };

  return (
    <div>
      <h1>Request ID: {requestId}</h1>
    </div>
  );
};

export default RequestDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as ApiErrorHandler from "../../apis/apiErrorHandler";
import * as Apis from "../../apis/apis";
import dayjs from "dayjs";
// Layout
// https://tailwindui.com/components/application-ui/page-examples/detail-screens?include=archived#component-6d449ab606e4b9f99757efd317b768de

interface DetailRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  vacation: {
    id: number;
    type: string;
    leftDays: number;
    totalDays: number;
  };
  useDate: string;
  status: string;
  memo: string | null;
  createdAt: string;
  approvedInfo: null | {
    approvedAt: string;
    approvedMemo: string | null;
    email: string;
    id: number;
    name: string;
  };
  canceledInfo: null | {
    canceledAt: string;
    canceledMemo: string | null;
    email: string;
    id: number;
    name: string;
  };
  refusedInfo: null | {
    refusedAt: string;
    refusedMemo: string | null;
    email: string;
    id: number;
    name: string;
  };
}

interface as {
  approvedInfo: null | {
    approvedAt: string;
    approvedMemo: string | null;
    email: string;
    id: number;
    name: string;
  };
  canceledInfo: null | {
    canceledAt: string;
    canceledMemo: string | null;
    email: string;
    id: number;
    name: string;
  };
  refusedInfo: null | {
    refusedAt: string;
    refusedMemo: string | null;
    email: string;
    id: number;
    name: string;
  };
}

interface Temp {
  type: string;
  at: dayjs.Dayjs;
}

const RequestDetail = ({ requestId }: { requestId: number }) => {
  const [detailRequest, setDetailRequest] = useState<DetailRequest | null>(
    null
  );

  useEffect(() => {
    fetchData(requestId);
  }, [requestId]);

  const fetchData = async (requestId: number) => {
    try {
      const { data } = await Apis.getMemberRequestDetail(Number(requestId));
      console.log(data);
      setDetailRequest(data);
    } catch (e) {
      ApiErrorHandler.all(e);
    }
  };

  const renderHistory = () => {
    // 3개의 상태 객체의 시간을 보고 내림차순으로 정리한다.

    const history = [];
    if (detailRequest?.approvedInfo) {
      const temp: Temp = {
        type: "approvedInfo",
        at: dayjs(detailRequest?.approvedInfo?.approvedAt),
      };

      history.push(temp);
    }
    if (detailRequest?.canceledInfo) {
      const temp: Temp = {
        type: "canceledInfo",
        at: dayjs(detailRequest?.canceledInfo?.canceledAt),
      };

      history.push(temp);
    }
    if (detailRequest?.refusedInfo) {
      const temp: Temp = {
        type: "refusedInfo",
        at: dayjs(detailRequest?.refusedInfo?.refusedAt),
      };
      history.push(temp);
    }
    const newHistory = [...history].sort((a, b) => {
      if (a.at > b.at) {
        return 1;
      }
      if (a.at < b.at) {
        return -1;
      }
      return 0;
    });

    return (
      <>
        {newHistory.map((item) => {
          return (
            <p key={item.type}>
              {item.type} : {item.at.format("YYYY-MM-DD HH:mm:ss")}
            </p>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <h1>Request ID: {requestId}</h1>
      {detailRequest && (
        <>
          <p>
            {detailRequest.userName} / {detailRequest.userEmail}
          </p>
          <p>
            {detailRequest.useDate} / {detailRequest.status}
          </p>
          <div>
            <p>History</p>
            <p>사용신청 : {detailRequest.createdAt}</p>
            {renderHistory()}
          </div>
        </>
      )}
    </div>
  );
};
export default RequestDetail;

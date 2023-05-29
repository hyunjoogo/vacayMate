import React, { useEffect, useState } from "react";
import * as ApiErrorHandler from "../../apis/apiErrorHandler";
import * as Apis from "../../apis/apis";
import dayjs from "dayjs";
import { timeFromNow } from "../../utils/DateUtil";
import useModal from "../../hooks/useModal";
import { createPortal } from "react-dom";
import SingleModal from "../../components/modal/SingleModal";
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
  approvedInfo: null | ApprovedInfo;
  canceledInfo: null | CanceledInfo;
  refusedInfo: null | RefusedInfo;
}

type CanceledInfo = {
  canceledAt: string;
  canceledMemo: string | null;
  email: string;
  id: number;
  name: string;
};

type ApprovedInfo = {
  approvedAt: string;
  approvedMemo: string | null;
  email: string;
  id: number;
  name: string;
};

type RefusedInfo = {
  refusedAt: string;
  refusedMemo: string | null;
  email: string;
  id: number;
  name: string;
};

interface Temp {
  type: string;
  at: dayjs.Dayjs;
  info: CanceledInfo | ApprovedInfo | RefusedInfo;
}

const RequestDetail = ({
  requestId,
  fetchRequestList,
  nowPage,
}: {
  requestId: number;
  fetchRequestList: (nowPage: number) => Promise<void>;
  nowPage: number;
}) => {
  const { showModal, openModal, closeModal } = useModal();
  const [modalComponent, setModalComponent] = useState(<></>);
  const [detailRequest, setDetailRequest] = useState<DetailRequest | null>(
    null
  );

  useEffect(() => {
    fetchRequestDetail(requestId);
  }, [requestId]);

  const fetchRequestDetail = async (requestId: number) => {
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
        info: { ...detailRequest?.approvedInfo },
      };

      history.push(temp);
    }
    if (detailRequest?.canceledInfo) {
      const temp: Temp = {
        type: "canceledInfo",
        at: dayjs(detailRequest?.canceledInfo?.canceledAt),
        info: { ...detailRequest?.canceledInfo },
      };

      history.push(temp);
    }
    if (detailRequest?.refusedInfo) {
      const temp: Temp = {
        type: "refusedInfo",
        at: dayjs(detailRequest?.refusedInfo?.refusedAt),
        info: { ...detailRequest?.refusedInfo },
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
              <br />
              {item.info.name}님이 취소/거절/승인을 하셨습니다.{" "}
              {timeFromNow(item.at)}
              {/* 메모가 있으면 보이게 해야함 */}
            </p>
          );
        })}
      </>
    );
  };

  const onApprove = async () => {
    if (detailRequest?.status !== "pending") {
      alert("pending 상태의 요청만 가능합니다.");
      return;
    }
    window.confirm("Approve!");

    try {
      const { data } = await Apis.postApproveRequest(requestId);
      console.log(data);
      await fetchRequestDetail(requestId);
      await fetchRequestList(nowPage);
    } catch (e) {
      ApiErrorHandler.all(e);
    }
  };
  const onRefuse = async () => {
    if (detailRequest?.status !== "pending") {
      alert("pending 상태의 요청만 가능합니다.");
      return;
    }

    window.confirm("Refused!");

    try {
      const { data } = await Apis.postRefuseRequest(requestId);
      console.log(data);
      await fetchRequestDetail(requestId);
      await fetchRequestList(nowPage);
    } catch (e) {
      ApiErrorHandler.all(e);
    }
  };

  const handleClose = (result: string) => {
    console.log(result);
    closeModal();
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
          <p>
            {detailRequest.vacation.type} / {detailRequest.vacation.leftDays} /{" "}
            {detailRequest.vacation.totalDays}
          </p>
          <div>
            <p>History</p>
            <p>사용신청 : {detailRequest.createdAt}</p>
            {renderHistory()}
          </div>
          <div>
            <button onClick={onApprove}>Approve</button>
            <button onClick={onRefuse}>Refuse</button>
          </div>
        </>
      )}
      {showModal && createPortal(modalComponent, document.body)}
    </div>
  );
};
export default RequestDetail;

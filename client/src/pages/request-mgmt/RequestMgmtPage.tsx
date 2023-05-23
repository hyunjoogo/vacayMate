import React, { useEffect, useState } from "react";
import * as Apis from "../../apis/apis";
import * as ApiErrorHandler from "../../apis/apiErrorHandler";
import RequestDetail from "./RequestDetail";

interface memberRequest {
  id: number;
  user_id: number;
  vacation_id: number;
  use_date: string;
  using_type: string;
  using_day: number;
  status: string;
  memo: string | null;
  created_at: string;
  approved_at: string | null;
  approved_by: number | null;
  approved_memo: string | null;
  refused_at: number | null;
  refused_by: string | null;
  refused_memo: string | null;
  canceled_at: string | null;
  canceled_by: number | null;
  canceled_memo: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    position: string | null;
    department: string | null;
    role: string;
    enter_date: string | null;
    is_leave: boolean;
    user_img: string;
    created_at: string;
  };
}

interface Page {
  nowPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

interface SelectedValues {
  name: string;
  startDate: string;
  endDate: string;
  status: "" | "pending" | "canceled" | "approved" | "refused";
  usingType: "" | "all" | "morning" | "afternoon" | "out";
}

const RequestMgmtPage = () => {
  const [memberRequestList, setMemberRequestList] = useState<memberRequest[]>(
    []
  );
  const [page, setPage] = useState<Page>({
    nowPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
  });
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    name: "",
    startDate: "",
    endDate: "",
    status: "",
    usingType: "",
  });
  const [requestDetailId, setRequestDetailId] = useState<number | null>(null);
  const [detail, setDetail] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (nowPage: number = 0) => {
    const params: { [key: string]: string } = {
      name: selectedValues.name,
      status: selectedValues.status,
      usingType: selectedValues.usingType,
      startDate: selectedValues.startDate,
      endDate: selectedValues.endDate,
    };
    const paramsArray = Object.keys(params);

    if (paramsArray.length !== 0) {
      paramsArray.forEach((key) => {
        if (params[key] === "") {
          delete params[key];
        }
      });
    }

    try {
      const { data } = await Apis.getMemberRequests(params, nowPage);
      setMemberRequestList(data.data);
      setPage(data.page);
    } catch (e) {
      ApiErrorHandler.all(e);
    }
  };

  const updateSearchParameters = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValues({ ...selectedValues, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage((prev) => ({ ...prev, nowPage: 0 }));
    fetchData(0);
  };

  const handleChangePage = (nowPage: number) => {
    setPage((prev) => {
      return {
        ...prev,
        nowPage,
      };
    });
    fetchData(nowPage);
  };

  const handleDetail = (requestId: number) => {
    setRequestDetailId(requestId);
    setDetail(true);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder={"이름"}
          name="name"
          onChange={updateSearchParameters}
        />
        <select name="status" onChange={updateSearchParameters}>
          <option value="">all</option>
          <option value="canceled">canceled</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="refused">refused</option>
        </select>
        <select name="usingType" onChange={updateSearchParameters}>
          <option value="">all</option>
          <option value="오전반차">오전반차</option>
          <option value="오후반차">오후반차</option>
          <option value="일차">일차</option>
        </select>
        <br />
        <input type="date" name="startDate" onChange={updateSearchParameters} />
        <input type="date" name="endDate" onChange={updateSearchParameters} />

        <button type="submit">search</button>
      </form>
      <hr />
      <ul>
        {memberRequestList.map((memberRequest) => {
          return (
            <li
              key={memberRequest.id}
              onClick={() => handleDetail(memberRequest.id)}
            >
              {memberRequest.id} / {memberRequest.user.name} /{" "}
              {memberRequest.user.email} / {memberRequest.use_date} /{" "}
              {memberRequest.using_type} / {memberRequest.status}
            </li>
          );
        })}
      </ul>
      <div>
        <button
          disabled={page.nowPage === 0}
          onClick={() => handleChangePage(0)}
        >
          First
        </button>
        <button
          disabled={page.nowPage === 0}
          onClick={() => handleChangePage(page.nowPage - 1)}
        >
          Previous
        </button>{" "}
        {page.nowPage + 1} / {page.totalPages}
        <button
          disabled={page.nowPage + 1 === page.totalPages}
          onClick={() => handleChangePage(page.nowPage + 1)}
        >
          Next
        </button>
        <button
          disabled={page.nowPage + 1 === page.totalPages}
          onClick={() => handleChangePage(page.totalPages - 1)}
        >
          Last
        </button>
      </div>
      {detail && (
        <RequestDetail
          requestId={requestDetailId!}
          fetchRequestList={fetchData}
          nowPage={page.nowPage}
        />
      )}
    </div>
  );
};

export default RequestMgmtPage;

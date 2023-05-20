import React, { useEffect, useState } from "react";
import * as Apis from "../../apis/apis";
import * as ApiErrorHandler from "../../apis/apiErrorHandler";

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

interface MemberRequestList {
  data: memberRequest[];
  page: {
    nowPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

interface SelectedValues {
  name: string;
  startDate: string;
  endDate: string;
  status: "" | "canceled" | "approved" | "refused";
  usingType: "" | "all" | "morning" | "afternoon" | "out";
}

const RequestMgmtPage = () => {
  const [memberRequestList, setMemberRequestList] = useState<MemberRequestList>(
    {
      data: [],
      page: {
        nowPage: 0,
        pageSize: 0,
        totalPages: 0,
        totalCount: 0,
      },
    }
  );
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    name: "",
    startDate: "",
    endDate: "",
    status: "",
    usingType: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (params: { [key: string]: string } = {}) => {
    const paramsArray = Object.keys(params);

    if (paramsArray.length !== 0) {
      paramsArray.forEach((key) => {
        if (params[key] === "") {
          console.log(key);
          delete params[key];
        }
      });
    }

    try {
      const { data } = await Apis.getMemberRequests(params);
      console.log(data);
      setMemberRequestList(data);
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
    const params = {
      name: selectedValues.name,
      status: selectedValues.status,
      usingType: selectedValues.usingType,
      startDate: selectedValues.startDate,
      endDate: selectedValues.endDate,
    };
    fetchData(params);
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
      {memberRequestList.data.map((memberRequest) => {
        return (
          <div key={memberRequest.id}>
            {memberRequest.user.name} / {memberRequest.user.email} /{" "}
            {memberRequest.use_date} / {memberRequest.using_type} /{" "}
            {memberRequest.status}
          </div>
        );
      })}
    </div>
  );
};

export default RequestMgmtPage;

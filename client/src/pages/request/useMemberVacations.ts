// 서버의 변동이 자주 일어나는가?
// 내가 작성 중에 관리자가 휴가요청에 대한 변경을 했을 때만 변동이 생긴다.

import * as Apis from "../../apis/apis";
import { useEffect, useState } from "react";
import { MemberVacation } from "./RequestPage";

export const useMemberVacations = () => {
  const [memberVacations, setMemberVacations] = useState<MemberVacation[]>([]);

  useEffect(() => {
    const fetchMemberVacations = async () => {
      const { data } = await Apis.getMemberVacations();
      setMemberVacations(data);
    };
    fetchMemberVacations();
  }, []);

  return { memberVacations, setMemberVacations };
};

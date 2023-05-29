export interface ProcessStatusTypesUnder {
  approved_at: string | null;
  approved_by: number | null;
  approved_memo: string | null;
  refused_at: number | null;
  refused_by: string | null;
  refused_memo: string | null;
  canceled_at: string | null;
  canceled_by: number | null;
  canceled_memo: string | null;
}

export interface UserInfoDetailUnder {
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
}

export interface MemberResponseUnder extends ProcessStatusTypesUnder {
  id: number;
  user_id: number;
  vacation_id: number;
  use_date: string;
  using_type: string;
  using_day: number;
  status: string;
  memo: string | null;
  created_at: string;
  user: UserInfoDetailUnder;
}

export interface VacationsResponse {
  id: number;
  userId: number;
  type: string;
  memo: string | null;
  leftDays: number;
  totalDays: number;
  expirationDate: string;
}

export interface ProcessStatusTypes {
  approvedAt: string | null;
  approvedBy: number | null;
  approvedMemo: string | null;
  refusedAt: number | null;
  refusedBy: string | null;
  refusedMemo: string | null;
  canceledAt: string | null;
  canceledBy: number | null;
  canceledMemo: string | null;
}

export interface UserInfoDetail {
  id: number;
  name: string;
  email: string;
  position: string | null;
  department: string | null;
  role: string;
  enterDate: string | null;
  isLeave: boolean;
  userImg: string;
  createdAt: string;
}

export interface MemberResponse extends ProcessStatusTypes {
  id: number;
  userId: number;
  vacationId: number;
  useDate: string;
  usingType: string;
  usingDay: number;
  status: string;
  memo: string | null;
  createdAt: string;
  user: UserInfoDetail;
}

export interface ProcessStatusTypes {
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

export interface UserInfoDetail {
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

export interface MemberResponse extends ProcessStatusTypes {
  id: number;
  user_id: number;
  vacation_id: number;
  use_date: string;
  using_type: string;
  using_day: number;
  status: string;
  memo: string | null;
  created_at: string;
  user: UserInfoDetail;
}

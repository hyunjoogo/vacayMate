import { useState } from "react";

export interface Page {
  nowPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

const usePage = () => {
  const [page, setPage] = useState<Page>({
    nowPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
  });

  // fetch 후 page정보 set하기
  const fetchAfterSetPage = (pageInfo: Page) => {
    setPage(pageInfo);
  };

  // 페이지 이동을 수동으로 할 때
  const handlePage = (nowPage: number) => {
    setPage((prev) => {
      return {
        ...prev,
        nowPage,
      };
    });
  };

  return { page, handlePage, fetchAfterSetPage };
};

export default usePage;

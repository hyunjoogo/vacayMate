import React from "react";

interface SearchFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  updateSearchParameters: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

const SearchForm = ({ onSubmit, updateSearchParameters }: SearchFormProps) => {
  return (
    <>
      <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <div className="flex items-center gap-2.5 h-8">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="이름"
            onChange={updateSearchParameters}
          />
        </div>
        <div className="flex items-center gap-2.5 h-8">
          <label
            htmlFor="role"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue=""
            onChange={updateSearchParameters}
          >
            <option value="">all</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </div>
        <div className="flex items-center gap-2.5 h-8">
          <label
            htmlFor="isLeave"
            className="block text-sm font-medium leading-6 text-gray-900 break-keep"
          >
            퇴사여부
          </label>
          <select
            id="isLeave"
            name="isLeave"
            className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue=""
            onChange={updateSearchParameters}
          >
            <option value="">all</option>
            <option value="true">퇴사</option>
            <option value="false">재직중</option>
          </select>
        </div>
        <div className="flex align-bottom">
          <button
            type="button"
            className="min-w-[80px] rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            검색
          </button>
        </div>
      </form>
    </>
  );
};

export default SearchForm;

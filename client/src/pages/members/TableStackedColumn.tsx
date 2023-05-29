import React from "react";
import { UserInfoDetail } from "../../common/types/commonTypes";
import { Link } from "react-router-dom";

interface TableStackedColumnProps {
  tableTitle: React.ReactNode | string | null;
  items: UserInfoDetail[];
  columnHeaderSlot?: object;
  fields?: Array<any>;
  scopedSlots?: object;
}

interface Props extends TableStackedColumnProps {
  onDetail: (id: number) => void;
}

const TableStackedColumn = ({ tableTitle, items, onDetail }: Props) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">{tableTitle}</div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 sm:-mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Position
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                퇴사여부
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:cursor-pointer"
                onClick={() => onDetail(item.id)}
              >
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                  {item.name}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only">Position</dt>
                    <dd className="mt-1 truncate text-gray-700">
                      {item.position} 작을때 나옴
                    </dd>
                    <dt className="sr-only sm:hidden">Email</dt>
                    <dd className="mt-1 truncate text-gray-500 sm:hidden">
                      {item.email}
                    </dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {item.position}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {item.email}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">{item.role}</td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {String(item.is_leave)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableStackedColumn;

// https://tailwindui.com/components/application-ui/lists/tables#component-e56f750c63d4e53a24f5f0bf9fd7b52a

import React from "react";
import { VacationsResponse } from "../../../common/types/commonTypes";

const Vacations = ({
  memberVacations,
}: {
  memberVacations: VacationsResponse[];
}) => {
  return (
    <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
      {memberVacations.map((vacation) => (
        <React.Fragment key={vacation.id}>
          <div>
            <span className="text-lg text-gray-900"> {vacation.type} </span>
            <span className="text-gray-600">~ {vacation.expirationDate}</span>
          </div>
          <div className="grid grid-cols-1 divide-y divide-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900">부여 일수</span>
              <br />
              <span className="text-gray-600">{vacation.totalDays}</span>
            </div>
            <div className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900">사용 일수</span>
              <br />
              <span className="text-gray-600">
                {vacation.totalDays - vacation.leftDays}
              </span>
            </div>
            <div className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900">미사용 일수</span>
              <br />
              <span className="text-gray-600">{vacation.leftDays}</span>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Vacations;

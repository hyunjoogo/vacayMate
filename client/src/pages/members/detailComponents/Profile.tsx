import React from "react";
import { UserInfoDetail } from "../../../common/types/commonTypes";

const Profile = ({ profile }: { profile: UserInfoDetail }) => {
  return (
    <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">role</dt>
          <dd className="mt-1 text-sm text-gray-900">{profile?.role}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">enterDate</dt>
          <dd className="mt-1 text-sm text-gray-900">{profile?.enterDate}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">isLeave</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {String(profile?.isLeave)}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import useStore from '../store';
import EditProfileModal from '../components/EditProfileModal';
import FollowingModal from '../components/FollowingModal';

function getInitials(fullName) {
  const names = fullName.split(" ");

  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

  const initialsStr = initials.join("");

  return initialsStr;
}

const UserProfile = () => {
  const { user } = useStore((state) => state);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleFollowingClick = () => {
    setShowFollowingModal(true);
  };

  const handleCloseFollowingModal = () => {
    setShowFollowingModal(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="relative bg-white dark:bg-[#2f2d30] p-6 rounded-lg shadow-2xl w-80 md:w-96 lg:w-1/3 mx-4">
      <div className="flex flex-col items-center">
        <>
          {user?.user?.image ? (
            <img
              src={user?.user?.image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          ) : (
            <span className='text-white w-24 h-24 rounded-full mb-4 bg-blue-600 flex items-center justify-center'>
              {getInitials(user?.user.name)}
            </span>
          )}
        </>
        <h2 className="text-lg font-semibold dark:text-white mb-2">
          {user?.user?.name}
        </h2>
        <p
          className="text-gray-500 dark:text-gray-400 mb-4 cursor-pointer"
          onClick={handleFollowingClick}
        >
          {user?.user?.followers} following
        </p>
        <button
          onClick={handleEditClick}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Edit Profile
        </button>
      </div>
      {showEditModal && (
        <EditProfileModal onClose={handleCloseEditModal} />
      )}
      {showFollowingModal && (
        <FollowingModal onClose={handleCloseFollowingModal} followings={user?.user?.followers} />
      )}
    </div>
  );
};

export default UserProfile;

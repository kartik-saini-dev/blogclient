import React from 'react';

const FollowingModal = ({ onClose, followings }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-[#2f2d30] p-6 rounded-lg shadow-2xl w-80 max-h-[50vh] overflow-y-auto">
      {followings && followings.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold dark:text-white mb-4">Following</h2>
          <ul className="space-y-3">
            {followings.map((following, index) => (
              <li key={index} className="flex items-center gap-3">
                <img
                  src={following.image}
                  alt={following.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="dark:text-white">{following.name}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-center text-gray-500">You haven't followed anyone yet.</p>
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
        close
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default FollowingModal;

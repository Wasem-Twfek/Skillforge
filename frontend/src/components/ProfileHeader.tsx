import React, { memo } from 'react';
import { User } from '../contexts/AuthContext';

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
}

// Memoized component for displaying user profile information
const ProfileHeader: React.FC<ProfileHeaderProps> = memo(({ user, onEdit }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-blue-500 dark:text-blue-300">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          {user.bio && <p className="text-gray-600 dark:text-gray-400 mt-1">{user.bio}</p>}
        </div>
      </div>
      <button
        onClick={onEdit}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Edit Profile
      </button>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;

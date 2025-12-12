import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserCourses, CourseState } from '../hooks/useCourses';
import { Link } from 'react-router-dom';
import ProfileCourseList from '../components/ProfileCourseList';
import ProfileForm, { ProfileFormData } from '../components/ProfileForm';
import ProfileHeader from '../components/ProfileHeader';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { data: userCourses, isLoading, error } = useUserCourses();
  const [isEditing, setIsEditing] = useState(false);

  // Memoized callback to handle form submission
  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }, [updateProfile]);
  
  // Memoized callback to cancel editing
  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);
  
  // Memoized callback to start editing
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Please log in to view your profile</h1>
          <Link to="/login" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error loading profile</h1>
          <p className="text-gray-600 dark:text-gray-300">{error instanceof Error ? error.message : 'An error occurred'}</p>
        </div>
      </div>
    );
  }

  // Memoize course data to prevent unnecessary recalculations
  const {
    inProgressCourses,
    completedCourses,
    notStartedCourses,
    totalProgress
  } = useMemo(() => {
    const courseArray: CourseState[] = Array.isArray(userCourses) ? userCourses : [];
    return {
      courses: courseArray,
      inProgressCourses: courseArray.filter((course) => course.progress > 0 && course.progress < 100),
      completedCourses: courseArray.filter((course) => course.progress === 100),
      notStartedCourses: courseArray.filter((course) => course.progress === 0),
      totalProgress: courseArray.length ? 
        courseArray.reduce((acc, course) => acc + course.progress, 0) / courseArray.length : 0
    };
  }, [userCourses]);

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          {isEditing ? (
            <ProfileForm 
              user={user} 
              onSubmit={handleSubmit} 
              onCancel={handleCancel} 
            />
          ) : (
            <ProfileHeader 
              user={user} 
              onEdit={handleEdit} 
            />
          )}
          {user.bio && <p className="text-gray-700 dark:text-gray-300 mt-4">{user.bio}</p>}
        </div>

        {/* Progress Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200">Overall Progress</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{Math.round(totalProgress)}%</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 dark:text-green-200">Completed Courses</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">{completedCourses.length}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-200">In Progress</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">{inProgressCourses.length}</p>
            </div>
          </div>
        </div>

        {/* Course Lists */}
        <div className="space-y-8">
          {/* Course Lists - Using memoized components */}
          <ProfileCourseList 
            title="In Progress" 
            courses={inProgressCourses} 
            type="in-progress" 
          />

          <ProfileCourseList 
            title="Completed" 
            courses={completedCourses} 
            type="completed" 
          />

          <ProfileCourseList 
            title="Not Started" 
            courses={notStartedCourses} 
            type="not-started" 
          />

          {/* No Courses Message */}
          {(!userCourses || userCourses.length === 0) && (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">No Courses Yet</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{`Here's your profile details:`}</p>
              <Link
                to="/courses"
                className="inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
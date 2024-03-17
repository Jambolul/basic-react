/* eslint-disable react-hooks/exhaustive-deps */
import {useUserContext} from '../hooks/ContextHooks';

const Profile = () => {
  const {user} = useUserContext();

  return (
    <div className="max-w-4xl mx-auto my-10 p-5 border border-gray-200 rounded-lg shadow-lg bg-sky-50">
      <h2 className="text-2xl font-semibold text-sky-800 mb-4">Profile Page</h2>
      {user && (
        <div className="space-y-2">
          <p className="text-lg">
            <span className="font-medium">Username:</span> {user.username}
          </p>
          <p className="text-lg">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-lg">
            <span className="font-medium">Account created:</span> {new Date(user.created_at).toLocaleString('fi-FI')}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;

import {Link, Outlet} from 'react-router-dom';
import {useUserContext} from '../hooks/ContextHooks';

const Layout = () => {
  const {user, handleAutoLogin} = useUserContext();

  if (!user) {
    handleAutoLogin();
  }

  return (
    <>
    <div className="flex flex-col min-h-screen">
      <header className="bg-sky-950 text-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center py-3">
            <Link to="/" className="text-2xl font-bold hover:text-sky-300">
              AniVault
            </Link>
            <ul className="flex items-center space-x-4">
              <li>
                <Link to="/" className="hover:bg-sky-700 px-3 py-2 rounded-md font-bold">
                  Home
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/profile" className="hover:bg-sky-700 px-3 py-2 rounded-md font-bold">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/upload" className="hover:bg-sky-700 px-3 py-2 rounded-md font-bold">
                      Upload
                    </Link>
                  </li>
                  <li>
                    <Link to="/logout" className="hover:bg-sky-700 px-3 py-2 rounded-md font-bold">
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="hover:bg-sky-700 px-3 py-2 rounded-md font-bold">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main className="py-6 sm:py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-sky-950 text-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p>Everything is copyrighted, if you copy we come after you</p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Layout;

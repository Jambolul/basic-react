import { Link, Outlet } from 'react-router-dom'

const Layout = () => {

  return (
    <>
    <header>
      <h1>My app</h1>
      <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/users">Users</Link></li>
          </ul>
        </nav>
      </header>
    <main>
      <Outlet />
    </main>
    <footer>
      <p>Copyright 2024 - NN</p>
      </footer>
    </>
  )

}

export default Layout

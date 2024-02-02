//import { useState } from "react"
import Home from "./views/Home"
import Profile from "./views/Profile"
import Single from "./views/Single"
import Upload from "./views/Upload"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from "./views/Layout"


const App = () => {

  return (
    <Router>
      <Routes>
        <Route element={<Layout/>} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/single" element={<Single />} />
      </Routes>
    </Router>
  )
}

export default App

import SignIn from "./components/SignIn"
import CreateUser from "./components/CreateUser"
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from "./components/Dashboard"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createUser" element={<CreateUser />} />
      </Routes>
    </BrowserRouter>
    </>
  )

}

export default App

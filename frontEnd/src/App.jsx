import SignIn from "./components/SignIn"
import CreateUser from "./components/CreateUser"
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/createUser" element={<CreateUser />} />
      </Routes>
    </BrowserRouter>
    </>
  )

}

export default App

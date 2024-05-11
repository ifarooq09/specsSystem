import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from "./components/pages/Dashboard"
import SignIn from './components/SignIn'
import CreateUser from './components/pages/CreateUser'
import Error from "./components/Error"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

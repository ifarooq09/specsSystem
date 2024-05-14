import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dasboard from './components/pages/Dasboard';
import SignIn from './components/SignIn';
import CreateUser from './components/pages/CreateUser';
import Error from "./components/Error";
import AllDirectorates from './components/pages/AllDirectorates';
import AllCategories from './components/pages/AllCategories';
import AllSpecifications from './components/pages/AllSpecifications';
import AddDirectorate from './components/pages/AddDirectorate';
import DirectorateLayout from './components/layout/DirectorateLayout';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/dashboard" element={<Dasboard />} />
          <Route path="/createUser" element={<CreateUser />} />
          <Route path="/directorates" element={<DirectorateLayout />} >
            <Route index element={<AllDirectorates />} />
            <Route path="addDirectorate" element={<AddDirectorate />} />
          </Route>
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/specifications" element={<AllSpecifications />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

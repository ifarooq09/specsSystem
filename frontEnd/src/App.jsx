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
import AllUsers from './components/pages/AllUsers';
import UserLayout from './components/layout/UserLayout';
import CategoryLayout from './components/layout/CategoryLayout';
import AddCategory from './components/pages/AddCategory';
import SpecificationLayout from './components/layout/SpecificationLayout';
import AddSpecification from './components/pages/AddSpecification';
import SpecDetails from './components/pages/SpecDetails';
import Profile from './components/pages/Profile';
import Reports from './components/pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dasboard />} />
        <Route path="/users" element={<UserLayout />}>
          <Route index element={<AllUsers />} />
          <Route path="createUser" element={<CreateUser />} />
        </Route>
        <Route path="/directorates" element={<DirectorateLayout />} >
          <Route index element={<AllDirectorates />} />
          <Route path="addDirectorate" element={<AddDirectorate />} />
        </Route>
        <Route path="/categories" element={<CategoryLayout />} >
          <Route index element={<AllCategories />} />
          <Route path="addCategory" element={<AddCategory />} />
        </Route>
        <Route path="/specifications" element={<SpecificationLayout />}>
          <Route index element={<AllSpecifications />} />
          <Route path="addSpecification" element={<AddSpecification />} />
          <Route path="addSpecification/:id" element={<AddSpecification />} />
          <Route path=":id" element={<SpecDetails />} />
        </Route>
        <Route path='/profile' element={<Profile />} />
        <Route path='/reports' element={<Reports />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './components/Home';
import Bathrooms from './components/Bathrooms';
import CreateBathroom from './components/CreateBathroom';
import NavBar from './components/NavBar';
import BathroomDetails from "./components/BathroomDetails";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EditBathroom from "./components/EditBathroom";

function App() {
  const [data, setData] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  
  const login = (user) => {
    setCurrentUser(user);
    setLoggedIn(true);
  }

  useEffect(() => {
    fetch("/check_session")
    .then((res) => {
      if (res.ok){
        res.json().then((currentUser) => login(currentUser));
      }
    });
  }, []);

  useEffect(() => {
    fetch("/bathrooms")
    .then(resp => resp.json())
    .then(data => setData(data))
  }, []) 

// updating bathrooms after creating
  const handleAddBathroom = (bathroom) => {
    let updatedBathrooms = [...data, bathroom]
    setData(updatedBathrooms)
  }

  const handleDeleteBathroom = (id) => {
    let updatedDeleteBath = data.filter((bathroom) => {
      return bathroom.id != id
    })
    setData(updatedDeleteBath)
  }
  
  const handleEditBathroom = (editBathroom) => {
    let updatedBathroom = data.map(bathroom => {
      if (bathroom.id === editBathroom.id){
        return editBathroom
      }else{
        return bathroom
      }
    })
    setData(updatedBathroom)
  }
  console.log()
  // const handleEditBathoom = () => {
  //   let updatedEditBathoom = 
  // }

  return (
    <Router>
      <NavBar setCurrentUser={setCurrentUser} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bathrooms" element={<Bathrooms data={data} handleDeleteBathroom={handleDeleteBathroom} handleEditBathroom={handleEditBathroom}/>} />
        <Route path="/signup" element={<Signup login={login}/>} />
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/add-bathroom" element={<CreateBathroom handleAddBathroom={handleAddBathroom}/>} />
        <Route path="/bathrooms/:id/edit" element={<EditBathroom />} />
        <Route path="/bathrooms/:id" element={<BathroomDetails data={data} currentUser={currentUser}/>} />
      </Routes>
    </Router>
  );
}

export default App;








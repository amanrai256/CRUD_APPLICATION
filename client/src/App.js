import React from 'react'
import "./App.css"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css.map"
// import 'bootstrap/dist/css/bootstrap.min.css';
import Headers from './components/Headers/Headers';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Edit from './pages/Edit/Edit';
import Profile from './pages/Profile/Profile';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <>
    <Headers/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/edit/:id' element={<Edit/>}/>
        <Route path='/userprofile/:id' element={<Profile/>}/>
      </Routes>
    </>
  )
}

export default App
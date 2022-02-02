import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login'
import Create_exam from './components/Create_exam';
import Profile from './components/Profile';
import Header from './components/Header';
import Register from './components/Register';
import Swal from 'sweetalert2'
import './index.css'
import './App.css'
import ExamForm from './components/ExamForm/ExamForm'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    {/* <App/> */}
    <Routes>
      <Route path="/*" element={<App />} >
        <Route path="/*" element={<Login />} ></Route>
        <Route path="/*" element={<Register />} ></Route>
      </Route>
      <Route path="/*" element={<Header />} >
        <Route path="/*" element={<Create_exam />} ></Route>
        <Route path="/*" element={<Profile />} ></Route>
      </Route>
      <Route path="/ExamForm/:exam_id" element={<ExamForm />} ></Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

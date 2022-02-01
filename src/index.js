import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Swal from 'sweetalert2'
import './index.css'
import './App.css'
import ExamForm from './components/ExamForm/ExamForm'
import { BrowserRouter,Route,Routes,Link } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
  {/* <App/> */}
    <Routes>
    <Route path="/" element={<App />} ></Route>
    <Route path="/ExamForm" element={<ExamForm />} ></Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

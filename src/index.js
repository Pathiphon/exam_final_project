import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login'
import Create_exam from './components/Create_exam';
import Profile from './components/Profile';
import Header from './components/Header';
import Register from './components/Register';
import Reply from './components/Reply/Reply_Exam';
import Manage_Reply from './components/Reply/Manage_Reply';
import Manage_Reply_one from './components/Reply/Manage_Reply_one';
import Report_Exam from './components/Report/Report_Exam';
import Report_Exam_one from './components/Report/Report_Exam_one';
import './index.css'
import './App.css'
import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import thTH from 'antd/lib/locale/th_TH';
import ExamForm from './components/ExamForm/ExamForm'
import ExamForm_Finish from './components/ExamForm/ExamForm_Finish'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

ReactDOM.render(
  <ConfigProvider locale={thTH}>
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
          <Route path="/*" element={<Reply />} ></Route>
          <Route path="/*" element={<Report_Exam />} ></Route>
        </Route>
        <Route path="/:exam_id/Manage_Reply" element={<Manage_Reply />} ></Route>
        <Route path="/:exam_id/Manage_Reply/:ques_id" element={<Manage_Reply_one />} ></Route>

        <Route path="/:exam_id/Report_Exam_one" element={<Report_Exam_one />} ></Route>

        <Route path="/ExamForm/:exam_id" element={<ExamForm />} ></Route>
        <Route path="/ExamForm_Finish" element={<ExamForm_Finish />} ></Route>

      </Routes>
    </BrowserRouter>
  </ConfigProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

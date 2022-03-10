import Register from './components/Register'
import Header from './components/Header';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import scit_logo from './img/scit_logo.png'
import 'bulma/css/bulma.min.css';
import './App.css'
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline, Grid } from '@mui/material';
import index_img from "./img/index.png";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const App = () => {
  const [token] = useState(localStorage.getItem("awesomeLeadsToken"))
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token)
      navigate('/')
  }, [])

  return (
    <div >
      {!token ? (
        <>
          <Toolbar />
   
          <Box sx={{ flexGrow: 1 }}>
            <CssBaseline />
            <AppBar style={{ background: 'white' }}>
              <Toolbar>
                <Link to="/">
                  <Typography variant="h6" component="div" style={{ color: 'black' }}>
                    ระบบตรวจข้อสอบอัตนัย
                  </Typography>
                </Link>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                </Typography>
                {/* <Button size="large" className="mr-4">เกี่ยวกับเรา</Button> */}
                {/* <Link to="./Register">
                  <Button variant="contained" size="large" endIcon={<ArrowForwardIosIcon />} style={{ fontSize: '15px' }} sx={{
                    backgroundColor: "#000000", ':hover': {
                      bgcolor: '#000033'

                    }, borderRadius: '30px'
                  }}>
                    ลงทะเบียน
                  </Button>
                </Link> */}
                <img src={scit_logo} className="object-scale-down h-16  mx-auto items-end" alt='' />
              </Toolbar>
            </AppBar>
          </Box>

          <Container maxWidth="lg">
            <div className='p-5'>
              <div className='rounded-xl p-10' style={{ backgroundColor: "#DBDEFF" }}>
                <div className='sm:flex justify-between w-full' >
                  <div className='sm:flex-row max-w-lg my-auto'>
                    {pathname === "/" ? (
                      <>
                        <Typography variant="h3" component="div" style={{ color: 'black' }}>
                          ระบบสอบออนไลน์
                        </Typography>
                        <Typography variant="p" component="div" style={{ color: 'black' }}>
                          Find and create free gamified quizzes and interactive lessons to engage any learner.
                        </Typography>
                        <div className='sm:flex-col mt-20'>
                          <Link to="./Register" className='mx-4'>
                            <Button variant="contained" endIcon={<ArrowForwardIosIcon />} sx={{
                              backgroundColor: "#000000", ':hover': { bgcolor: '#000033' }, borderRadius: '30px'
                            }} style={{ fontSize: '18px', maxWidth: '500px', maxHeight: '150px', minWidth: '200px', minHeight: '60px' }}>
                              เริ่มต้นใช้งาน
                            </Button>
                          </Link>
                          <Link to="./Login" className='mx-4'>
                            <Button variant="outlined" className="shadow-md" color='warning' endIcon={<ExitToAppIcon />} sx={{
                              borderRadius: '30px'
                            }} style={{ fontSize: '18px', maxWidth: '500px', maxHeight: '100px', minWidth: '200px', minHeight: '60px' }}>
                              เข้าสู่ระบบ
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : pathname === "/Login" ? (
                      <> <Login /></>
                    ) :pathname === "/Register" ? (
                      <> <Register /></>
                    ):(
                      <><ForgotPassword/></>
                    )}
                  </div>
                  <div className='flex h-96 w-full sm:w-3/6 items-end'>
                    <img src={index_img} className="object-scale-down h-5/6 w-5/6 mx-auto items-end" alt='' />
                  </div>
                </div>
              </div>
            </div>
          </Container>
          <footer className='text-center bg-gray-200 py-3 mt-5'>
            <p className='mx-auto text-base my-auto'>Copyright © 2021 SCIT | สำนักวิชาคอมพิวเตอร์และเทคโนโลยีสารสนเทศ</p>
          </footer>
        </>
      ) : (
        <Header />
      )}


    </div>

  );
}

export default App;

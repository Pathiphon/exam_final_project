import Register from './components/Register'
import Header from './components/Header';
import Login from './components/Login'
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
                <Button size="large" className="mr-4">เกี่ยวกับเรา</Button>
                <Link to="./Register">
                  <Button variant="contained" size="large" endIcon={<ArrowForwardIosIcon />} style={{ fontSize: '15px' }} sx={{
                    backgroundColor: "#000000", ':hover': {
                      bgcolor: '#000033'

                    }, borderRadius: '30px'
                  }}>
                    ลงทะเบียน
                  </Button>
                </Link>
              </Toolbar>

            </AppBar>
          </Box>

          <Container maxWidth="lg">
            <div sx={{ width: '100%' }} style={{ backgroundColor: "#DBDEFF", borderRadius: '10px' }}>

              <Grid container spacing={2} sx={{ padding: '70px' }} >
                {pathname === "/" ? (
                  <Grid item xs={6} md={8}>
                    <Grid container spacing={1}>

                      <Grid item xs={6} md={8}>
                        <Typography variant="h3" component="div" style={{ color: 'black' }}>
                          ระบบสอบออนไลน์
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={8}>
                        <Typography variant="p" component="div" style={{ color: 'black' }}>
                          Find and create free gamified quizzes and interactive lessons to engage any learner.
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={8} sx={{ marginTop: '100px' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Link to="./Register">
                              <Button variant="contained" endIcon={<ArrowForwardIosIcon />} sx={{
                                backgroundColor: "#000000", ':hover': { bgcolor: '#000033' }, borderRadius: '30px'
                              }} style={{ fontSize: '18px', maxWidth: '500px', maxHeight: '150px', minWidth: '200px', minHeight: '60px' }}>
                                เริ่มต้นใช้งาน
                              </Button>
                            </Link>
                          </Grid>

                          <Grid item xs={6}>
                            <Link to="./Login">
                              <Button variant="outlined" color='warning' endIcon={<ExitToAppIcon />} sx={{
                                borderRadius: '30px'
                              }} style={{ fontSize: '18px', maxWidth: '500px', maxHeight: '100px', minWidth: '200px', minHeight: '60px' }}>
                                เข้าสู่ระบบ
                              </Button>
                            </Link>
                          </Grid>

                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : pathname === "/Login" ? (
                  <Grid item xs={6} md={6}  >
                    <Login />
                  </Grid>
                ) : (
                  <Grid item xs={6} md={6}  >
                    <Register />
                  </Grid>
                )}

                <Grid item xs={6} md={4}>
                  <img src={index_img} className="rounded w-100" alt='' />
                </Grid>
              </Grid>
            </div>
          </Container>

        </>
      ) : (
        <Header />
      )}


    </div>

  );
}

export default App;

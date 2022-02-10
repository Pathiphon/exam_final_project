import React, {  useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Manage_exam from "./Manage_exam";
import Create_exam from "./Create_exam";
import Profile from './Profile'
import Reply_Exam from './Reply/Reply_Exam'

import { Box, Container,Avatar } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DescriptionIcon from "@mui/icons-material/Description";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { getCurrentUser, logout } from "../services/auth.service";

const drawerWidth = 220;

const Header = () => {
  const [token] = useState(getCurrentUser());

  const [barname, setBarname] = useState("");
  const { pathname } = useLocation();

  const handleLogout = () => {
    window.location.reload();
    logout();
  }

  useEffect(() => {
    pathname_appbar()
  }, [pathname]);

  const pathname_appbar = () => {
    switch (pathname) {
      case "/":
        setBarname("จัดการข้อสอบ");
        break;
      case "/Reply":
        setBarname("ตรวจข้อสอบ");
        break;
      case "/Report":
        setBarname("รายงานผลสอบ");
        break;
        case "/Profile":
        setBarname("จัดการโปรไฟล์");
        break;
    }
  };

  return (
    <>
      <div >
        {token && (
          <Box sx={{ display: "flex" }}>
            {pathname !== "/Create_exam" ? (
              <>
                <CssBaseline />
                <AppBar
                  position="fixed"
                  sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                  }}
                  style={{ background: "white" }}
                >
                  <Toolbar>
                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      style={{ color: "black" }}
                    >
                      {barname}
                    </Typography>
                  </Toolbar>
                </AppBar>
                <Drawer
                  sx={{
                    width: 100,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                      width: drawerWidth,
                      boxSizing: "border-box",
                      backgroundColor: "#212121",
                      color: "white",
                    },
                  }}
                  variant="permanent"
                  anchor="left"
                >
                  <p className="mx-auto pt-3 text-white text-2xl">ระบบตรวจข้อสอบ</p>
                  
                  <Avatar src="/broken-image.jpg" className="mx-auto " sx={{ width: 56, height: 56 }} />
                  <p className="mx-auto pt-3 text-white text-base">
                    {token && token.user.username}
                  </p>
                  <Divider className="mt-3" />
                  <List>
                    <Link className="textDec" to="/">
                      <ListItem button>
                        <ListItemIcon>
                          <DescriptionIcon className="icon_nav" />
                        </ListItemIcon>
                        <ListItemText primary="จัดการข้อสอบ" />
                      </ListItem>
                    </Link>
                    <Link className="textDec" to="/Reply">
                      <ListItem button>
                        <ListItemIcon>
                          <FindInPageIcon className="icon_nav" />
                        </ListItemIcon>
                        <ListItemText primary="ตรวจข้อสอบ" />
                      </ListItem>
                    </Link>
                    <Link className="textDec" to="/Report">
                      <ListItem button>
                        <ListItemIcon>
                          <AnalyticsIcon className="icon_nav" />
                        </ListItemIcon>
                        <ListItemText primary="รายงานผลสอบ" />
                      </ListItem>
                    </Link>
                  </List>
                  <Divider />
                  <List>
                    <Link className="textDec" to="/Profile">
                      <ListItem button>
                        <ListItemIcon>
                          <AccountCircleIcon className="icon_nav" />
                        </ListItemIcon>
                        <ListItemText primary="จัดการโปรไฟล์" />
                      </ListItem>
                    </Link>
                    <Link className="textDec" to="/">
                      <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                          <ExitToAppIcon className="icon_nav" />
                        </ListItemIcon>
                        <ListItemText primary="ออกจากระบบ" />
                      </ListItem>
                    </Link>
                    <a className="textDec" href='/ExamForm' target="_blank" >
                      <ListItem button >
                        <ListItemIcon>
                          <ExitToAppIcon className="icon_nav" />
                        </ListItemIcon>
                        <ListItemText primary="ฟอร์มสอบ" />
                      </ListItem>
                    </a>
                  </List>
                </Drawer>
                <Toolbar />
                <Container>
                  <Box component="main" sx={{ p: 4 }}>
                  <Toolbar />
                    <Routes>
                      <Route path="/" element={<Manage_exam />} />
                      <Route path="/Profile" element={<Profile />} />
                      <Route path="/Reply" element={<Reply_Exam />} />
                    </Routes>
                  </Box>
                </Container>
              </>
            ) : (
              <div className="w-100">
                <Create_exam/>
              </div>
            )}
          </Box>
        )}
      </div>
    </>
  );
};
export default Header;

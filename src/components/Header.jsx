import React, { useContext, useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import Button from "@mui/material/Button";
import Manage_exam from "./Manage_exam";
import Create_exam from "./Create_exam";

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
import FaceIcon from "@mui/icons-material/Face";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DataUsageIcon from "@mui/icons-material/DataUsage";
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
      case "/Check_exam":
        setBarname("ตรวจข้อสอบ");
        break;
      case "/Report":
        setBarname("รายงานผลสอบ");
        break;
    }
  };

  return (
    <>
      <div>
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
                  <h4 className="mx-auto pt-3">ระบบตรวจข้อสอบ</h4>
                  <Toolbar />
                  <Avatar src="/broken-image.jpg" className="mx-auto " sx={{ width: 56, height: 56 }} />
                  <h6 className="mx-auto pt-3">
                    {token && token.user.username}
                  </h6>
                  <Divider className="mt-5" />
                  <List>
                    <Link className="textDec" to="/">
                      <ListItem button>
                        <ListItemIcon>
                          <DescriptionIcon className="icon_nav" />
                        </ListItemIcon>
                        <ListItemText primary="จัดการข้อสอบ" />
                      </ListItem>
                    </Link>
                    <Link className="textDec" to="/Check_exam">
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
                    <Routes>
                      {/* <Route path='/Create_exam' element={<Create_exam/>}/> */}
                      <Route path="/" element={<Manage_exam />} />
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

import React, { useContext, useEffect, useState, useRouteMatch } from "react";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";

import ErrorMessage from "./ErrorMessage";
import Manage_exam_full from "../img/manage_exam_full.png";
import { styled, alpha } from "@mui/material/styles";
import {
  Button,
  InputBase,
  IconButton,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Typography,
  CardContent,
  CardMedia,
  Card,
  Toolbar,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import LinearProgress from "@mui/material/LinearProgress";
import API_URL from "../config/api";

export default function Manage_exam() {
  const [exam, setExam] = useState(null);
  const [erroorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [id, setId] = useState(null);
  const [token] = useState(localStorage.getItem("awesomeLeadsToken"));

  let navigate = useNavigate();
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    color: "#000000",
    backgroundColor: "#ffffff",
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  const get_Exam = async () => {
    await API_URL.get(`api/exam/1/all`)
      .then((res) => {
        setExam(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    get_Exam();
  }, [token]);

  const handleUpdate = async (id) => {
    setId(id);
    navigate("/Create_exam", { state: { id: id } });
  };

  return (
    <div className="container ml-4">
      <Toolbar />
      <div className="flex  justify-center items-center">
        <div className="flex-auto w-70 ">
          <Search sx={{ boxShadow: 3 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="ค้นหาหัวข้อสอบ"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </div>
        <div className="flex-auto">
          <Link to="/Create_exam" >
            <button className=" text-white bg-zinc-800 hover:bg-slate-800 p-3 ml-2 font-bold  px-4 rounded-xl shadow-lg">
              <div className="flex">
                <CreateNewFolderIcon className="icon_nav mr-4" />
                <ListItemText primary="สร้างข้อสอบ" />
              </div>
            </button>
          </Link>
        </div>
      </div>
      {exam !== null ? (
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          {exam.map((exams) => (
            <Card
              sx={{ display: "flex", borderRadius: 5, mb: 2 }}
              key={exams.id}
            >
              <CardMedia
                component="img"
                sx={{ width: 150, padding: 1, borderRadius: 5 }}
                src={Manage_exam_full}
              />
              <Box
                sx={{ display: "flex", flexDirection: "column" }}
                flexGrow={1}
              >
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    component="div"
                    sx={{ display: "flex" }}
                    variant="h6"
                    className="mb-3"
                  >
                    หัวข้อสอบ : {exams.name}
                  </Typography>
                  <Box className="mb-2" sx={{ display: "flex" }}>
                    <Typography
                      component="div"
                      variant="subtitle1"
                      flexGrow={0.3}
                    >
                      จำนวนข้อ :
                    </Typography>
                    <Typography component="div" variant="subtitle1">
                      คะแนนเต็ม :
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ display: "flex" }}
                    component="div"
                    className="mb-1"
                  >
                    ระยะเวลาทำข้อสอบ :{" "}
                    {dayjs(exams.date_pre).format("DD/MM/YYYY HH:mm")} -{" "}
                    {dayjs(exams.date_post).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </CardContent>
              </Box>
              <Box
                sx={{ p: 2, flexDirection: "column" }}
                display="flex"
                alignItems="flex-end"
                flexGrow={0}
              >
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{ mb: 2 }}
                  startIcon={<EditIcon />}
                  onClick={() => handleUpdate(exams.exam_id)}
                >
                  แก้ไข
                </Button>
                <Button variant="contained" startIcon={<ShareIcon />}>
                  ส่งลิงค์ข้อสอบ
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      ) : (
        <div className="text-center m-52">
          <Divider className="w-100">
            <p className="text-black mb-4 text-2xl">ยังไม่ได้สร้างข้อสอบ</p>
            <Link to="/Create_exam">
              <button className=" text-white bg-zinc-800 hover:bg-slate-800 p-5 font-bold py-2 px-4 rounded-xl shadow-lg">
                <div className="flex">
                  <CreateNewFolderIcon className="icon_nav mr-4" />
                  <ListItemText primary="สร้างข้อสอบ" />
                </div>
              </button>
            </Link>

            {/* <LinearProgress color="inherit" /> */}
          </Divider>
        </div>
      )}
    </div>
  );
}

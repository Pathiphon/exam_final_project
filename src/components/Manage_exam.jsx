import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import ShareExam_Modal from "./ShareExam_Modal";
import NewExamModal from "./NewExamModal";
import Manage_exam_full from "../img/manage_exam_full.png";
import status_false from "../img/examfalse.png";
import {
  Button,
  ListItemText,
  Divider,
  LinearProgress,
  Stack,
  Box,
  Typography,
  CardContent,
  CardMedia,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import API_URL from "../config/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { getCurrentUser } from "../services/auth.service";
import Swal from "sweetalert2";
import Toast from "./Toast/Toast.js";

export default function Manage_exam() {
  const [exam, setExam] = useState([]);
  const [exam_id, setExam_id] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [activeModalNew, setActiveModalNew] = useState(false);
  const [activeModalExamForm, setActiveModalExamForm] = useState(false);
  const [selectExamStatus, setSelectExamStatus] = useState(2);
  const [token] = useState(getCurrentUser());
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  const handleChange = (event) => {
    setSelectExamStatus(event.target.value);
  };

  const handleModalExamForm = () => {
    setActiveModalExamForm(!activeModalExamForm);
  };

  const get_Exam = async () => {
    var exam = [];
    await API_URL.get(`api/exam/${token && token.user.id}/all`)
      .then((res) => {
        exam = res.data;
        if (selectExamStatus === 0) {
          const updateExam_data = exam.filter((data) => {
            return data.exam_status === false;
          });
          exam = updateExam_data;
        } else if (selectExamStatus === 1) {
          const updateExam_data = exam.filter((data) => {
            return data.exam_status === true;
          });
          exam = updateExam_data;
        }
        setExam(exam);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    get_Exam();
  }, [token, selectExamStatus]);

  const handleUpdate = async (id) => {
    navigate("/Create_exam", { state: { id: id } });
  };

  const handleModalShare = (exam_id) => {
    setExam_id(exam_id);
    setActiveModalExamForm(true);
  };
  const handleClickNew = async (exam_id) => {
    setExam_id(exam_id);
    setActiveModalNew(true);
  };
  const handleModalNew = async () => {
    setActiveModalNew(!activeModalNew);
    get_Exam();
    setExam_id(null);
  };

  const delete_Exam = async (id, name, ques_len) => {
    let stu_len = 0;
    await API_URL.get(`api/student/${id}`)
      .then((res) => {
        stu_len = res.data.length;
      })
      .catch((err) => {
        console.log(err);
      });
    Swal.fire({
      title: "ยืนยันที่จะลบข้อสอบ?",
      html: `<p>ข้อสอบ <strong class="text-red-600">${name}</strong> นี้<br> มีคำถาม<strong class="text-red-600"> ${ques_len} </strong>ข้อ <br>มีคำตอบของนักศึกษา<strong class="text-red-600"> ${stu_len} </strong>คน</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยันการลบข้อสอบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        API_URL.delete(`/api/exam/${id}`)
          .then(() => {
            Toast.fire({
              icon: "warning",
              title: "ลบข้อสอบเสร็จสิ้น",
            });
            get_Exam();
          })
          .catch((err) => {
            Toast.fire({
              icon: "error",
              title: "ไม่สามารถลบได้เนื่องจากมีคำตอบหรือคำถามอยู่",
            });
          });
      }
    });
  };

  return (
    <div className="container ml-4">
      <ShareExam_Modal
        active={activeModalExamForm}
        handleModalExamForm={handleModalExamForm}
        exam_id={exam_id}
      />
      {activeModalNew === true ? (
        <NewExamModal
          active={activeModalNew}
          handleModalNew={handleModalNew}
          exam_id={exam_id}
        />
      ) : (
        <></>
      )}
      <div className="p-3 bg-white rounded-lg">
        <div className="flex  justify-center items-center">
          <div className="flex-auto w-70 ">
            <div className="flex items-center  w-6/6">
              <SearchIcon className="mr-3 " />
              <input
                className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
                placeholder="ค้นหาหัวข้อสอบ"
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-auto">
            <Link to="/Create_exam">
              <button className=" text-white bg-zinc-800 hover:bg-slate-800 py-3 px-6 ml-2 font-bold rounded-xl shadow-md">
                <div className="flex">
                  <CreateNewFolderIcon className="icon_nav mr-4" />
                  <ListItemText primary="สร้างข้อสอบ" />
                </div>
              </button>
            </Link>
          </div>
          <FormControl sx={{ width: "20%" }}>
            <InputLabel id="demo-simple-select-label" className="font-semibold">
              แสดงการสอบ
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectExamStatus}
              label="สถานะการสอบ"
              onChange={handleChange}
            >
              <MenuItem value={0}>
                <Brightness1Icon className="mr-3 text-red-600" />
                ยังไม่ได้สอบ
              </MenuItem>
              <MenuItem value={1}>
                <CheckCircleIcon className="mr-3 text-green-600" />
                สอบแล้ว
              </MenuItem>
              <MenuItem value={2}>ทั้งหมด</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {exam.length !== 0 && loading === false ? (
        <>
          <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
            {exam
              .filter((exams) => {
                if (inputSearch === "") {
                  return exams;
                } else if (exams.name.includes(inputSearch)) {
                  return exams;
                }
              })
              .map((exams, index) => (
                <Card
                  sx={{ display: "flex", borderRadius: 5, mb: 2 }}
                  key={index}
                >
                  {exams.exam_status === false ? (
                    <CardMedia
                      component="img"
                      sx={{ width: 150, padding: 1, borderRadius: 5 }}
                      src={Manage_exam_full}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      sx={{ width: 150, padding: 1, borderRadius: 5 }}
                      src={status_false}
                    />
                  )}
                  <Box
                    sx={{ display: "flex", flexDirection: "column" }}
                    flexGrow={1}
                  >
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <Typography
                        sx={{ display: "flex" }}
                        variant="h6"
                        className="mb-3 max-w-md truncate max-h-8"
                      >
                        หัวข้อสอบ : {exams.name}
                      </Typography>
                      <Box className="mb-2" sx={{ display: "flex" }}>
                        <Typography
                          component="div"
                          variant="subtitle1"
                          flexGrow={0.3}
                        >
                          <p className="text-lg">
                            {" "}
                            จำนวนข้อ : {exams.question.length}
                          </p>
                        </Typography>
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ display: "flex" }}
                        component="div"
                        className="mb-1"
                      >
                        ระยะเวลาทำข้อสอบ :{" "}
                        {dayjs(exams.date_pre).format("DD/MM/YYYY HH:mm")} --{" "}
                        {dayjs(exams.date_post).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    </CardContent>
                  </Box>
                  {exams.exam_status === false ? (
                    <Box
                      sx={{ p: 2, flexDirection: "column" }}
                      display="flex"
                      alignItems="flex-end"
                      flexGrow={0}
                    >
                      <Button
                        variant="outlined"
                        className="shadow-sm"
                        color="warning"
                        sx={{ mb: 1 }}
                        startIcon={<EditIcon />}
                        onClick={() => handleUpdate(exams.exam_id)}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<ShareIcon />}
                        sx={{ mb: 1 }}
                        onClick={() => handleModalShare(exams.exam_id)}
                      >
                        ส่งลิงค์ข้อสอบ
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        className="shadow-md"
                        startIcon={<DeleteForeverIcon />}
                        onClick={() =>
                          delete_Exam(
                            exams.exam_id,
                            exams.name,
                            exams.question.length
                          )
                        }
                      >
                        ลบ
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      sx={{ p: 2, flexDirection: "column", my: "auto" }}
                      display="flex"
                      alignItems="flex-end"
                      flexGrow={0}
                    >
                      <p className="text-lg text-green-600">สอบแล้ว</p>
                      <Button
                        variant="outlined"
                        className="shadow-sm"
                        color="success"
                        sx={{ mb: 1 }}
                        startIcon={<FileCopyIcon />}
                        onClick={() => handleClickNew(exams.exam_id)}
                      >
                        <p className="text-base my-auto">ทำการสอบใหม่</p>
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        className="shadow-md"
                        startIcon={<DeleteForeverIcon />}
                        onClick={() =>
                          delete_Exam(
                            exams.exam_id,
                            exams.name,
                            exams.question.length
                          )
                        }
                      >
                        ลบ
                      </Button>
                    </Box>
                  )}
                </Card>
              ))}
          </Box>
        </>
      ) : loading === true ? (
        <div className="text-center m-32">
          <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
            <LinearProgress color="inherit" />
          </Stack>
        </div>
      ) : (
        <div className="text-center m-52">
          <Divider className="w-100">
            <p className="text-black  text-2xl">ไม่มีข้อสอบ</p>
          </Divider>
        </div>
      )}
    </div>
  );
}

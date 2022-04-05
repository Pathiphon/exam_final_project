import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Toast from "./Toast/Toast.js";
import {
  TextField,
  Card,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import Box from "@mui/material/Box";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import ErrorMessage from "./ErrorMessage";
import API_URL from "../config/api";
import TimerIcon from '@mui/icons-material/Timer';
import { getCurrentUser } from "../services/auth.service";

export default function ExamModal({
  active,
  handleModal,
  id,
  setErrorMessage,
  Id_toperent,
}) {
  const [name, setName] = useState("");
  const [errorMes, setErrorMes] = useState("");
  const [date_pre, setDate_pre] = useState("");
  const [time_pre, setTime_pre] = useState("");
  const [date_post, setDate_post] = useState("");
  const [time_post, setTime_post] = useState("");
  const [warning_time,setWarning_time] = useState(5);
  const [token] = useState(getCurrentUser());

  const cleanFormData = () => {
    setName("");
    setDate_pre("");
    setTime_pre("");
    setDate_post("");
    setTime_post("");
    setWarning_time(5);
  };
  const handleCreateExam = async (e) => {
    
    e.preventDefault();
    const date_start = date_pre + " " + time_pre;
    const date_end = date_post + " " + time_post;
    console.log(date_start,date_end);
    let date_Dif = dayjs(date_end).diff(dayjs(date_start), "m", true);
    if (date_Dif > 0 && name.length > 0) {
      await API_URL.post(`api/exam`, {
        name: name,
        date_pre: date_start,
        date_post: date_end,
        warning_time:warning_time,
        id: token.user.id,
      })
        .then((res) => {
          Id_toperent(res.data.exam_id);
          cleanFormData();
          handleModal();
          Toast.fire({
            icon: "success",
            title: "สร้างข้อสอบแล้ว",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Toast.fire({
        icon: "error",
        title: "ป้อนข้อมูลให้ถูกต้อง",
      });
    }
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    const date_start = date_pre + " " + time_pre;
    const date_end = date_post + " " + time_post;
    let date_Dif = dayjs(date_end).diff(dayjs(date_start), "m", true);
    if (date_Dif > 0 && name.length > 0) {
      await API_URL.put(`api/exam/${id}`, {
        name: name,
        date_pre: date_start,
        warning_time:warning_time,
        date_post: date_end,
      })
        .then((res) => {
          handleModal();
          Toast.fire({
            icon: "success",
            title: "แก้ไขข้อสอบแล้ว",
          });
        })
        .catch((err) => {
          setErrorMes("Something went wrong when updating Exam");
          console.log(err);
        });
    } else {
      Toast.fire({
        icon: "error",
        title: "ป้อนข้อมูลให้ถูกต้อง",
      });
    }
  };

  const get_Exam = async () => {
    await API_URL.get(`api/exam/${id}`)
      .then((res) => {
        const data = res.data;
        setName(data.name);
        setWarning_time(data.warning_time);
        setDate_pre(dayjs(data.date_pre).format("YYYY-MM-DD"));
        setDate_post(dayjs(data.date_post).format("YYYY-MM-DD"));
        setTime_pre(dayjs(data.date_pre).format("HH:mm"));
        setTime_post(dayjs(data.date_post).format("HH:mm"));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    cleanFormData();
    if (id) {
      get_Exam();
    }
  }, [id]);

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-text-white-ter">
          <h1 className="modal-card-title has-text-centered my-auto">
            {id ? "แก้ไขข้อสอบ" : "สร้างข้อสอบ"}
          </h1>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModal}
          ></button>
        </header>
        <section className="modal-card-body">
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <div className="flex flex-wrap items-center w-full mb-3">
              <div>
                <SubtitlesIcon sx={{ color: "action.active" }} />
              </div>
              <div className="w-full flex-auto md:w-1/2 px-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
                  placeholder="หัวข้อสอบ"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center w-full mb-3 ">
              <div className="flex my-auto ">
                <TimerIcon sx={{ color: "action.active" }} className="my-auto"/>
                <p className="mx-3 my-auto">แจ้งเตือนผู้สอบเมื่อเวลาเหลือ</p>
              </div>
              <div className="w-full flex md:w-1/2 px-3 my-auto">
                <input
                  value={warning_time}
                  type="number"
                  onChange={(e) => setWarning_time(e.target.value)}
                  required
                  className="my-auto appearance-none block w-3/6 bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
                  placeholder="นาที"
                />
                <p className="my-auto mx-3">นาที</p>
              </div>
            </div>
            <Card className="p-4 ">
              <h4>กำหนดเวลาสอบ</h4>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  p: 1,
                  m: 1,
                }}
              >
                <TextField
                  label="วันที่"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={date_pre||setDate_pre(dayjs().format("YYYY-MM-DD"))}
                  onChange={(e) => setDate_pre(e.target.value)}
                />
                <Box sx={{ width: 1 / 4 }}>
                  <TextField
                    label="เวลา"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={time_pre||setTime_pre(dayjs().format("HH:mm"))}
                    onChange={(e) => setTime_pre(e.target.value)}
                    required
                  />
                </Box>
              </Box>

              <Divider>
                <Chip label="ถึง" />
              </Divider>
              <div>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    p: 1,
                    m: 1,
                  }}
                >
                  <TextField
                    label="วันที่"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={date_post}
                    onChange={(e) => setDate_post(e.target.value)}
                    required
                  />
                  <Box sx={{ width: 1 / 4 }}>
                    <TextField
                      label="เวลา"
                      type="time"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={time_post}
                      onChange={(e) => setTime_post(e.target.value)}
                      required
                    />
                  </Box>
                </Box>
              </div>
            </Card>
          </Box>
        </section>

        <footer className="modal-card-foot">
          <div>{errorMes ? <ErrorMessage message={errorMes} /> : <></>}</div>
          <div className="container mx-auto text-center">
            {id ? (
              <Button
                className="mr-4"
                color="warning"
                variant="contained"
                onClick={handleUpdateExam}
                sx={{ borderRadius: "7px" }}
                style={{
                  fontSize: "18px",
                  maxWidth: "100px",
                  maxHeight: "30px",
                  minWidth: "150px",
                  minHeight: "40px",
                }}
              >
                แก้ไข
              </Button>
            ) : (
              <Button
                onClick={handleCreateExam}
                className="mr-4"
                sx={{ borderRadius: "7px" }}
                style={{
                  fontSize: "18px",
                  maxWidth: "100px",
                  maxHeight: "30px",
                  minWidth: "150px",
                  minHeight: "40px",
                }}
                variant="contained"
                color="success"
              >
                บันทึก
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              sx={{ borderRadius: "10px" }}
              onClick={handleModal}
              style={{
                fontSize: "18px",
                maxWidth: "100px",
                maxHeight: "30px",
                minWidth: "150px",
                minHeight: "40px",
              }}
            >
              ยกเลิก
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

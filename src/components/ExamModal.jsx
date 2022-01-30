import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import Toast from "./Toast/Toast.js"
import {
  TextField,
  Card,
  CardHeader,
  Grid,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import Box from "@mui/material/Box";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import ErrorMessage from "./ErrorMessage";
import API_URL from "../config/api";

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

  const cleanFormData = () => {
    setName("");
    setDate_pre("");
    setTime_pre("");
    setDate_post("");
    setTime_post("");
  };
  const handleCreateExam = async (e) => {
    e.preventDefault();
    await API_URL.post(`api/exam`, {
      name: name,
      date_pre: date_pre + " " + time_pre,
      date_post: date_post + " " + time_post,
      id: 1,
    })
      .then((res) => {
        Id_toperent(res.data.exam_id);
        cleanFormData();
        handleModal();
        Toast.fire({
          icon: 'success',
          title: 'สร้างแบบทดสอบแล้ว'
        })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    await API_URL.put(`api/exam/${id}`, {
      name: name,
      date_pre: date_pre + " " + time_pre,
      date_post: date_post + " " + time_post,
    })
      .then((res) => {
        handleModal();
      })
      .catch((err) => {
        setErrorMes("Something went wrong when updating Exam");
        console.log(err);
      });
  };

  const get_Exam = async () => {
    await API_URL.get(`api/exam/${id}`)
      .then((res) => {
        const data = res.data;
        setName(data.name);
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
    if (id) {
      get_Exam();
    }
  }, [id]);

 
  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-text-white-ter">
          <h1 className="modal-card-title has-text-centered">
            {id ? "แก้ไขแบบทดสอบ" : "สร้างแบบทดสอบ"}
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
            <Card className="p-4">
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
                  value={date_pre}
                  onChange={(e) => setDate_pre(e.target.value)}
                />
                <TextField
                  label="เวลา"
                  type="time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  value={time_pre}
                  onChange={(e) => setTime_pre(e.target.value)}
                  required
                />
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
                  <TextField
                    label="เวลา"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    value={time_post}
                    onChange={(e) => setTime_post(e.target.value)}
                    required
                  />
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

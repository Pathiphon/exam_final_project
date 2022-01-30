import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Toast from "./Toast/Toast.js"

import {
  Box,
  TextField,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Input,
  Chip,
  Button,
  FormControl,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ErrorMessage from "./ErrorMessage";
import EditIcon from "@mui/icons-material/Edit";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import API_URL from "../config/api";

export default function Table_Ans({ active, ques_id, handleModalAns }) {
  const [all_Answer, setAll_Answer] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log(answer);
    setAnswer({ id: 0, answer: "",score:"" });
    if (ques_id) {
      get_Answers();
    }
  }, [ques_id]);

  const get_Answers = async () => {
    await API_URL.get(`api/answer/${ques_id}/all`)
      .then((res) => {
        const data = res.data;
        console.log(data);
        setAll_Answer(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const get_Answer = async (ans_id) => {
    await API_URL.get(`api/answer/${ans_id}`)
      .then((res) => {
        const data = res.data;
        setAnswer(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createOrEditAnswer = async () => {
    if (answer.ans_id) {
      await API_URL.put(`api/answer/${answer.ans_id}`, {
        answer: answer.answer,
        score: answer.score,
      })
        .then((res) => {
          get_Answers();
          setAnswer({ id: 0, answer: "",score:"" });
          Toast.fire({
            icon: 'success',
            title: 'แก้ไขเฉลยเสร็จสิ้น'
          })
          return res.data;
        })
        .catch((err) => {
          
          console.log(err);
          setErrorMessage("Something went wrong when updating Exam");
        });
    } else {
      await API_URL.post(`api/answer`, {
        answer: answer.answer,
        score: answer.score,
        ques_id:ques_id
      })
        .then((res) => {
          get_Answers();
          setAnswer({ id: 0, answer: "",score:"" });
          Toast.fire({
            icon: 'success',
            title: 'เพิ่มเฉลยเสร็จสิ้น'
          })
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteAnswer = async (ans_id,answer) => {
    Swal.fire({
      title: "ยืนยันที่จะลบเฉลย?",
      text: answer,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบเฉลย",
    }).then((result) => {
      if (result.isConfirmed) {
        API_URL.delete(`/api/answer/${ans_id}`).then(() => {
          get_Answers();
          Toast.fire({
            icon: "warning",
            title: "ลบเฉลยเสร็จสิ้น",
          });
        }).catch((err)=>{
          console.log(err);
          setErrorMessage("Failed to delete Answer");
        })  
      }  
    });
  };


  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalAns}></div>
      <div className="modal-card">
        <header className="modal-card-head has-text-white-ter">
          <h1 className="modal-card-title has-text-centered">แก้ไขเฉลย</h1>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalAns}
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
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item>
                <DataUsageIcon
                  sx={{ color: "action.active", mr: 1, my: 0.5 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="คะแนน"
                  type="number"
                  value={answer ? answer.score : ""}
                  onChange={(e) =>
                    setAnswer({ ...answer, score: e.target.value })
                  }
                  required
                  variant="standard"
                  color="warning"
                  focused
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={10}>
                <Input
                  type="hidden"
                  value={answer ? answer.ans_id : ""}
                />
                <Input
                  sx={{ width: "100%" }}
                  value={answer ? answer.answer : ""}
                  onChange={(e) =>
                    setAnswer({ ...answer, answer: e.target.value })
                  }
                  placeholder="ป้อนเฉลย"
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  color="success"
                  onClick={() => createOrEditAnswer()}
                >
                  <AddCircleIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 1 }}>
              <Chip label="เฉลยทั้งหมด" />
            </Divider>
            <TableContainer>
              <Table sx={{ minWidth: 600 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>เฉลย</TableCell>
                    <TableCell align="center">คะแนน</TableCell>
                    <TableCell align="center">การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {all_Answer ? (
                    <>
                      {all_Answer.map((answers) => (
                        <TableRow
                          key={answers.ans_id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography
                              sx={{
                                textOverflow: "ellipsis",
                                width: "15rem",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {answers.answer}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">{answers.score}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="warning"
                              onClick={() => get_Answer(answers.ans_id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => deleteAnswer(answers.ans_id,answers.answer)}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </section>

        <footer className="modal-card-foot">
          <div>
            {errorMessage ? <ErrorMessage message={errorMessage} /> : <></>}
          </div>
          <Button className="Button is-info">แก้ไข</Button>

          <Button variant="outlined" color="error">
            ยกเลิก
          </Button>
        </footer>
      </div>
    </div>
  );
}

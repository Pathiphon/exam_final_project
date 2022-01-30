import React, { useEffect, useState } from "react";
import AnsModal from "./AnsModal";
import { Box, TextField, Typography, Divider, Button } from "@mui/material";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ErrorMessage from "./ErrorMessage";
import Table_Ans from "./Table_Ans";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PercentIcon from "@mui/icons-material/Percent";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import API_URL from "../config/api";
import Swal from "sweetalert2";

export default function QModal({
  active,
  handleModalQ,
  exam_id,
  ques_id,
  setErrorMessage,
}) {
  const [activeModalAns, setActiveModalAns] = useState(false);
  const [errorMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState("");
  const [, setQues_id] = useState("");
  const [persent_checking, setPersent_checking] = useState(80);

  const cleanFormData = () => {
    setQuestion("");
    setAnswer("");
    setScore("");
    setPersent_checking("");
  };

  useEffect(() => {
    cleanFormData();
    if (ques_id && exam_id) {
      get_Question();
    }
  }, [ques_id, exam_id]);

  const get_Question = async () => {
    await API_URL.get(`api/question/${ques_id}`)
      .then((res) => {
        const data = res.data;
        console.log(data);
        setPersent_checking(data.persent_checking);
        setQuestion(data.question);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    await API_URL.post(`api/question/${exam_id}`, {
      question: question,
      persent_checking: persent_checking,
      answer: answer,
      score: score,
    })
      .then((res) => {
        cleanFormData();
        Toast.fire({
          icon: "success",
          title: "สร้างคำถามแล้ว",
        });
        handleModalQ()
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    await API_URL.put(`api/question/${ques_id}`, {
      question: question,
      persent_checking: persent_checking,
    })
      .then((res) => {
        cleanFormData();
        console.log(handleModalQ());
        handleModalQ();
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Something went wrong when updating Exam");
      });
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalQ}></div>
      <div className="modal-card">
        <header className="modal-card-head has-text-white-ter">
          <h1 className="modal-card-title has-text-centered">
            {ques_id ? "แก้ไขคำถาม" : "เพิ่มคำถาม"}
          </h1>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalQ}
          ></button>
        </header>
        <section className="modal-card-body">
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" className="mr-1">
              หมายเหตุ:ป้อนเปอร์เซ็นต์การตรวจที่ต้องการตรงกับเฉลย
            </Typography>
            <TextField
              className="mr-1"
              autoComplete="off"
              label="เปอร์เซ็นต์การตรวจ"
              InputProps={{ inputProps: { min: 0, max: 500 } }}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: "25%" }}
              size="small"
              value={persent_checking}
              onChange={(e) => setPersent_checking(e.target.value)}
              required
            />
            <PercentIcon />
          </Box>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <QuestionAnswerIcon
                sx={{ flexGrow: 0, color: "action.active" }}
              />
              <TextField
                label="คำถาม"
                multiline
                maxRows={3}
                InputLabelProps={{
                  shrink: true,
                }}
                size="medium"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </Box>
            <Divider
              sx={{ m: 1, borderBottomWidth: 3, backgroundColor: "black" }}
            />
            {ques_id ? (
              <></>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "40%",
                  }}
                >
                  <DataUsageIcon color="warning" />
                  <TextField
                    color="warning"
                    focused
                    label="คะแนน"
                    InputProps={{ inputProps: { min: 0, max: 500 } }}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    required
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AssignmentTurnedInIcon
                    sx={{ flexGrow: 0, color: "action.active" }}
                  />
                  <TextField
                    label="เฉลย"
                    multiline
                    maxRows={3}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ flexGrow: 1 }}
                    size="medium"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                  />
                </Box>
              </>
            )}
          </Box>
        </section>

        <footer className="modal-card-foot">
          <div className="container mx-auto text-center">
            {ques_id ? (
              <Button
                className="mr-4"
                color="warning"
                variant="contained"
                onClick={handleUpdateQuestion}
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
                type="submit"
                className="mr-4"
                variant="contained"
                onClick={handleCreateQuestion}
                color="success"
                sx={{ borderRadius: "7px" }}
                style={{
                  fontSize: "18px",
                  maxWidth: "100px",
                  maxHeight: "30px",
                  minWidth: "150px",
                  minHeight: "40px",
                }}
              >
                บันทึก
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              sx={{ borderRadius: "7px" }}
              onClick={handleModalQ}
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

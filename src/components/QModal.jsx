import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Divider,
  Button,
} from "@mui/material";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PercentIcon from "@mui/icons-material/Percent";
import API_URL from "../config/api";
import Toast from "./Toast/Toast.js";

export default function QModal({
  active,
  handleModalQ,
  exam_id,
  ques_id,
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
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
        setPersent_checking(data.persent_checking);
        setQuestion(data.question);
        setScore(data.full_score);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (
      question.length === 0 ||
      persent_checking.length === 0 ||
      answer.length === 0 ||
      score.length === 0 ||persent_checking>100||persent_checking<0
     
    ) {
      Toast.fire({
        icon: "error",
        title: "ป้อนข้อมูลให้ถูกต้องครบถ้วน",
      });
    } else {
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
          handleModalQ();
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    if (
      question.length === 0 ||
      score.length === 0 ||
      persent_checking > 100 ||
      persent_checking < 0 || persent_checking.length === 0 
    ) {
      Toast.fire({
        icon: "error",
        title: "ป้อนข้อมูลให้ถูกต้องครบถ้วน",
      });
    } else {
      await API_URL.put(`api/question/${ques_id}`, {
        question: question,
        persent_checking: persent_checking,
        full_score: score,
      })
        .then((res) => {
          cleanFormData();
          Toast.fire({
            icon: "success",
            title: "แก้ไขคำถามแล้ว",
          });
          handleModalQ();
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalQ}></div>
      <div className="modal-card">
        <header className="modal-card-head has-text-white-ter">
          <h1 className="modal-card-title has-text-centered my-auto">
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
                maxRows={7}
                // InputLabelProps={{
                //   shrink: true,
                // }}
                size="medium"
                value={question || ""}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </Box>
            <Divider
              sx={{ m: 1, borderBottomWidth: 2, backgroundColor: "black" }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <DataUsageIcon color="warning" />
              <TextField
                color="warning"                
                label="คะแนน"
                InputProps={{ inputProps: { min: 0, max: 500 } }}
                type="number"
                size="small"
                value={score || ''}
                onChange={(e) => setScore(e.target.value)}
                required
              />
              <div className="mx-10"></div>
              <TextField
                className="mr-1"
                autoComplete="off"
                label="เปอร์เซ็นต์การตรวจอัตโนมัติ"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                type="number"
                sx={{ width: "25%" }}
                size="small"
                value={persent_checking || setPersent_checking(80)}
                onChange={(e) => setPersent_checking(e.target.value)}
                required
              />
              <PercentIcon />
            </Box>
            {ques_id ? (
              <></>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AssignmentTurnedInIcon color="secondary"
                    sx={{ flexGrow: 0 }}
                  />
                  <TextField
                  color="secondary"
                    label="เฉลย"
                    multiline
                    maxRows={7}
                    sx={{ flexGrow: 1 }}
                    size="medium"
                    value={answer || ""}
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
                type="sub"
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

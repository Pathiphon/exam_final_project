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

export default function QModal({
  active,
  handleModalQ,
  token,
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

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        question: question,
        persent_checking: persent_checking,
      }),
    };
    const response = await fetch(
      `/api/exams/${exam_id}/question`,
      requestOptions
    );
    if (!response.ok) {
      alert("มีข้อผิดพลาดในการเพิ่มข้อมูล");
    } else {
      handleModalQ();
    }
  };

  const handleCreateAnswer = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        answer: answer,
        score: score,
      }),
    };
    const response = await fetch(
      `/api/questions/${ques_id}/answer`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("มีข้อผิดพลาดในการเพิ่มข้อมูล");
    }
  };

  useEffect(() => {
    if (ques_id && exam_id) {
      get_Question();
    }
  }, [ques_id, exam_id]);

  const get_Question = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `/api/questions/${ques_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Exam");
    } else {
      const data = await response.json();
      setPersent_checking(data.persent_checking);
      setQuestion(data.question);
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        question: question,
        persent_checking:persent_checking,
      }),
    };
    const response = await fetch(
      `/api/questions/${ques_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong when updating Exam");
    } else {
      handleModalQ();
    }
  };

  const handleModalAns = () => {
    setActiveModalAns(!activeModalAns);
  };
  const handleClickAns = () => {
    setActiveModalAns(true);
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalQ}></div>
      <div className="modal-card">
        <AnsModal
          active={activeModalAns}
          handleModalAns={handleModalAns}
          token={token}
        />
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
            {/* <Box sx={{ width: "100%",mt:2 }} container display="flex"
              justifyContent="center"
              alignItems="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ width: "75%" }}
                  startIcon={<AddCircleIcon />}
                  onClick={() =>
                    handleClickAns()}
                >
                  เพิ่มเฉลย
                </Button>
              </Box> */}
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

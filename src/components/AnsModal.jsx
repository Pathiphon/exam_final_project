import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Divider,
  Input,
  Chip,
  Button,
  FormControl ,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ErrorMessage from "./ErrorMessage";
import EditIcon from "@mui/icons-material/Edit";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function AnsModal({
  active,
  score_id,
  ques_id,
  handleModalAns,
  token,
}) {
  const [scoreField, setScoreField] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [answerField, setAnswerField] = useState([]);
  const [answer,setAnswer] = useState({})

  useEffect(() => {
    if(score_id){
      get_Answers()
    }
    if(ques_id&&score_id){
      get_Score()
    }
  }, [score_id,ques_id]);

  const get_Answers = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `/api/exam_scores/${score_id}/exam_answer`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Answer");
    } else {
      const data = await response.json();
      setAnswerField(data);
    }
  };

  const get_Answer = async (ans_id) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `/api/exam_scores/${score_id}/exam_answers/${ans_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Answer");
    } else {
      const data = await response.json();
      setAnswer(data);
    }
  };

  const createOrEditAnswer = async() =>{
    if(answer.ans_id){
      const requestOptions = {
        method:"PUT" ,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          answer:answer.answer
        }),
      };
       await fetch(
        `/api/exam_scores/${score_id}/exam_answers/${answer.ans_id}`,
        requestOptions
      );
    }else{
      const requestOptions = {
        method:"POST" ,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          answer:answer.answer
        }),
      };
       await fetch(
        `/api/exam_scores/${score_id}/exam_answer`,
        requestOptions
      );
    }
    get_Answers()
    setAnswer({id:0,answer:""})
    
    
  }
  const deleteAnswer = async(ans_id)=>{
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/exam_scores/${score_id}/exam_answers/${ans_id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Failed to delete Answer");
    }
    get_Answers()
  }

  const get_Score = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `/api/exam_questions/${ques_id}/exam_scores/${score_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Score");
    } else {
      const data = await response.json();
      setScoreField(data.score);
    }
  };

  

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalAns}></div>
      <div className="modal-card">
        <header className="modal-card-head has-text-white-ter">
          <h1 className="modal-card-title has-text-centered">
            {score_id ? <>แก้ไขเฉลย</> : <>เพิ่มเฉลย</>}
          </h1>
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
                  defaultValue={scoreField}
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
              <Input type="hidden" defaultValue={answer.answer_id} />
                <Input sx={{ width: "100%" }} defaultValue={answer.answer} onChange={(e)=>setAnswer({...answer,answer:e.target.value})} placeholder="ป้อนเฉลย" />
              </Grid>
              <Grid item xs={1}>
                <IconButton  color="success" onClick={()=>createOrEditAnswer()}>
                  <AddCircleIcon  />
                </IconButton>
              </Grid>
            </Grid>
            <Divider>
              <Chip label="เฉลยทั้งหมด" />
            </Divider>
            {answerField.map((answerFields) => (
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                key={answerFields.ans_id}
              >
                <Grid item xs={10}>
                <TextField
          disabled

          defaultdefaultValue={answerFields.answer}
          variant="standard"
        />
                </Grid>

                <Grid item xs={1}>
                  <IconButton color="warning" onClick={()=>get_Answer(answerFields.ans_id)}>
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={1}>
                  <IconButton aria-label="delete" color="error" onClick={()=>deleteAnswer(answerFields.ans_id)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
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

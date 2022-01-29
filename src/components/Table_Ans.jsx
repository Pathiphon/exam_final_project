import React, { useEffect, useState } from "react";
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
  FormControl ,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ErrorMessage from "./ErrorMessage";
import EditIcon from "@mui/icons-material/Edit";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Table_Ans({ active,ques_id,handleModalAns,token, }) {
  const [all_Answer, setall_Answer] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(null);
  const [ans_id, setAns_id] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if(ques_id){
      get_Answers()
    }
  }, [ques_id]);

  const get_Answers = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `/api/questions/${ques_id}/answers`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Answer");
    } else {
      const data = await response.json();
      setall_Answer(data)
      console.log(all_Answer);
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
      `/api/questions/${ques_id}/answers/${ans_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Answer");
    } else {
      const data = await response.json();
      setAnswer(data);
    }
  }

  const createOrEditAnswer = async() =>{
    if(answer.ans_id){
      const requestOptions = {
        method:"PUT" ,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          answer:answer.answer,
          score:answer.score,
        }),
      };
       await fetch(
        `/api/questions/${ques_id}/answers/${answer.ans_id}`,
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
          answer:answer.answer,
          answer:answer.score,
        }),
      };
       await fetch(
        `api/questions/${ques_id}/answer`,
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
    const response = await fetch(`/api/exam_answers/${ans_id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Failed to delete Answer");
    }
    get_Answers()
  };


  const handleDeleteAns = async (ans_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/exam_questions/${ques_id}/exam_scores/${ans_id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Failed to delete Answer");
    }
    handleClose()
    get_Answer();
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen =async (id,answer) => {
    setAns_id(id)
    setAnswer(answer)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAns_id(null)
    setAnswer(null)
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
                  defaultValue={all_Answer?(all_Answer.score):('')}
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
              <Input type="hidden" defaultValue={answer?(answer.ans_id):""} />
                <Input sx={{ width: "100%" }} defaultValue={answer?(answer.answer):""} onChange={(e)=>setAnswer({...answer,answer:e.target.value})} placeholder="ป้อนเฉลย" />
              </Grid>
              <Grid item xs={1}>
                <IconButton  color="success" onClick={()=>createOrEditAnswer()}>
                  <AddCircleIcon  />
                </IconButton>
              </Grid>
            </Grid>
            <Divider sx={{mt:1}}>
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
            {all_Answer?(<>
            {all_Answer.map((answers) => (
              <TableRow
              key={answers.ans_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
              <IconButton color="warning" onClick={()=>get_Answer(answers.ans_id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" color="error" onClick={()=>deleteAnswer(answers.ans_id)}>
                    <DeleteForeverIcon />
                  </IconButton>
              </TableCell>
            </TableRow>
            ))}
          </> ):(<></>)}
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

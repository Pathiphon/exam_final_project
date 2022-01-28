import { Card } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import QModal from "./QModal";
import Table_Ans from "./Table_Ans";
import {
  Divider,
  Chip,
  Box,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Table_Ques({ exam_id, get_modal_create_exam }) {
  const [All_question, setAll_question] = useState(null);
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState("");
  const [ques_id, setQues_id] = useState(null);
  const [activeModalQ, setActiveModalQ] = useState(false);
  const [activeModalAns, setActiveModalAns] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const get_Question = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(`/exams/${exam_id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong.Couldn't load the Exam");
    } else {
      const data = await response.json();
      console.log(data);
      setAll_question(data.question);
    }
  };

  useEffect(() => {
    if (exam_id) {
      get_Question();
    }
  }, [exam_id]);

  const handleModalQ = async () => {
    get_Question();
    get_modal_create_exam(!activeModalQ);
    setActiveModalQ(!activeModalQ);
    setQues_id(null);
  };
  const handleClickQ = async (id) => {
    setQues_id(id);
    setActiveModalQ(true);
    get_modal_create_exam(!activeModalQ);
  };
  const handleModalAns = async () => {
    get_Question();
    get_modal_create_exam(!activeModalAns);
    setActiveModalAns(!activeModalAns);
    setQues_id(null);
  };
  const handleClickAns = async (id) => {
    setQues_id(id);
    setActiveModalAns(true);
    get_modal_create_exam(!activeModalAns);
  };

  return (
    <div>
      <Table_Ans
        active={activeModalAns}
        handleModalAns={handleModalAns}
        ques_id={ques_id}
      />
      <QModal
        active={activeModalQ}
        handleModalQ={handleModalQ}
        ques_id={ques_id}
        exam_id={exam_id}
        setErrorMessage={setErrorMessage}
      />
      {All_question ? (
        <div>
          {All_question.map((All_questions) => (
            <Grid item sx={{ mb: 2 }} key={All_questions.ques_id}>
              <Card sx={{ display: "flex", borderRadius: 3, padding: 1 }}>
                <Grid justify="space-between" sx={{ ml: 2 }} container>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography component="div" variant="h6">
                        คำถาม : {All_questions.question}
                      </Typography>
                      <Divider sx={{ m: 1 }} />
                      <Typography variant="subtitle1" component="div">
                        จำนวนเฉลย
                      </Typography>
                    </CardContent>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: "flex" }}>
                    <Button
                      sx={{ whiteSpace: "nowrap" }}
                      variant="outlined"
                      color="warning"
                      startIcon={<EditIcon />}
                      onClick={() => handleClickQ(All_questions.ques_id)}
                    >
                      แก้ไขคำถาม
                    </Button>
                    <Button
                      sx={{ whiteSpace: "nowrap", ml: 1 }}
                      variant="outlined"
                      color="secondary"
                      startIcon={<AssignmentTurnedInIcon />}
                      onClick={() => handleClickAns(All_questions.ques_id)}
                    >
                      แก้ไขเฉลย
                    </Button>
                    <Button
                      sx={{ ml: 1 }}
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteForeverIcon />}
                    >
                      ลบ
                    </Button>
                  </Box>
                </Grid>
              </Card>
            </Grid>
          ))}
        </div>
      ) : (
        <Divider sx={{ mt: 10 }}>ทำการสร้างโจทย์ใหม่</Divider>
      )}
    </div>
  );
}

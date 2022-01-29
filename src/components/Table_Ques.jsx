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
import Swal from "sweetalert2";

import API_URL from "../config/api";

export default function Table_Ques({ exam_id, get_modal_create_exam }) {
  const [All_question, setAll_question] = useState(null);
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState("");
  const [ques_id, setQues_id] = useState(null);
  const [activeModalQ, setActiveModalQ] = useState(false);
  const [activeModalAns, setActiveModalAns] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const get_Question = async () => {
    await API_URL.get(`api/question/${exam_id}/all`)
      .then((res) => {
        const data = res.data;
        console.log(data);
        setAll_question(data.question);
        return data
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const delete_Question = async (id, question) => {
    // const response = await API_URL.delete(`/api/question/${id}`)
     Swal.fire({
      title: "ยืนยันที่จะลบคำถาม?",
      text: question,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบคำถาม",
    }).then((result) => {
      if (result.isConfirmed) {
         API_URL.delete(`/api/question/${id}`).then((res) => {
          Swal.fire("Deleted!", "ทำการลบคำถามแล้ว.", "success");
          get_Question()
          return res.data;
        });

      }
      
    });
  };

  useEffect(() => {
    if (exam_id) {
      get_Question();
    }
  },[exam_id]);

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
          {All_question.map((All_questions, index) => (
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
                        ข้อ {index + 1}. {All_questions.question}
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
                      onClick={() =>
                        delete_Question(
                          All_questions.ques_id,
                          All_questions.question
                        )
                      }
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

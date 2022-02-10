import { Card } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import QModal from "./QModal";
import Table_Ans from "./Table_Ans";
import Toast from "./Toast/Toast.js";
import {
  Button,
  Divider,
  Chip,
  Box,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const delete_Question = (id, question) => {
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
        API_URL.delete(`/api/question/${id}`)
          .then(() => {
            Toast.fire({
              icon: "warning",
              title: "ลบคำถามเสร็จสิ้น",
            });
            get_Question();
          })
          .catch((err) => {
            console.log(err);
          });
        API_URL.delete(`/api/answer/${id}/byQues`)
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  useEffect(() => {
    if (exam_id) {
      get_Question();
    }
  }, [exam_id, ques_id]);

  const handleModalQ = async () => {
    get_Question();
    get_modal_create_exam(!activeModalQ);
    setActiveModalQ(!activeModalQ);
    setQues_id(null);
  };
  const handleClickQ = async (id) => {
    setQues_id(id);
    setActiveModalQ(true);
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
  };

  return (
    <div>
      {ques_id ? (
        <div>
          <Table_Ans
            active={activeModalAns}
            handleModalAns={handleModalAns}
            ques_id={ques_id}
          />
        </div>
      ) : (
        <></>
      )}
      <QModal
        active={activeModalQ}
        handleModalQ={handleModalQ}
        ques_id={ques_id}
        exam_id={exam_id}
        setErrorMessage={setErrorMessage}
      />
      {All_question ? (
        <div>
          <Box sx={{ flexGrow: 1, display: "flex", p: 1 }}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <ArticleIcon sx={{ m: 1 }} />
              <p className="text-lg m-1">
                จำนวนข้อ : {All_question.length}
              </p>
              <Typography
                sx={{
                  bgcolor: "#DDF4E1",
                  color: "text.primary",
                  borderRadius: "16px",
                  m: 1,
                  p: 2,
                }}
              >
                ทั้งหมด 0000 คะแนน
              </Typography>
              <Typography component="div" variant="h5" sx={{ m: 1 }}>
                |
              </Typography>
              <button
                className="shadow border border-gray-400 bg-gray-700 hover:bg-slate-800 text-white py-3 px-6 rounded-full"
                onClick={() => setActiveModalQ(true)}
              >
                เพิ่มคำถาม <AddCircleIcon sx={{ ml: 3 }} />
              </button>
            </Grid>
          </Box>

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
                      <Divider sx={{ my: 1, borderBottomWidth: 1, backgroundColor: "#000000" }} />
                      <Typography variant="subtitle1" component="div">
                        จำนวนเฉลย( {All_questions.answers.length} ) <Button
                      sx={{ whiteSpace: "nowrap", ml: 1 }}
                      variant="outlined"
                      color="secondary"
                      startIcon={<AssignmentTurnedInIcon />}
                      onClick={() => handleClickAns(All_questions.ques_id)}
                    >
                       เพิ่ม / แก้ไขเฉลย
                    </Button>
                      </Typography>
                    </CardContent>
                  </Box>
                </Grid>
                <Grid item>
                  <div className="flex-col">
                    <div className="bg-green-50 rounded-md grid  justify-items-center">
                      <p className="p-1 text-base text-black ">เต็ม {All_questions.full_score} คะแนน</p>
                    </div>
                    <div className="flex mt-3">
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
                    </div>
                  </div>
                </Grid>
              </Card>
            </Grid>
          ))}
        </div>
      ) : (
        <Divider sx={{ mt: 10 }}>ทำการสร้างแบบทดสอบใหม่</Divider>
      )}
    </div>
  );
}

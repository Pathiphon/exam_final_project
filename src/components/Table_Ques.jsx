import React, { useState, useEffect } from "react";
import QModal from "./QModal";
import Table_Ans from "./Table_Ans";
import Toast from "./Toast/Toast.js";
import {
  Button,
  Divider,
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Grid,
} from "@mui/material";
import EditRoadIcon from "@mui/icons-material/EditRoad";
import ArticleIcon from "@mui/icons-material/Article";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";
import API_URL from "../config/api";

export default function Table_Ques({ exam_id, get_modal_create_exam }) {
  const [All_question, setAll_question] = useState([]);
  const [score, setScore] = useState("");
  const [ques_id, setQues_id] = useState(null);
  const [activeModalQ, setActiveModalQ] = useState(false);
  const [activeModalAns, setActiveModalAns] = useState(false);
  const [loading, setLoading] = useState(true);

  const get_Question = async () => {
    await API_URL.get(`api/question/${exam_id}/all`)
      .then((res) => {
        if (res.data.length !== 0) {
          let sum_quesiton_score = 0;
          const question = res.data.question;
          for (var n = 0; n < question.length; n++) {
            sum_quesiton_score += question[n].full_score;
          }
          Object.assign(question, { sum_quesiton_score: sum_quesiton_score });
          setAll_question(question);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const deleteAll_Question = () => {
    Swal.fire({
      title: "ยืนยันการลบคำถามทั้งหมด?",
      html: `<p>ลบคำถามทั้งหมด <strong class="text-red-600">${All_question.length}</strong> ข้อ</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยันการลบคำถามทั้งหมด",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (let i in All_question) {
            await API_URL.delete(
              `/api/question/${exam_id}/${All_question[i].ques_id}`
            )
          }
          Toast.fire({
            icon: "warning",
            title: "ลบคำถามเสร็จสิ้น",
          });
          get_Question();
        } catch (error) {
          Toast.fire({
            icon: "error",
            title: "ไม่สามารถลบได้เนื่องจากมีเฉลยหรือคำตอบสัมพันธ์กันอยู่",
          });
        }
        
      }
    });
  };

  const delete_Question = (id, question, ans_lenght) => {
        Swal.fire({
          title: "ยืนยันการลบคำถาม?",
          html: `<p>พร้อมทั้งลบเฉลย <strong class="text-red-600">${ans_lenght}</strong> รูปแบบ<br>ของคำถาม<strong class="text-red-600">${question}</strong></p>`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ลบคำถาม",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await API_URL.delete(`/api/question/${exam_id}/${id}`)
              .then(() => {
                Toast.fire({
                  icon: "warning",
                  title: "ลบคำถามเสร็จสิ้น",
                });
                get_Question();
              })
              .catch((err) => {
                Toast.fire({
                  icon: "error",
                  title: "มีคำตอบของคำถามนี้อยู่",
                });
              });
          }
        });
      
  };

  useEffect(() => {
    get_Question();
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
    setScore(null);
  };
  const handleClickAns = async (id, score) => {
    setQues_id(id);
    setScore(score);
    setActiveModalAns(true);
  };

  return (
    <div>
      {activeModalAns === true ? (
        <div>
          <Table_Ans
            active={activeModalAns}
            handleModalAns={handleModalAns}
            ques_id={ques_id}
            full_score={score}
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
      />
      {loading === false && exam_id ? (
        <div>
          <Box sx={{ display: "flex", p: 1 }} className="justify-between">
            <Grid container direction="row" alignItems="center">
              <ArticleIcon sx={{ m: 1 }} />
              <p className="text-lg m-1">จำนวนข้อ : {All_question.length}</p>
              <Typography
                className="shadow-sm font-semibold"
                sx={{
                  bgcolor: "#fff1b8",
                  color: "text.primary",
                  borderRadius: "13px",
                  m: 1,
                  py: 1,
                  px: 2,
                }}
              >
                ทั้งหมด {All_question ? All_question.sum_quesiton_score : ""}{" "}
                คะแนน
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
            <Grid className="w-3/6 flex justify-end my-auto">
              {All_question.length !== 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  className="shadow-md py-3 px-4"
                  onClick={() => deleteAll_Question()}
                  startIcon={<DeleteForeverIcon fontSize="large" />}
                >
                  ลบคำถามทั้งหมด
                </Button>
              )}
            </Grid>
          </Box>

          {All_question.map((All_questions, index) => (
            <Grid item sx={{ mb: 2 }} key={All_questions.ques_id}>
              <Card sx={{ display: "flex", borderRadius: 3, padding: 1 }} >
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
                      <Divider
                        sx={{
                          my: 1,
                          borderBottomWidth: 1,
                          backgroundColor: "#000000",
                        }}
                      />
                      <Typography variant="subtitle1" component="div">
                        จำนวนเฉลย ( {All_questions.answers.length} )
                        <Button
                          sx={{ whiteSpace: "nowrap", ml: 1 }}
                          variant="outlined"
                          color="secondary"
                          className="shadow-md"
                          size="large"
                          startIcon={<EditRoadIcon fontSize="large" />}
                          onClick={() =>
                            handleClickAns(
                              All_questions.ques_id,
                              All_questions.full_score
                            )
                          }
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
                      <p className="p-1 text-base text-black my-auto">
                        เต็ม {All_questions.full_score} คะแนน
                      </p>
                    </div>
                    <div className="flex mt-3">
                      <Button
                        sx={{ whiteSpace: "nowrap" }}
                        variant="outlined"
                        color="warning"
                        className="shadow-md"
                        startIcon={<EditIcon />}
                        onClick={() => handleClickQ(All_questions.ques_id)}
                      >
                        แก้ไขคำถาม
                      </Button>

                      <Button
                        sx={{ ml: 1 }}
                        variant="outlined"
                        color="error"
                        className="shadow-md"
                        onClick={() =>
                          delete_Question(
                            All_questions.ques_id,
                            All_questions.question,
                            All_questions.answers.length
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
      ) : loading === true ? (
        <div className="text-center m-32">
          <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
            <LinearProgress color="inherit" />
          </Stack>
        </div>
      ) : (
        <Divider sx={{ my: 10 }}>ทำการสร้างข้อสอบใหม่</Divider>
      )}
    </div>
  );
}

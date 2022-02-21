import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Toast from "./Toast/Toast.js";
import { TextField, Card, Divider, Button, Chip } from "@mui/material";
import Box from "@mui/material/Box";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import { Table, Tag } from "antd";
import API_URL from "../config/api";
import { getCurrentUser } from "../services/auth.service";

export default function NewExamModal({ active, handleModalNew, exam_id }) {
  const [name, setName] = useState("");
  const [All_question, setAll_question] = useState(null);
  const [date_pre, setDate_pre] = useState("");
  const [time_pre, setTime_pre] = useState("");
  const [date_post, setDate_post] = useState("");
  const [time_post, setTime_post] = useState("");
  const [alreadySelecteRows, setAlreadySelecteRows] = useState([]);
  const [token] = useState(getCurrentUser());

  const cleanFormData = () => {
    setName("");
    setDate_pre("");
    setTime_pre("");
    setDate_post("");
    setTime_post("");
  };
  const handleCreateExam = async (e) => {
    e.preventDefault();
    const date_start = date_pre + " " + time_pre;
    const date_end = date_post + " " + time_post;
    let date_Dif = dayjs(date_end).diff(dayjs(date_start), "m", true);
    if (date_Dif > 0 && name.length > 0) {
      await API_URL.post(`api/exam/retest`, {
        name: name,
        date_pre: date_start,
        date_post: date_end,
        id: token.user.id,
        list_SelectQues:alreadySelecteRows.list_SelectQues,
      })
        .then((res) => {
          cleanFormData();
          handleModalNew();
          Toast.fire({
            icon: "success",
            title: "สร้างแบบทดสอบแล้ว",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Toast.fire({
        icon: "error",
        title: "ป้อนข้อมูลให้ถูกต้อง",
      });
    }
  };

  const get_Exam = async () => {
    await API_URL.get(`api/exam/${exam_id}`)
      .then((res) => {
        const data = res.data;
        setName(data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const get_Question = async () => {
    await API_URL.get(`api/question/${exam_id}/all`)
      .then((res) => {
        const question = res.data.question;
        for(var n =0;n < question.length;n++){
          Object.assign(
            question[n],
             {ques_index:n+1},
          );
        }        
        setAll_question(question);
        console.log(question);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    cleanFormData();
    if (exam_id) {
      get_Exam();
      get_Question();
    }
  }, [exam_id]);
  const columns_question = [
    {
      title: <div>ข้อที่</div>,
      dataIndex: "ques_index",
      width: "8%",
      sorter: (a, b) => a.ques_index - b.ques_index,
      render: (ques_index) => (
        <div>
          <p className="text-base my-auto">{ques_index}</p>
        </div>
      ),
    },
    {
      title: <div className="header_table">คำถาม</div>,
      dataIndex: "question",
      width: "60%",
      render: (question) => (
        <p className="text-base"> {question}</p>
      ),
    },
    {
      title: <div>คะแนนเต็ม</div>,
      dataIndex: "full_score",
      key: "full_score",
      sorter: (a, b) => a.full_score - b.full_score,
      align: "center",
      width: "10%",
      render: (full_score) => (
        <Tag color="geekblue">
          <p className="text-base text-black font-semibold my-auto px-2">
            {" "}
            {full_score}
          </p>
        </Tag>
      ),
    },
    {
      title: "จำนวนเฉลย",
      dataIndex: "answers",
      align: "center",
      width: "10%",
      sorter: (a, b) => a.answer - b.answer,
      render: (answers) => (
        <div>
          <p className="text-base my-auto">{answers.length}</p>
        </div>
        
      ),
    },
    // {
    //   title: "การจัดการ",
    //   dataIndex: "ques_id",
    //   key: "ques_id",
    //   width: "20%",
    //   render: (ques_id) => (
    //     <Button
    //       variant="outlined"
    //       color="success"
    //       size="large"
    //     >
    //       ดูเพิ่มเติม
    //     </Button>
    //   ),
    // },
  ];

  return (
    <div className={`modal ml-24 mt-9 ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalNew}></div>
      <div className="modal-card w-4/6 h-5/6">
        <header className="modal-card-head has-text-white-ter">
          <h4 className="modal-card-title has-text-centered my-auto">
            <FileCopyIcon fontSize="large" /> ยืนยันการสอบใหม่
          </h4>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalNew}
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
            <div className="flex flex-wrap items-center w-full mb-3">
              <div>
                <SubtitlesIcon sx={{ color: "action.active" }} />
              </div>
              <div className="w-full flex-auto md:w-1/2 px-3">
                <label className="ml-2">หัวข้อสอบ</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
                  placeholder="หัวข้อสอบ"
                />
              </div>
            </div>
            <Card className="p-4 w-4/6 mx-auto">
              <h4>กำหนดเวลาสอบ</h4>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  p: 1,
                  mx: 1,
                }}
              >
                <TextField
                  label="วันที่"
                  type="date"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={date_pre}
                  onChange={(e) => setDate_pre(e.target.value)}
                />
                <Box sx={{ width: 1 / 4 }}>
                  <TextField
                    label="เวลา"
                    type="time"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={time_pre}
                    onChange={(e) => setTime_pre(e.target.value)}
                    required
                  />
                </Box>
              </Box>

              <Divider>
                <Chip label="ถึง" />
              </Divider>
              <div>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    p: 1,
                    mx: 1,
                  }}
                >
                  <TextField
                    label="วันที่"
                    type="date"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={date_post}
                    onChange={(e) => setDate_post(e.target.value)}
                    required
                  />
                  <Box sx={{ width: 1 / 4 }}>
                    <TextField
                      label="เวลา"
                      type="time"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      value={time_post}
                      onChange={(e) => setTime_post(e.target.value)}
                      required
                    />
                  </Box>
                </Box>
              </div>
            </Card>
          </Box>
          <Divider sx={{my:2}}>
               <p className="text-lg">คำถามทั้งหมด</p> 
              </Divider>
          <div className="w-11/12 mx-auto">
            <Table
              columns={columns_question}
              dataSource={All_question}
              rowKey="ques_id"
              rowSelection={{
                type: "checkbox",
                selectedRows: alreadySelecteRows,
                onChange: (keys, selectedRows) => {
                  setAlreadySelecteRows({ list_SelectQues: selectedRows });
                  console.log(alreadySelecteRows);
                },
              }}
            />
          </div>
        </section>

        <footer className="modal-card-foot">
          <div className="container mx-auto text-center">
            <Button
              onClick={handleCreateExam}
              className="mr-4"
              sx={{ borderRadius: "7px" }}
              style={{
                fontSize: "18px",
                maxWidth: "100px",
                maxHeight: "30px",
                minWidth: "150px",
                minHeight: "40px",
              }}
              variant="contained"
              color="success"
            >
              บันทึก
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ borderRadius: "10px" }}
              onClick={handleModalNew}
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

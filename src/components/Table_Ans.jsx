import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Toast from "./Toast/Toast.js";
import { Table, Tag, Spin } from "antd";
import { Box, TextField, Divider, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import API_URL from "../config/api";

export default function Table_Ans({
  active,
  ques_id,
  handleModalAns,
  full_score,
}) {
  const [all_Answer, setAll_Answer] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadySelecteRows, setAlreadySelecteRows] = useState([]);

  useEffect(() => {
    setAnswer({ id: 0, answer: "", score: "" });
    get_Answers();
  }, [ques_id, handleModalAns]);

  const get_Answers = async () => {
    await API_URL.get(`api/answer/${ques_id}/all`)
      .then((res) => {
        const data = res.data;
        setAll_Answer(data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const get_Answer = async (ans_id) => {
    await API_URL.get(`api/answer/${ans_id}`)
      .then((res) => {
        const data = res.data;
        setAnswer(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createOrEditAnswer = async () => {
    if (
      answer.score > full_score ||
      answer.score.length === 0 ||
      answer.answer.length === 0
    ) {
      Toast.fire({
        icon: "error",
        title: "ป้อนข้อมูลให้ถูกต้องครบถ้วน",
      });
    } else {
      if (answer.ans_id) {
        await API_URL.put(`api/answer/${answer.ans_id}`, {
          answer: answer.answer,
          score: answer.score,
        })
          .then((res) => {
            get_Answers();
            setAnswer({ id: 0, answer: "", score: "" });
            Toast.fire({
              icon: "success",
              title: "แก้ไขเฉลยเสร็จสิ้น",
            });
            return res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        await API_URL.post(`api/answer`, {
          answer: answer.answer,
          score: answer.score,
          ques_id: ques_id,
        })
          .then((res) => {
            get_Answers();
            setAnswer({ id: 0, answer: "", score: "" });
            Toast.fire({
              icon: "success",
              title: "เพิ่มเฉลยเสร็จสิ้น",
            });
            return res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  const deleteAll_Answer = async () => {
    const list_select = alreadySelecteRows.list_SelectAns;
    Swal.fire({
      title: "ยืนยันที่จะลบเฉลย?",
      text: `เลือกไว้ ${list_select.length} จำนวน`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบเฉลย",
    }).then(async (result) => {
      if (result.isConfirmed) {
        for (let i in list_select) {
          console.log(list_select[i].ans_id);
          await API_URL.delete(`/api/answer/${list_select[i].ans_id}`).catch(
            (err) => {
              console.log(err);
            }
          );
        }
        get_Answers();
        Toast.fire({
          icon: "warning",
          title: "ลบเฉลยเสร็จสิ้น",
        });
      }
    });
  };
  const deleteAnswer = async (ans_id, answer) => {
    Swal.fire({
      title: "ยืนยันที่จะลบเฉลย?",
      text: answer.answer,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบเฉลย",
    }).then((result) => {
      if (result.isConfirmed) {
        API_URL.delete(`/api/answer/${ans_id}`)
          .then(() => {
            get_Answers();
            Toast.fire({
              icon: "warning",
              title: "ลบเฉลยเสร็จสิ้น",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  const columns_answer = [
    {
      title: "เฉลยทั้งหมด",
      dataIndex: "answer",
      width: "80%",
      render: (answer) => (
        <p className="text-base max-w-xl my-auto"> {answer}</p>
      ),
    },
    {
      title: "คะแนน",
      dataIndex: "score",
      align: "center",
      width: "7%",
      sorter: (a, b) => a.score - b.score,
      render: (score) => (
        <Tag color="orange" className="my-auto">
          <p className="text-base text-black font-semibold my-auto px-2">
            {" "}
            {score}
          </p>
        </Tag>
      ),
    },
    {
      title: "การจัดการ",
      align: "center",
      dataIndex: "ans_id",
      key: "ans_id",
      render: (ans_id, ans) => (
        <div className="flex justify-end">
          <Button
            startIcon={<EditIcon />}
            sx={{ whiteSpace: "nowrap" }}
            variant="outlined"
            color="warning"
            size="small"
            onClick={() => get_Answer(ans_id)}
          >
            แก้ไข
          </Button>
          <Button
            sx={{ ml: 1 }}
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={() => deleteAnswer(ans_id, ans)}
          >
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalAns}></div>
      <div className="modal-card w-5/6">
        <header className="modal-card-head has-text-white-ter">
          <h1 className="modal-card-title has-text-centered my-auto">
            จัดการเฉลย
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
            <div className="flex w-full my-auto">
              <div className="flex-col items-center w-1/6 mr-4">
                <TextField
                  label="คะแนน"
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 500 } }}
                  value={answer ? answer.score : ""}
                  onChange={(e) =>
                    setAnswer({ ...answer, score: e.target.value })
                  }
                  required
                  size="small"
                  color="warning"
                  focused
                />
                <div className="flex w-full">
                  <DataUsageIcon
                    color="warning"
                    fontSize="medium"
                    sx={{ color: "warning", mr: 1, my: "auto" }}
                  />
                  <p className="my-auto text-sm">
                    ***เต็ม {full_score ? full_score : ""} คะแนน
                  </p>
                </div>
              </div>
              <div className="flex w-full justify-center items-start">
                <div className="flex w-5/6">
                  <input type="hidden" value={answer ? answer.ans_id : ""} />
                  <div className="flex flex-wrap items-center w-full mb-3">
                    <div className="w-full flex-auto md:w-1/2 px-3">
                      <textarea
                        sx={{ width: "100%" }}
                        value={answer ? answer.answer : ""}
                        onChange={(e) =>
                          setAnswer({ ...answer, answer: e.target.value })
                        }
                        className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
                        placeholder="ป้อนเฉลย"
                        rows="3"
                        cols="10"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex-auto w-1/6">
                  {answer ? (
                    !answer.ans_id ? (
                      <Button
                        color="success"
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        onClick={() => createOrEditAnswer()}
                        sx={{ minWidth: "130px", minHeight: "50px" }}
                      >
                        เพิ่ม
                      </Button>
                    ) : (
                      <Button
                        color="warning"
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => createOrEditAnswer()}
                        sx={{ minWidth: "130px", minHeight: "50px" }}
                      >
                        แก้ไข
                      </Button>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <Divider sx={{ my: 2 }} />
            {alreadySelecteRows.list_SelectAns ? (
              <div className="flex justify-start mb-3">
                <Button
                  variant="outlined"
                  color="error"
                  className="shadow-md px-4"
                  onClick={() => deleteAll_Answer()}
                  startIcon={<DeleteForeverIcon fontSize="large" />}
                >
                  ลบเฉลยที่เลือก
                </Button>
              </div>
            ) : (
              <div className="flex justify-start mb-3">
                <Button
                  variant="outlined"
                  color="error"
                  className="shadow-md px-4"
                  onClick={() => deleteAll_Answer()}
                  startIcon={<DeleteForeverIcon fontSize="large" />}
                  disabled
                >
                  ลบเฉลยที่เลือก
                </Button>
              </div>
            )}
            <Table
              size="middle"
              rowKey="ans_id"
              rowSelection={{
                type: "checkbox",
                selectedRows: alreadySelecteRows,
                onChange: (keys, selectedRows) => {
                  setAlreadySelecteRows({ list_SelectAns: selectedRows });
                  console.log(alreadySelecteRows);
                },
              }}
              columns={columns_answer}
              dataSource={all_Answer}
              loading={{
                indicator: (
                  <div>
                    <Spin size="large" />
                  </div>
                ),
                spinning: loading,
              }}
            />
            {/* {loading === false && all_Answer ? (
              <TableContainer>
                <Table
                  sx={{
                    minWidth: 600,
                    backgroundColor: "#F5F5F5",
                    borderRadius: "5px",
                  }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>เฉลย</TableCell>
                      <TableCell
                        align="center"
                        width="10%"
                        className="text-center"
                      >
                        คะแนน
                      </TableCell>
                      <TableCell
                        align="center"
                        width="25%"
                        className="text-center"
                      >
                        การจัดการ
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <>
                      {all_Answer.map((answers) => (
                        <TableRow
                          key={answers.ans_id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography
                              sx={{
                                textOverflow: "ellipsis",
                                width: "32rem",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {answers.answer}
                            </Typography>
                          </TableCell>

                          <TableCell align="center" className="text-center">
                            {answers.score}
                          </TableCell>
                          <TableCell align="center" className="text-center">
                            <Button
                              startIcon={<EditIcon />}
                              sx={{ whiteSpace: "nowrap" }}
                              variant="outlined"
                              color="warning"
                              size="small"
                              onClick={() => get_Answer(answers.ans_id)}
                            >
                              แก้ไข
                            </Button>
                            <Button
                              sx={{ ml: 1 }}
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteForeverIcon />}
                              onClick={() =>
                                deleteAnswer(answers.ans_id, answers.answer)
                              }
                            >
                              ลบ
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : loading === true ? (
              <div className="text-center m-32">
                <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
                  <LinearProgress color="inherit" />
                </Stack>
              </div>
            ) : (
              <div>
                <Divider sx={{ my: 10 }}>ทำการสร้างเฉลย</Divider>
              </div>
            )} */}
          </Box>
        </section>
      </div>
    </div>
  );
}

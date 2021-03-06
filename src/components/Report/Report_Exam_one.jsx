import React, { useEffect, useRef } from "react";
import useState from "react-usestateref";
import { Table, Tag, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { CssBaseline, Toolbar, Button, Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import API_URL from "../../config/api";
import Stu_report_Modal from "./Stu_report_Modal";
import ArticleIcon from "@mui/icons-material/Article";
import Question_report_Modal from "./Question_report_Modal";
import Report_Reply from "./Report_Reply";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import Toast from "../Toast/Toast.js";

export default function Report_Exam_one() {
  const { exam_id } = useParams();
  const [loading_stu, setLoading_stu] = useState(true);
  const [loading_ques, setLoading_ques] = useState(true);
  const [exam, setExam] = useState([]);
  const [students, setStudents] = useState([]);
  const [stu_code, setStu_code] = useState(null);
  const [score_allstu, setScore_allstu] = useState(null);
  const [stu_ques_id, setStu_ques_id] = useState(null);
  const [stu_exam_id, setStu_exam_id] = useState(null);
  const [activeModalReport, setActiveModalReport] = useState(false);
  const [activeModalReport_ques, setActiveModalReport_ques] = useState(false);
  const [value, setValue] = useState("1");
  const [question, setQuestion] = useState(null);
  let componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: exam ? exam.name : "รายงาน",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickReport = async (stu_code) => {
    setStu_code(stu_code.stu_code);
    setStu_exam_id(exam_id);
    setActiveModalReport(true);
  };
  const handleModalReport = async () => {
    get_Students();
    setActiveModalReport(!activeModalReport);
    setStu_code(null);
    setStu_exam_id(null);
  };
  const handleClickReport_ques = async (ques_id) => {
    setStu_ques_id(ques_id.ques_id);
    setActiveModalReport_ques(true);
  };
  const handleModalReport_ques = async () => {
    setActiveModalReport_ques(!activeModalReport_ques);
    setStu_ques_id(null);
  };

  let navigate = useNavigate();

  function handleClick_Back() {
    navigate("/Report");
  }

  const iptoNum =(ip)=>{
    return ip.split(".").reduce((sum,x,i) => sum + (x << 8*(3-i)), 0)
  }

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${exam_id}/allreply`)
      .then((res) => {
        const exam = res.data;
        const question = res.data.question;
        let sum_score = 0;
        let sum_score_stu = 0;

        for (var j = 0; j < question.length; j++) {
          sum_score += question[j].full_score;
          for (var i = 0; i < question[j].replies.length; i++) {
            sum_score_stu += question[j].replies[i].score_stu;
          }
          Object.assign(
            exam.question[j],
            { ques_index: j + 1 },
            { sum_scoreStu: sum_score_stu },
            {
              avg_question: (
                sum_score_stu / question[j].replies.length
              ).toFixed(2),
            }
          );
          sum_score_stu = 0;
        }
        Object.assign(exam, { question_sum_score: sum_score });
        setExam(exam);
        setQuestion(question);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading_ques(false);
  };
  const get_Students = async () => {
    await API_URL.get(`api/student/${exam_id}`)
      .then((res) => {
        const student = res.data;
        console.log(student);
        let sum_score = 0;
        let sum_score_allStu = 0;
        let ipAddress = "";
        let ipResult = 0;
        for (var j = 0; j < student.length; j++) {
          for (var i = 0; i < student[j].replies.length; i++) {
            sum_score += student[j].replies[i].score_stu;
            ipAddress = student[j].replies[i].ipaddress;
            ipResult = iptoNum(student[j].replies[i].ipaddress)
            sum_score_allStu += student[j].replies[i].score_stu;
          }
          Object.assign(student[j], { score_stu_full: sum_score },{ipaddress:ipAddress},{ipresult:ipResult});
          sum_score = 0;
        }
        setScore_allstu(sum_score_allStu);
        setStudents(student);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading_stu(false);
  };

  const delete_Reply = (name) => {
    Swal.fire({
      title: "ยืนยันการลบคำตอบทั้งหมด?",
      html: `<p>คำตอบของนักศึกษา <strong class="text-red-600 ">${students.length}</strong> คน<br>จะถูกลบออกจาก <strong class="text-red-600">${name}</strong></p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยันการลบคำตอบทั้งหมด",
      cancelButtonText:"ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        API_URL.delete(`/api/reply/${exam_id}/del/Exam`)
          .then(() => {
            Toast.fire({
              icon: "warning",
              title: "ลบคำตอบเสร็จสิ้น",
            });
            get_Exam();
            get_Students();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  useEffect(() => {
    get_Exam();
    get_Students();
  }, []);

  const columns = [
    {
      title: "รหัสนักศึกษา",
      dataIndex: "stu_code",
      key: "stu_code",
      width: "20%",
      align: "center",
      sorter: (a, b) => a.stu_code - b.stu_code,
      render: (stu_code) => <p className="text-base my-auto">{stu_code}</p>,
    },
    {
      title: <div className="header_table">ชื่อ - นามสกุล</div>,
      dataIndex: "name",
      width: "40%",
      render: (name) => (
        <p className="text-base max-w-md truncate my-auto"> {name}</p>
      ),
    },
    {
      title: "IP_Address",
      dataIndex: "ipaddress",
      sorter: (a, b) => a.ipresult - b.ipresult,
      render: (ipaddress) => (
        <p className="text-base my-auto"> {ipaddress}</p>
      ),
    },
    {
      title: "คะแนน",
      dataIndex: "score_stu_full",
      align: "center",
      width:'10%',
      sorter: (a, b) => a.score_stu_full - b.score_stu_full,
      render: (score_stu_full) => (
        <>
          {exam ? (
            score_stu_full >= exam.question_sum_score / 2 ? (
              <Tag color="green">
                <p className="text-base text-black font-semibold my-auto px-2">
                  {" "}
                  {score_stu_full}
                </p>
              </Tag>
            ) : (
              <Tag color="volcano">
                <p className="text-base text-black font-semibold my-auto px-2">
                  {" "}
                  {score_stu_full}
                </p>
              </Tag>
            )
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "การจัดการ",
      dataIndex: "stu_code",
      key: "stu_code",
      align:'center',
      width: "15%",
      render: (stu_code) => (
        <Button
          variant="outlined"
          color="success"
          onClick={() => handleClickReport({ stu_code })}
          startIcon={<ManageSearchIcon />}
          style={{
            maxHeight: "35px",
          }}
        >
          ดูเพิ่มเติม
        </Button>
      ),
    },
  ];
  const columns_question = [
    {
      title: <div>ข้อที่</div>,
      dataIndex: "ques_index",
      width: "8%",
      render: (ques_index) => (
        <div>
          <p className="text-base my-auto">{ques_index}</p>
        </div>
      ),
    },
    {
      title: <div className="header_table">คำถาม</div>,
      dataIndex: "question",
      
      render: (question) => (
        <p className="text-base max-w-xl my-auto truncate"> {question}</p>
      ),
    },
    {
      title: <div>คะแนนเต็ม</div>,
      dataIndex: "full_score",
      key: "full_score",
      width: "20%",
      sorter: (a, b) => a.full_score - b.full_score,
      align: "center",
      render: (full_score) => <p className="text-base my-auto">{full_score}</p>,
    },
    {
      title: "คะแนนเฉลี่ย",
      dataIndex: "avg_question",
      width: "20%",
      align: "center",
      sorter: (a, b) => a.avg_question - b.avg_question,
      render: (avg_question) => (
        <Tag color="geekblue" className="my-auto">
          <p className="text-base text-black font-semibold my-auto px-2">
            {" "}
            {avg_question}
          </p>
        </Tag>
      ),
    },
    {
      title: "การจัดการ",
      dataIndex: "ques_id",
      key: "ques_id",
      width: "15%",
      render: (ques_id) => (
        <Button
          variant="outlined"
          color="success"
          size="medium"
          style={{
            maxHeight: "30px",
          }}
          onClick={() => handleClickReport_ques({ ques_id })}
          startIcon={<ManageSearchIcon />}
        >
          ดูเพิ่มเติม
        </Button>
      ),
    },
  ];

  return (
    <div className="">
      <CssBaseline />
      <div className="shadow-md" style={{ background: "white" }}>
        <Toolbar>
          <Button
            variant="outlined"
            size="large"
            className="shadow-md"
            startIcon={<ArrowBackIosIcon />}
            style={{ fontSize: "18px" }}
            onClick={handleClick_Back}
          >
            {" "}
            รายงานผลสอบ
          </Button>
        </Toolbar>
      </div>
      <div className="w-4/5 mx-auto shadow-md   bg-white rounded-xl">
        <div className="md:flex  items-center justify-between my-3 w-100 rounded-lg px-5 py-3">
          <div className="flex-col items-center w-full md:w-3/6 justify-center text-center">
            <p className="text-lg">{exam.name} </p>
            <p className="w-full text-xs">
              เวลาสอบ {dayjs(exam.date_pre).format("DD/MM/YYYY HH:mm")} ถึง{" "}
              {dayjs(exam.date_post).format("DD/MM/YYYY HH:mm")}
            </p>
            
          </div>
          <div className="w-full md:w-3/6 justify-end">
            <div className="md:flex justify-end">
              <div
                className="flex-col mx-2  rounded-xl px-3 py-2 text-center shadow-md"
                style={{ backgroundColor: "#DBD8AE" }}
              >
                <p className="text-md">คะแนนเต็ม</p>
                <p className="font-medium">
                  {exam ? exam.question_sum_score : ""}
                </p>
              </div>
              <div
                className="flex-col mx-2 bg-gray-50 rounded-xl px-5 py-2 text-center shadow-md"
                style={{ backgroundColor: "#DBD8AE" }}
              >
                <p className="text-md">คำถาม</p>
                <p className="font-medium">
                  {exam.question ? exam.question.length : ""}
                </p>
              </div>
              <div
                className="flex-col mx-2 bg-gray-50 rounded-xl py-2 px-5 text-center shadow-md"
                style={{ backgroundColor: "#DBD8AE" }}
              >
                <p className="text-md">ผู้เข้าสอบ</p>
                <p className="font-medium">{students ? students.length : ""}</p>
              </div>
              <div
                className="flex-col mx-2 bg-gray-50 rounded-xl py-2 px-5 text-center shadow-md"
                style={{ backgroundColor: "#DBD8AE" }}
              >
                <p className="text-md">คะแนนเฉลี่ย</p>
                <p className="font-medium">
                  {students ? (score_allstu / students.length).toFixed(2) : 0}
                </p>
              </div>
            </div>
            {/* <div className="flex mt-3 justify-end">
              <Button
                variant="outlined"
                startIcon={<ArticleIcon />}
                className="w-48 border-2 shadow-md mx-2"
                onClick={handlePrint}
              >
                ดาวน์โหลดรายงาน
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                className="w-48 border-2 shadow-md mx-2"
                onClick={()=>delete_Reply(exam.name)}
              >
                ลบคำตอบทั้งหมด
              </Button>
            </div> */}
          </div>
        </div>
      </div>
      <TabContext value={value} className="w-4/5 mx-auto">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="flex mx-28">
          <TabList
            onChange={handleChange}
            className="w-4/5 mx-auto justify-between"
          >
            <Tab label="ผู้เข้าสอบ" value="1" />
            <Tab label="คำถาม" value="2" />
          </TabList>
          <div className="flex my-auto justify-end">
              <Button
                variant="outlined"
                startIcon={<ArticleIcon />}
                className="w-48 border-2 shadow-md mx-2"
                onClick={handlePrint}
              >
                ดาวน์โหลดรายงาน
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                className="w-48 border-2 shadow-md mx-2"
                onClick={()=>delete_Reply(exam.name)}
              >
                ลบคำตอบทั้งหมด
              </Button>
            </div>
        </Box>
        <TabPanel value="1">
          <div className="w-11/12 mx-auto">
            <Table
              size="middle"
              columns={columns}
              dataSource={students}
              rowKey="stu_code"
              loading={{
                indicator: (
                  <div>
                    <Spin size="large" />
                  </div>
                ),
                spinning: loading_stu,
              }}
            />
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div className="w-11/12 mx-auto">
            <Table
              columns={columns_question}
              dataSource={question}
              rowKey="ques_id"
              loading={{
                indicator: (
                  <div>
                    <Spin size="large" />
                  </div>
                ),
                spinning: loading_ques,
              }}
            />
          </div>
        </TabPanel>
        
      </TabContext>
      {activeModalReport === true ? (
        <>
          <Stu_report_Modal
            active={activeModalReport}
            handleModalReport={handleModalReport}
            exam_id={stu_exam_id}
            stu_code={stu_code}
            exam={exam}
          />
        </>
      ) : (
        <></>
      )}
      {activeModalReport_ques === true ? (
        <>
          <Question_report_Modal
            active={activeModalReport_ques}
            handleModalReport_ques={handleModalReport_ques}
            exam_id={exam_id}
            ques_id={stu_ques_id}
          />
        </>
      ) : (
        <></>
      )}
      <div className="hidden">
        <Report_Reply
          ref={componentRef}
          exam={exam}
          student={students}
          avg_score={(score_allstu / students.length).toFixed(2)}
        />
      </div>
    </div>
  );
}

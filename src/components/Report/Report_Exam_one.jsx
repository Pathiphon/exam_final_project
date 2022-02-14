import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Table, Tag } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CssBaseline, Toolbar, Button, Divider, Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import API_URL from "../../config/api";
import Stu_report_Modal from "./Stu_report_Modal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";

export default function Report_Exam_one() {
  const { exam_id } = useParams();
  const [exam, setExam, examRef] = useState([]);
  const [exam_data, setExam_data] = useState([]);
  const [count_false, setCount_false] = useState([]);
  const [count_exam, setCount_exam] = useState([]);
  const [students, setStudents] = useState([]);
  const [stu_code, setStu_code] = useState(null);
  const [score_allstu, setScore_allstu] = useState(null);
  const [stu_exam_id, setStu_exam_id] = useState(null);
  const [activeModalReport, setActiveModalReport] = useState(false);
  const [value, setValue] = useState("1");
  const [question, setQuestion] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickReport = async (stu_code) => {
    setStu_code(stu_code.stu_code);
    setStu_exam_id(exam_id);
    setActiveModalReport(true);
  };
  const handleModalReport = async () => {
    setActiveModalReport(!activeModalReport);
    setStu_code(null);
    setStu_exam_id(null);
  };

  let navigate = useNavigate();

  function handleClick_Back() {
    navigate("/Report");
  }

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${exam_id}/allreply`)
      .then((res) => {
        const exam = res.data;
        const question = res.data.question;
        let sum_score = 0;
        let sum_score_stu=0;

        for (var j = 0; j < question.length; j++) {
          sum_score += question[j].full_score;
          for(var i =0;i<question[j].replies.length;i++){
            sum_score_stu+=question[j].replies[i].score_stu;
          }
          Object.assign(exam.question[j],{sum_scoreStu:sum_score_stu},{avg_question:sum_score_stu/question[j].replies.length});
          sum_score_stu=0;
        }
        Object.assign(exam, { question_sum_score: sum_score });
        setExam(exam);
        setQuestion(question);
        console.log(examRef.current);

        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const get_Students = async () => {
    await API_URL.get(`api/student/${exam_id}`)
      .then((res) => {
        const student = res.data;
        let sum_score = 0;
        let sum_score_allStu = 0;
        for (var j = 0; j < student.length; j++) {
          for (var i = 0; i < student[j].replies.length; i++) {
            sum_score += student[j].replies[i].score_stu;
            sum_score_allStu += student[j].replies[i].score_stu;
          }
          Object.assign(student[j], { score_stu_full: sum_score });
          sum_score = 0;
        }
        console.log(sum_score_allStu);
        setScore_allstu(sum_score_allStu);
        setStudents(student);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    get_Exam();
    get_Students();
  }, []);

  const columns = [
    {
      title:"รหัสนักศึกษา",
      dataIndex: "stu_code",
      key: "stu_code",
      width:"20%",
      sorter: (a, b) => a.stu_code - b.stu_code,
      render: (stu_code) => (
        <div>
          <p className="text-base my-auto">{stu_code}</p>
        </div>
      ),
    },
    {
      title: <div className="header_table">ชื่อ - นามสกุล</div>,
      dataIndex: "name",
      width: "30%",
      render: (name) => <p className="text-base max-w-md truncate"> {name}</p>,
    },
    {
      title: "คะแนน",
      dataIndex: "score_stu_full",
      align: "center",
      sorter: (a, b) => a.score_stu_full - b.score_stu_full,
      render: (score_stu_full) => (
        <div className="bg-green-100 rounded-lg w-2/6 mx-auto  ">
          <p className="text-base font-semibold my-auto text-black p-1">
            {score_stu_full}
          </p>
        </div>
      ),
    },
    {
      title: "การจัดการ",
      dataIndex: "stu_code",
      key: "stu_code",
      width: "20%",
      render: (stu_code) => (
        <Button
          variant="outlined"
          color="success"
          size="large"
          onClick={() => handleClickReport({ stu_code })}
          startIcon={<ManageSearchIcon />}
        >
          ดูเพิ่มเติม
        </Button>
      ),
    },
  ];
  const columns_question = [
    {
      title: <div>ข้อที่</div>,
      dataIndex: "",
      key:'',
      width: "8%",
      render: (ques_id,record,index) => (
        <div>
          <p className="text-base my-auto">{index+1}</p>
        </div>
      ),
    },
    {
      title: <div className="header_table">คำถาม</div>,
      dataIndex: "question",
      width: "30%",
      render: (question) => <p className="text-base max-w-xs truncate"> {question}</p>,
    },
    {
      title: <div>คะแนนเต็ม</div>,
      dataIndex: "full_score",
      key: "full_score",
      sorter: (a, b) => a.full_score - b.full_score,
      align: "center",
      render: (full_score) => (
        <div>
          <p className="text-base my-auto">{full_score}</p>
        </div>
      ),
    },
    {
      title: "คะแนนเฉลี่ย",
      dataIndex: "avg_question",
      align: "center",
      sorter: (a, b) => a.avg_question - b.avg_question,
      render: (avg_question) => (
        <div className="bg-orange-100 rounded-lg w-2/6 mx-auto  ">
          <p className="text-base font-medium my-auto text-black p-1">
            {avg_question}
          </p>
        </div>
      ),
    },
    {
      title: "การจัดการ",
      dataIndex: "question",
      key: "question",
      width: "20%",
      render: (question) => (
        <Button
          variant="outlined"
          color="success"
          size="large"
          onClick={() => handleClickReport({ question })}
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
            <p className="text-xl truncate">{exam.name} </p>
            <div className="flex">
              <Button
                variant="outlined"
                startIcon={<ArticleIcon />}
                className="w-48 border-2 shadow-md"
                //   onClick={() => handleUpdate(exams.exam_id)}
              >
                ดาวน์โหลดรายงาน
              </Button>
              
            </div>
          </div>
          <div className="md:flex  w-full md:w-3/6 justify-end">
            <div
              className="flex-col mx-2  rounded-xl p-3 text-center shadow-md"
              style={{ backgroundColor: "#DBD8AE" }}
            >
              <p className="text-md">คะแนนเต็ม</p>
              <p className="font-medium">
                {exam ? exam.question_sum_score : ""}
              </p>
            </div>
            <div
              className="flex-col mx-2 bg-gray-50 rounded-xl px-5 py-3 text-center shadow-md"
              style={{ backgroundColor: "#DBD8AE" }}
            >
              <p className="text-md">คำถาม</p>
              <p className="font-medium">
                {exam.question ? exam.question.length : ""}
              </p>
            </div>
            <div
              className="flex-col mx-2 bg-gray-50 rounded-xl py-3 px-5 text-center shadow-md"
              style={{ backgroundColor: "#DBD8AE" }}
            >
              <p className="text-md">ผู้เข้าสอบ</p>
              <p className="font-medium">{students ? students.length : ""}</p>
            </div>
            <div
              className="flex-col mx-2 bg-gray-50 rounded-xl py-3 px-5 text-center shadow-md"
              style={{ backgroundColor: "#DBD8AE" }}
            >
              <p className="text-md">คะแนนเฉลี่ย</p>
              <p className="font-medium">{students ? score_allstu/students.length : ""}</p>
            </div>
          </div>
        </div>
      </div>
      <TabContext value={value} className="w-4/5 mx-auto">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            className="w-4/5 mx-auto justify-between"
          >
            <Tab label="ผู้เข้าสอบ" value="1" />
            <Tab label="คำถาม" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className="w-11/12 mx-auto">
            <Table columns={columns} dataSource={students} rowKey="stu_code" />
          </div>
        </TabPanel>
        <TabPanel value="2">
          {/* <div className="w-4/5 mx-auto">
            {question ? (
              question.map((questions, index) => (
                <div
                  key={index}
                  className="shadow-sm bg-white rounded-md p-4 mb-3"
                >
                  <div className="flex my-auto items-center justify-between">
                    <div className="flex my-auto items-center">
                      <p>
                        {index + 1}. {questions.question}
                      </p>
                      <p className="p-2 bg-green-50 ml-2 rounded-xl max-w-lg truncate">
                        คะแนนเต็ม {questions.full_score}
                      </p>
                    </div>
                    <div className="bg-orange-100 rounded-lg px-5 py-1 text-center">
                      <PersonIcon />
                      <p className="m-0">มี {questions.replies.length} คน</p>
                    </div>
                  </div>
                  {questions.replies?questions.replies.map((reply,index)=>(
                  <div className="my-2 bg-gray-50 rounded-md p-2 flex justify-between" key={index}>
                    <div className="flex">
                    <p className="flex-1 w-40 truncate my-auto ">{reply.student.name}</p>
                    <p className="max-w-md truncate my-auto ml-5">{reply.answer_stu}</p>
                    </div>
                    <p className="max-w-md truncate my-auto ml-1 bg-green-100 rounded-md px-5">{reply.score_stu}คะแนน</p>
                  </div>
                  )):(<></>)}
                </div>
              ))
            ) : (
              <></>
            )}
          </div> */}
          <div className="w-11/12 mx-auto">
           <Table columns={columns_question} dataSource={question} rowKey="ques_id" />
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
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
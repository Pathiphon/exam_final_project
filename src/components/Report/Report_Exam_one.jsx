import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Table, Tag } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CssBaseline, Toolbar, Button, Divider } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import API_URL from "../../config/api";
import Stu_report_Modal from "./Stu_report_Modal";

export default function Report_Exam_one() {
  const { exam_id } = useParams();
  const [exam, setExam, examRef] = useState([]);
  const [exam_data, setExam_data] = useState([]);
  const [count_false, setCount_false] = useState([]);
  const [count_exam, setCount_exam] = useState([]);
  const [students, setStudents] = useState([]);
  const [stu_code, setStu_code] = useState(null);
  const [stu_ques_id, setStu_ques_id] = useState(null);
  const [stu_exam_id, setStu_exam_id] = useState(null);
  const [activeModalReport, setActiveModalReport] = useState(false);

    const handleClickReport = async (stu_code) => {
        setStu_code(stu_code);
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
    await API_URL.get(`api/reply/${exam_id}`)
      .then((res) => {
        setExam(res.data);
        console.log(examRef.current);

        // for (var j =0;j<data_table.length;j++){
        //   Object.assign(
        //     data_table[j],
        //     {question_num:data_table[j].question.length},
        //     {check_num:data_table[j].replies.length}
        //   )
        // }
        setExam_data(examRef.current.question);
        setCount_false(examRef.current.replies.length);
        setCount_exam(examRef.current.question.length);

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
        for (var j = 0; j < student.length; j++) {
          for (var i = 0; i < student[j].replies.length; i++) {
            sum_score += student[j].replies[i].score_stu;
          }
          Object.assign(student[j], { score_stu_full: sum_score });
          sum_score = 0;
        }
        console.log(student);
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
      title: <div className="header_table">ชื่อ - นามสกุล</div>,
      dataIndex: "name",
      width: "30%",
      render: (name) => <p className="text-base "> {name}</p>,
    },
    {
      title: <div className="header_table">รหัสนักศึกษา</div>,
      dataIndex: "stu_code",
      key: "stu_code",
      sorter: (a, b) => a.stu_code - b.stu_code,
      align: "center",
      render: (stu_code) => (
        <div>
          <p className="text-base my-auto">{stu_code}</p>
        </div>
      ),
    },
    {
      title: "คะแนน",
      dataIndex: "score_stu_full",
      align: "center",
      sorter: (a, b) => a.score_stu_full - b.score_stu_full,
      render: (score_stu_full) => (
        // <Tag color='green' ><p className="text-base font-bold my-auto text-black p-1">{score_stu_full}</p></Tag>
        <div className="bg-green-100 rounded-xl w-2/6 mx-auto">
          <p className="text-base font-bold my-auto text-black p-1">
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
          onClick={() => handleClickReport({stu_code})}
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
            <p className="max-w-xs text-xl truncate">{exam.name} </p>
          </div>
          <div className="md:flex  w-full md:w-3/6 justify-end">
            <div className="flex-col mx-2 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-md">คะแนนเต็ม</p>
              <p>{count_false}</p>
            </div>
            <div className="flex-col mx-2 bg-gray-50 rounded-xl px-5 py-3 text-center">
              <p className="text-md">คำถาม</p>
              <p>{count_exam}</p>
            </div>
            <div className="flex-col mx-2 bg-gray-50 rounded-xl py-3 px-5 text-center">
              <p className="text-md">ผู้เข้าสอบ</p>
              <p>1</p>
            </div>
          </div>
        </div>
      </div>
      <Divider
        className="mx-auto"
        sx={{
          my: 2,
          width: "88%",
          borderBottomWidth: 3,
          backgroundColor: "#000000",
        }}
      />
      <div className="w-4/5 mx-auto">
        <Table
          columns={columns}
          dataSource={students}
          rowKey="stu_code"
        />
      </div>
      {activeModalReport===true?<>
      <Stu_report_Modal
            active={activeModalReport}
            handleModalReport={handleModalReport}
            exam_id={stu_exam_id}
            stu_code={stu_code}
          />
          </>:<></>}
    </div>
  );
}

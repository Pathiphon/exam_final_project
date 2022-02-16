import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Table, Tag } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CssBaseline, Toolbar, Button, Divider } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import API_URL from "../../config/api";

const Manage_Reply = () => {
  const { exam_id } = useParams();
  const [exam, setExam, examRef] = useState([]);
  const [exam_data, setExam_data] = useState([]);
  const [question, setQuestion] = useState([]);

  let navigate = useNavigate();

  function handleClick_Back() {
    navigate("/Reply");
  }

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${exam_id}/allreply`)
      .then((res) => {
        const exam = res.data;
        const question = res.data.question;
        let sum_score = 0;
        let sum_score_stu = 0;
        let status_false = 0;
        let status_true = 0;
        let sum_status = 0;

        for (var j = 0; j < question.length; j++) {
          sum_score += question[j].full_score;
          for (var i = 0; i < question[j].replies.length; i++) {
            if (question[j].replies[i].check_status === true) {
              status_true += 1;
            } else {
              status_false += 1;
              sum_status += 1;
            }
            sum_score_stu += question[j].replies[i].score_stu;
          }
          Object.assign(
            question[j],
            { sum_scoreStu: sum_score_stu },
            { avg_question: sum_score_stu / question[j].replies.length },
            { status_false: status_false },
            { status_true: status_true }
          );
          status_false = 0;
          status_true = 0;
          sum_score_stu = 0;
        }
        Object.assign(
          exam,
          { question_sum_score: sum_score },
          { sum_status: sum_status }
        );
        setExam(exam);
        console.log(question);
        setQuestion(question);
        console.log(exam);

        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    get_Exam();
  }, []);

  const columns = [
    {
      title: <div>ข้อที่</div>,
      dataIndex: "",
      key: "",
      width: "8%",
      render: (ques_id, record, index) => (
        <div>
          <p className="text-base my-auto">{index + 1}</p>
        </div>
      ),
    },
    {
      title: <div className="header_table">คำถาม</div>,
      dataIndex: "question",
      width: "30%",
      render: (question, index) => <p className="text-base max-w-sm truncate"> {question}</p>,
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
      title: <div className="header_table">จำนวนที่ตรวจแล้ว</div>,
      dataIndex: "status_true",
      sorter: (a, b) => a.status_true - b.status_true,
      align: "center",
      render: (status_true) => (
        <Tag color="green">
          <p className="text-base my-auto font-semibold">{status_true}</p>
        </Tag>
      ),
    },
    {
      title: "จำนวนที่ต้องพิจารณา",
      dataIndex: "status_false",
      align: "center",
      sorter: (a, b) => a.status_false - b.status_false,
      render: (status_false) => (
        <Tag color="volcano">
          <p className="text-base my-auto font-semibold">{status_false}</p>
        </Tag>
      ),
    },
    {
      title: "การจัดการ",
      dataIndex: "ques_id",
      key: "ques_id",
      render: (ques_id) => (
        <Link to={`/${exam_id}/Manage_Reply/${ques_id}`}>
          <Button
            variant="outlined"
            color="success"
            size="large"
            startIcon={<ManageSearchIcon />}
          >
            ดูเพิ่มเติม
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="">
      <CssBaseline />
      <div
        className="shadow-zinc-500 flex justify-between items-center"
        style={{ background: "white" }}
      >
        <div>
          <Toolbar>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIosIcon />}
              style={{ fontSize: "18px" }}
              onClick={handleClick_Back}
            >
              {" "}
              ตรวจข้อสอบ
            </Button>
          </Toolbar>
        </div>
        <div className="items-center text-center bg-gray-500 text-white p-3 mx-2 rounded-md">
          <p className="text-lg my-auto">
            คะแนนเต็ม {exam ? exam.question_sum_score : ""} คะแนน{" "}
          </p>
        </div>
      </div>
      <div className="w-4/5 mx-auto shadow-md   bg-white rounded-xl">
        <div className="md:flex  items-center justify-between my-3 w-100 rounded-lg px-5 py-3">
          <div className="flex-col items-center w-full md:w-3/6 justify-center text-center">
            <p className="w-full text-xl">{exam.name} </p>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<EditIcon />}
              //   onClick={() => setActiveModal(true)}
            >
              แก้ไขข้อสอบ
            </Button>
          </div>
          <div className="md:flex  w-full md:w-3/6 justify-end">
            <div
              className="flex-col mx-2  rounded-xl p-3 text-center shadow-md"
              style={{ backgroundColor: "#F7DBA7" }}
            >
              <p className="text-md">จำนวนที่ต้องพิจารณา</p>
              <p className="font-medium">{exam ? exam.sum_status : ""}</p>
            </div>
            <div
              className="flex-col mx-2  rounded-xl px-5 py-3 text-center shadow-md"
              style={{ backgroundColor: "#F7DBA7" }}
            >
              <p className="text-md">คำถาม</p>
              <p className="font-medium">{question ? question.length : ""}</p>
            </div>
            <div
              className="flex-col mx-2  rounded-xl py-3 px-5 text-center shadow-md"
              style={{ backgroundColor: "#F7DBA7" }}
            >
              <p className="text-md">ผู้เข้าสอบ</p>
              <p className="font-medium">1</p>
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
      <div className="w-11/12 mx-auto">
        <p className="text-xl">คำถามทั้งหมด</p>
        <Table
          columns={columns}
          className="rounded-lg"
          dataSource={question}
          rowKey="ques_id"
        />
      </div>
    </div>
  );
};
export default Manage_Reply;

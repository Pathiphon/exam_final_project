import React, { useEffect } from "react";
import useState from "react-usestateref";
import dayjs from "dayjs";
import { Table, Tag,Spin } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CssBaseline, Toolbar, Button, Divider } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import API_URL from "../../config/api";

const Manage_Reply = () => {
  const { exam_id } = useParams();
  const [exam, setExam] = useState([]);
  const [students, setStudents] = useState(null);
  const [question, setQuestion] = useState([]);
  const [loading,setLoading] = useState(true);

  let navigate = useNavigate();

  function handleClick_Back() {
    navigate("/Reply");
  }
  const handleEdit_Exam = async (id) => {
    navigate("/Create_exam", { state: { id: id } });
  };

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
            {ques_index:j+1},
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
        setQuestion(question);

        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
      setLoading(false);
  };
  const get_Students = async () => {
    await API_URL.get(`api/student/${exam_id}`)
      .then((res) => {
        setStudents(res.data);    
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
      title: "??????????????????",
      dataIndex: "ques_index",
      width: "7%",
      align:'center',
      render: (ques_index) => (
          <p className="text-base my-auto">{ques_index}</p>
      ),
    },
    {
      title: "???????????????",
      dataIndex: "question",
      width: "40%",
      render: (question) => <p className="text-base  my-auto">{question}</p>,
    },
    {
      title: "???????????????????????????",
      dataIndex: "full_score",
      key: "full_score",
      sorter: (a, b) => a.full_score - b.full_score,
      align: "center",
      render: (full_score) => (
          <p className="text-base my-auto">{full_score}</p>
      ),
    },
    {
      title: "????????????????????????????????????????????????",
      dataIndex: "status_true",
      sorter: (a, b) => a.status_true - b.status_true,
      align: "center",
      render: (status_true) => (
        <Tag color="green" className="my-auto">
          <p className="text-base my-auto font-semibold">{status_true}</p>
        </Tag>
      ),
    },
    {
      title: "?????????????????????????????????????????????????????????",
      dataIndex: "status_false",
      align: "center",
      sorter: (a, b) => a.status_false - b.status_false,
      render: (status_false) => (
        <Tag color="volcano" className="my-auto">
          <p className="text-base my-auto font-semibold">{status_false}</p>
        </Tag>
      ),
    },
    {
      title: "???????????????????????????",
      dataIndex: "ques_id",
      key: "ques_id",
      render: (ques_id) => (
        <Link to={`/${exam_id}/Manage_Reply/${ques_id}`}>
          <Button
            variant="outlined"
            color="success"
            sx={{fontWeight:"bold"}}
            startIcon={<ManageSearchIcon/>}
          >
            ?????????????????????????????????
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="">
      <CssBaseline />
      <div
        className="shadow-zinc-500 flex justify-between items-center shadow-sm"
        style={{ background: "white" }}
      >
        <div>
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
              ??????????????????????????????
            </Button>
          </Toolbar>
        </div>
        <div className="items-center text-center bg-gray-500 text-white p-3 mx-2 rounded-md">
          <p className="text-lg my-auto">
            ??????????????????????????? {exam ? exam.question_sum_score : ""} ???????????????{" "}
          </p>
        </div>
      </div>
      <div className="w-4/5 mx-auto shadow-md   bg-white rounded-xl">
        <div className="md:flex  items-center justify-between my-3 w-100 rounded-lg px-5 py-3">
          <div className="flex-col items-center w-full md:w-3/6 justify-center text-center">
            <p className="w-full text-lg">{exam.name} </p>
            <p className="w-full text-xs">????????????????????? {dayjs(exam.date_pre).format("DD/MM/YYYY HH:mm")} ????????? {dayjs(exam.date_post).format("DD/MM/YYYY HH:mm")}</p>
            <Button
              variant="outlined"
              color="warning"
              className="shadow-md"
              startIcon={<EditIcon />}
              onClick={() => handleEdit_Exam(exam_id)}
            >
              ?????????????????????????????????
            </Button>
          </div>
          <div className="md:flex  w-full md:w-3/6 justify-end">
            <div
              className="flex-col mx-2  rounded-xl p-3 text-center shadow-md"
              style={{ backgroundColor: "#fff9c4" }}
            >
              <p className="text-md">?????????????????????????????????????????????????????????</p>
              <p className="font-medium">{exam ? exam.sum_status : ""}</p>
            </div>
            <div
              className="flex-col mx-2  rounded-xl px-5 py-3 text-center shadow-md"
              style={{ backgroundColor: "#fff9c4" }}
            >
              <p className="text-md">???????????????</p>
              <p className="font-medium">{question ? question.length : ""}</p>
            </div>
            <div
              className="flex-col mx-2  rounded-xl py-3 px-5 text-center shadow-md"
              style={{ backgroundColor: "#fff9c4" }}
            >
              <p className="text-md">??????????????????????????????</p>
              <p className="font-medium">{students?students.length:''}</p>
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
        <p className="text-xl">????????????????????????????????????</p>
        <Table
        size="middle"
          columns={columns}
          className="rounded-lg"
          dataSource={question}
          rowKey="ques_id"
          loading={{ indicator: <div><Spin size="large" /></div>, spinning:loading}}
        />
      </div>
    </div>
  );
};
export default Manage_Reply;

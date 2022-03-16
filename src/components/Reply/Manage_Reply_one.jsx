/* eslint-disable react/jsx-pascal-case */
import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Table, Tag, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import EditRoadIcon from "@mui/icons-material/EditRoad";
import Table_Ans from "../Table_Ans";
import {
  CssBaseline,
  Toolbar,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import API_URL from "../../config/api";
import Stu_Modal from "./Stu_Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Toast from "../Toast/Toast.js";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const Manage_Reply_one = () => {
  const { ques_id, exam_id } = useParams();
  const [exam_data, setExam_data] = useState(null);
  const [exam, setExam] = useState(null);
  const [stu_code, setStu_code] = useState(null);
  const [stu_ques_id, setStu_ques_id] = useState(null);
  const [stu_exam_id, setStu_exam_id] = useState(null);
  const [activeModalStu, setActiveModalStu] = useState(false);
  const [activeModalAns, setActiveModalAns] = useState(false);
  const [alreadySelecteRows, setAlreadySelecteRows] = useState([]);
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(true);
  const [add_ans, setAdd_ans] = useState(false);
  let navigate = useNavigate();

  function handleClick_Back() {
    navigate(`/${exam_id}/Manage_Reply`);
  }
  const handleClickStu = async (stu) => {
    setStu_code(stu.stu.stu_code);
    setStu_exam_id(stu.stu.exam_id);
    setStu_ques_id(stu.stu.ques_id);

    setActiveModalStu(true);
  };
  const handleModalStu = async () => {
    get_Exam();
    setActiveModalStu(!activeModalStu);
    setStu_code(null);
    setStu_exam_id(null);
    setStu_ques_id(null);
  };

  const handleModalAns = async () => {
    setActiveModalAns(!activeModalAns);
  };
  const handleClickAns = () => {
    setActiveModalAns(true);
  };

  const handleUpdateReply = async (e) => {
    e.preventDefault();
    const list_select = alreadySelecteRows.list_Selectstu;
    try {
      for (var j in list_select) {
        await API_URL.put(
          `api/reply/${exam_id}/question/${list_select[j].ques_id}/stu/${list_select[j].stu_code}`,
          {
            score_stu: score,
            check_status: true,
            add_ans: add_ans,
            answer: list_select[j].answer_stu,
          }
        );
      }
      Toast.fire({
        icon: "success",
        title: "บันทึกคะแนนเสร็จสิ้น",
      });
      setAlreadySelecteRows({ list_Selectstu: 0 });
      setAdd_ans(false);
      setScore("");
      get_Exam();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "มีข้อผิดพลาดในการแก้ไข",
      });
    }
  };

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${exam_id}/question/${ques_id}`)
      .then(async (res) => {
        setExam(res.data);
        const student = res.data.question[0].students;
        for (var j = 0; j < student.length; j++) {
          let score = 0;
          await API_URL.get(`api/answer/${student[j].replies[0].ans_id}`)
            .then((res) => {
              score = res.data.score;
            })
            .catch(() => {
              score = 0;
            });
          Object.assign(
            student[j],
            student[j].replies[0],
            { persent_score: score },
            {
              key: (j + 1).toString(),
            }
          );
          delete student[j]["replies"];
        }
        setExam_data(student);

        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    get_Exam();
  }, []);

  const columns = [
    {
      title: <div>ชื่อ - นามสกุล</div>,
      dataIndex: "name",
      width: "10%",
      render: (name) => <p className="text-base truncate">{name}</p>,
    },
    {
      title: <div>คำตอบ</div>,
      dataIndex: "answer_stu",
      render: (answer_stu, stu) => (
        <div className="flex items-start justify-between">
          {" "}
          <p className="max-w-lg mr-3">{answer_stu}</p>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleClickStu({ stu })}
          >
            ดูเพิ่มเติม
          </Button>
        </div>
      ),
    },
    {
      title: "%ความเหมือน ( คะแนน )",
      dataIndex: "persent_get",
      align: "center",
      width: "18%",
      sorter: (a, b) => a.persent_get - b.persent_get,
      render: (text, record) => (
        <div className="flex items-center justify-center my-auto">
          <p className="text-base truncate max-w-name my-auto">
            {text}% ( {record.persent_score} ){" "}
          </p>
        </div>
      ),
    },
    {
      title: "คะแนน",
      dataIndex: "score_stu",
      align: "center",
      width: "7%",
      sorter: (a, b) => a.score_stu - b.score_stu,
      defaultSortOrder: "ascend",
      render: (score_stu) => (
        <Tag color="orange" className="my-auto">
          <p className="text-base text-black font-semibold my-auto px-2">
            {" "}
            {score_stu}
          </p>
        </Tag>
      ),
    },
    {
      title: "การตรวจ",
      dataIndex: "check_status",
      width: "10%",
      render: (check_status) => (
        <>
          {check_status ? (
            <div className="flex">
              <CheckCircleIcon
                fontSize="small"
                className="m-1 text-green-600"
              />
              <p className="text-green-600 my-auto">ตรวจแล้ว</p>
            </div>
          ) : (
            <div className="flex">
              <CancelIcon fontSize="small" className="m-1 text-red-600" />
              <p className="text-red-600 my-auto">ยังไม่ได้ตรวจ</p>
            </div>
          )}
        </>
      ),
      filters:[
        {text:'ตรวจแล้ว',value:true},
        {text:'ยังไม่ได้ตรวจ',value:false},
      ],
      onFilter:(value, record)=>{
        return record.check_status ===value
      }
    },
  ];

  return (
    <div>
      {ques_id ? (
        <div>
          <Table_Ans
            active={activeModalAns}
            handleModalAns={handleModalAns}
            ques_id={ques_id}
            full_score={exam ? exam.question[0].full_score : ""}
          />
        </div>
      ) : (
        <></>
      )}
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
              className="shadow-md"
              startIcon={<ArrowBackIosIcon />}
              style={{ fontSize: "18px" }}
              onClick={handleClick_Back}
            >
              {" "}
              พิจารณาข้อสอบ
            </Button>
          </Toolbar>
        </div>
        <div className="flex">
          <div className="items-center text-center bg-gray-100 text-white p-2 mx-2 rounded-md my-auto">
            <p className="text-base my-auto text-black">
              ตรวจอัตโนมัติที่ {exam ? exam.question[0].persent_checking : ""} %{" "}
            </p>
          </div>
          <div className="items-center text-center bg-gray-500 text-white p-3 mx-2 rounded-md">
            <p className="text-lg my-auto">
              คะแนนเต็ม {exam ? exam.question[0].full_score : ""} คะแนน{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-600 px-20 py-16">
        <p className="text-2xl mx-10 px-20 text-white">
          คำถาม : {exam ? exam.question[0].question : ""}
        </p>
      </div>
      <div className="w-11/12 mx-auto ">
        <Table
          size="middle"
          className="-mt-14 custom"
          rowSelection={{
            type: "checkbox",
            selectedRows: alreadySelecteRows,
            onChange: (keys, selectedRows) => {
              setAlreadySelecteRows({ list_Selectstu: selectedRows });
              console.log(alreadySelecteRows);
            },
          }}
          columns={columns}
          dataSource={exam_data}
          loading={{
            indicator: (
              <div>
                <Spin size="large" />
              </div>
            ),
            spinning: loading,
          }}
          title={() => (
            <form
              className="w-6/6 flex justify-between"
              onSubmit={handleUpdateReply}
            >
              <div className="justify-start">
                <Button
                  sx={{ whiteSpace: "nowrap", ml: 1 }}
                  variant="contained"
                  color="secondary"
                  className="shadow-md"
                  size="large"
                  startIcon={<EditRoadIcon fontSize="large" />}
                  onClick={handleClickAns}
                >
                  จัดการเฉลย
                </Button>
              </div>
              <div className="flex  items-center justify-end w-10/12">
                <div className="flex flex-wrap items-center w-2/6">
                  <DriveFileRenameOutlineIcon fontSize="large" />
                  <div className="w-full flex-auto md:w-1/2 px-3">
                    <input
                      value={score || ""}
                      onChange={(e) => setScore(e.target.value)}
                      required
                      className="appearance-none shadow-md block w-full bg-white text-black border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
                      placeholder="ป้อนคะแนน...."
                      type="number"
                      step="any"
                      min={0}
                      max={exam ? exam.question[0].full_score : 500}
                    />
                  </div>
                </div>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={add_ans}
                        onClick={() => setAdd_ans(!add_ans)}
                      />
                    }
                    label="นำคำตอบเพิ่มลงเฉลย"
                  />
                </FormGroup>
                {alreadySelecteRows.list_Selectstu ? (
                  alreadySelecteRows.list_Selectstu.length !== 0 ? (
                    <Button
                      className="mr-4"
                      color="success"
                      variant="contained"
                      type="submit"
                      sx={{ borderRadius: "7px" }}
                      style={{
                        fontSize: "18px",
                        maxWidth: "100px",
                        maxHeight: "30px",
                        minWidth: "140px",
                        minHeight: "40px",
                      }}
                    >
                      ให้คะแนน
                    </Button>
                  ) : (
                    <Button
                      className="mr-4"
                      color="success"
                      variant="contained"
                      type="submit"
                      sx={{ borderRadius: "7px" }}
                      style={{
                        fontSize: "18px",
                        maxWidth: "100px",
                        maxHeight: "30px",
                        minWidth: "140px",
                        minHeight: "40px",
                      }}
                      disabled
                    >
                      ให้คะแนน
                    </Button>
                  )
                ) : (
                  <Button
                    className="mr-4"
                    color="success"
                    variant="contained"
                    type="submit"
                    sx={{ borderRadius: "7px" }}
                    style={{
                      fontSize: "18px",
                      maxWidth: "100px",
                      maxHeight: "30px",
                      minWidth: "140px",
                      minHeight: "40px",
                    }}
                    disabled
                  >
                    ให้คะแนน
                  </Button>
                )}
              </div>
            </form>
          )}
        />
      </div>
      {activeModalStu === true ? (
        <>
          <Stu_Modal
            active={activeModalStu}
            handleModalStu={handleModalStu}
            ques_id={stu_ques_id}
            exam_id={stu_exam_id}
            stu_code={stu_code}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Manage_Reply_one;

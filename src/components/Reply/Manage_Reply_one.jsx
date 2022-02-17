/* eslint-disable react/jsx-pascal-case */
import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Table, Tag } from "antd";
import { useParams, useNavigate } from "react-router-dom";
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
  const [alreadySelecteRows, setAlreadySelecteRows] = useState([]);
  const [score, setScore] = useState(0);
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
  const handleUpdateReply = async (e) => {
    e.preventDefault();
    const list_select = alreadySelecteRows.list_Selectstu;
    console.log(list_select);
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
      .then((res) => {
        setExam(res.data);
        const student = res.data.question[0].student;
        console.log(student);
        for (var j = 0; j < student.length; j++) {
          Object.assign(student[j], student[j].reply, {
            key: (j + 1).toString(),
          });
          delete student[j]["reply"];
        }
        console.log(student);
        setExam_data(student);

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
      title: <div>ชื่อ - นามสกุล</div>,
      dataIndex: "name",
      render: (name) => <p className="text-base truncate max-w-name">{name}</p>,
    },
    {
      title: <div>คำตอบ</div>,
      dataIndex: "answer_stu",
      render: (answer_stu, stu) => (
        <div className="flex items-center">
          {" "}
          <p className="truncate max-w-xs my-auto mr-3">{answer_stu}</p>
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
      title: "เปอร์เซ็นความถูกต้อง",
      dataIndex: "persent_get",
    },
    {
      title: "คะแนน",
      dataIndex: "score_stu",
      align: "center",
      sorter: (a, b) => a.score_stu - b.score_stu,
      render: (score_stu) => (
        <Tag color="green">
          <p className="text-base text-black font-semibold my-auto">
            {" "}
            {score_stu}
          </p>
        </Tag>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "check_status",
      sorter: (c, d) => c.check_status - d.check_status,
      defaultSortOrder: "ascend",
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
    },
  ];

  return (
    <div>
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
              พิจารณาข้อสอบ
            </Button>
          </Toolbar>
        </div>
        <div className="items-center text-center bg-gray-500 text-white p-3 mx-2 rounded-md">
          <p className="text-lg my-auto">
            คะแนนเต็ม {exam ? exam.question[0].full_score : ""} คะแนน{" "}
          </p>
        </div>
      </div>
      <div className="bg-gray-600 px-20 py-16">
        <p className="text-2xl mx-10 px-20 text-white">
          คำถาม : {exam ? exam.question[0].question : ""}
        </p>
      </div>
      <div className="w-4/5 mx-auto ">
        <Table
          className="-mt-14 custom"
          rowSelection={{
            type: "checkbox",
            selectedRows: alreadySelecteRows,
            onChange: (keys, selectedRows) => {
              setAlreadySelecteRows({ list_Selectstu: selectedRows });
            },
          }}
          columns={columns}
          dataSource={exam_data}
          title={() => (
            <form className="w-6/6 justify-end" onSubmit={handleUpdateReply}>
              <div className="flex  items-center justify-end">
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

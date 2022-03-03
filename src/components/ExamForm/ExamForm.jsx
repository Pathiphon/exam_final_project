import React, { useEffect } from "react";
import useState from "react-usestateref";
import { useParams, useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { add } from "date-fns";
import API_URL from "../../config/api";
import { useTicker } from "./useTicker";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Divider,
  TextareaAutosize,
  Box,
  Container,
} from "@mui/material";

let futureDate = add(new Date(), {
  days: 0,
  hours: 0,
  minutes: 10,
  seconds: 10,
});

export default function ExamForm() {
  const [All_question, setAll_question] = useState(null);
  const { exam_id } = useParams();
  const [exam_name, setExam_name] = useState(null);
  const [date_pre, setDate_pre] = React.useState("");
  const [date_start, setDate_start] = useState("");
  const [time_start, setTime_start] = useState("");
  const [date_post, setDate_post] = useState("");
  const [inputField, setInputField] = React.useState([]);
  const [stuCode, setStuCode] = useState("");
  const [name, setName] = useState("");
  var [check_start, setCheck_start] = useState(null);
  var [check_end, setCheck_end] = useState(null);
  let navigate = useNavigate();

  var buddhistEra = require("dayjs/plugin/buddhistEra");
  dayjs.extend(buddhistEra);

  const { days, hours, minutes, seconds, isTimeUp } = useTicker(futureDate);

  const tickerContents = isTimeUp ? (
    <p className="bg-gray-200 my-auto appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
      หมดเวลาสอบ
    </p>
  ) : (
    <>
      <p className="bg-gray-200 my-2 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
        {days !== 0 ? `${days} วัน ` : ""}
        {hours} ชั่วโมง {minutes} นาที {seconds} วินาที
      </p>
    </>
  );

  const handleChangeInput = (ques_id, e) => {
    const newInputFields = inputField.map((i) => {
      if (ques_id === i.ques_id) {
        i[e.target.name] = e.target.value;
      }
      return i;
    });
    setInputField(newInputFields);
  };
  const get_Exam = async () => {
    await API_URL.get(`api/exam/${exam_id}`)
      .then((res) => {
        const data = res.data;
        setExam_name(data.name);
        setDate_pre(dayjs(data.date_pre).format("DD/MM/BBBB HH:mm"));
        setDate_post(dayjs(data.date_post).format("DD/MM/BBBB HH:mm"));
        setDate_start(dayjs(data.date_pre).format("DD/MM/BBBB"));
        setTime_start(dayjs(data.date_pre).format("HH:mm"));
        const date1 = dayjs(data.date_pre);
        const date2 = dayjs();
        const date3 = dayjs(data.date_post);
        const start = date2.diff(date1, "m", true);

        setCheck_start(start);
        setCheck_end(date3.diff(date2, "m", true));
        var day_diff = date3.diff(date2, "day", true);
        var day = Math.floor(day_diff);
        var hour = Math.floor((day_diff - day) * 24);
        var hour2 = date3.diff(date2, "h", true);
        var minute = Math.floor((hour2 - hour) * 60);
        var min = date3.diff(date2, "m", true);
        var int_part = Math.trunc(min);
        var float_part = Number((min - int_part).toFixed(2) * 60);
        futureDate = add(new Date(), {
          days: day,
          hours: hour,
          minutes: minute,
          seconds: float_part,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const get_Question = async () => {
    await API_URL.get(`api/question/${exam_id}/all`)
      .then((res) => {
        if (res.data) {
          const data = res.data;
          setAll_question(data.question);
          for (let item of data.question) {
            setInputField((prevState) => [
              ...prevState,
              {
                ques_id: item.ques_id,
              },
            ]);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const get_Student = async () => {
    setName("");
    try {
      await API_URL.get(`api/student/${stuCode}/checkdup/stu`).then((res) => {
        setName(res.data.name);
      });
      await API_URL.get(`api/student/${exam_id}/${stuCode}/checkdup/exam`).then(
        (res) => {
          if (res.data.count > 0) {
            alert("คุณเคยสอบข้อสอบนี้แล้ว");
            window.location.reload();
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    get_Exam();
    if (stuCode.length === 9) {
      get_Student();
    }
    if (All_question === null) {
      get_Question();
    }
    if (isTimeUp && stuCode.length === 9) {
      let timerInterval;
      Swal.fire({
        title: "หมดเวลาสอบ!",
        html: "กำลังส่งคำตอบของคุณ.",
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then(() => {
        if (stuCode.length === 9) {
          CreateReply();
        } else {
          navigate("/ExamForm_Finish", { state: { name: exam_name } });
          window.location.reload();
        }
      });
    } else if (isTimeUp) {
      navigate("/ExamForm_Finish");
      window.location.reload();
    }
  }, [isTimeUp, stuCode.length === 9]);

  const CreateReply = async () => {
    let aws = inputField;
    let answerLength = 0;
    for ( var j = 0; j < aws.length; j++) {
      answerLength = aws[j].answer_stu?aws[j].answer_stu.length:0;
      if(answerLength===0){
        aws.splice(j,1)
        j--;
      }else{
        Object.assign(
          aws[j],
          { name: name },
          { stu_code: stuCode },
          { exam_id: exam_id },
          { ans_id: null },
          { score_stu: 0 },
          { persent_get: 0 },
          { check_status: false }
        );
      }
        answerLength = 0;
    }
    await API_URL.post(`api/reply`, aws)
      .then((res) => {
        setAll_question(null);
        setInputField("");
        setName("");
        setStuCode("");
        navigate("/ExamForm_Finish", { state: { name: exam_name } });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "ยืนยันที่จะส่งคำตอบ",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ส่งคำตอบ",
    }).then((result) => {
      if (result.isConfirmed) {
        CreateReply();
      }
    });
  };

  return (
    <div>
      <CssBaseline />

      <AppBar
        style={{ background: "#2E303B" }}
        sx={{ p: 0.5, justifyContent: "center" }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AssignmentIcon className="mr-2" />
            <Typography variant="h6" className="text-white">
              ฟอร์มสอบ
            </Typography>
          </div>
          {check_start > 0 ? (
            <div className="md:flex md:items-center my-auto">
              <p className=" text-white font-bold md:text-right mb-1 md:mb-0 pr-4 my-auto">
                เหลือเวลาอีก
              </p>
              <div className="my-auto">{tickerContents}</div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </AppBar>
      <Toolbar />
      <Container maxWidth="md" className="mt-10 sx:mt-0">
        <Box sx={{ my: 2 }}>
          {check_start <= 0 ? (
            <div className="bg-gray-200 px-8 py-3 text-center rounded-xl mt-4">
              <p className="bg-stone-50 p-2 rounded-md text-3xl m-3 truncate w-full">
                {exam_name}
              </p>
              <p className="text-xl m-2">
                เริ่มทำข้อสอบได้ในวันที่ {date_start ? date_start : ""}
              </p>
              <p className="text-xl m-2">เวลา {time_start ? time_start : ""}</p>
              <Divider className="text-xl m-2">ถึง</Divider>
              <p className="text-xl m-2">วันที่ {date_post ? date_post : ""}</p>
            </div>
          ) : check_start > 0 && check_end > 0 ? (
            <form className="w-full sm:mt-10" onSubmit={handleSubmit}>
              <div>
                <p className="text-2xl">{exam_name ? exam_name : <>...</>}</p>
                <p className="text-base mt-2">
                  เวลาสอบ {date_pre ? date_pre : <>...</>} ถึง{" "}
                  {date_post ? date_post : <>...</>}
                </p>
              </div>

              <div className="bg-gray-200 px-8 py-3  rounded-xl mt-4">
                <div className="flex flex-wrap -mx-3 mb-3">
                  <div className="w-full md:w-2/6 px-3 ">
                    <label className="block uppercase tracking-wide text-gray-700 text-base mb-1">
                      รหัสนักศึกษา
                    </label>
                    <input
                      className="bg-white appearance-none border-2 border-gray-200 rounded-lg w-100  py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-600"
                      min="111111111"
                      max="999999999"
                      type="number"
                      placeholder="รหัสนักศึกษา"
                      value={stuCode}
                      onChange={(e) => setStuCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-3">
                  <div className="w-full md:w-4/6 px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-base mb-1">
                      ชื่อ - นามสกุล
                    </label>
                    <input
                      className=" bg-white appearance-none border-2 border-gray-200 rounded-lg w-100 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-600"
                      maxLength="100"
                      placeholder="ชื่อ - นามสกุล"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <Divider
                sx={{ my: 2, borderBottomWidth: 5, backgroundColor: "#000000" }}
              />
              {All_question &&
                stuCode.length === 9 &&
                All_question.map((All_questions, index) => (
                  <div
                    key={All_questions.ques_id}
                    className="bg-gray-200 px-8 py-3 rounded-xl mt-4 mb-4"
                  >
                    <div className="flex flex-wrap -mx-3 mb-3">
                      <div className="w-full px-3">
                        <label
                          htmlFor={`${All_questions.ques_id}`}
                          className="block uppercase tracking-wide text-gray-700 text-lg mb-3"
                        >
                          ข้อ {index + 1}. {All_questions.question}
                        </label>
                        <TextareaAutosize
                          id={`${All_questions.ques_id}`}
                          name="answer_stu"
                          // value={inputField[All_questions.ques_id]}
                          onChange={(e) => {
                            handleChangeInput(All_questions.ques_id, e);
                          }}
                          className=" bg-white appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              {stuCode.length === 9 ? (
                <div className="flex items-center justify-around mt-6">
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-20 rounded-lg focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    ส่งคำตอบ
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-2xl text-red-700">
                    ป้อนรหัสนักศึกษาก่อนทำข้อสอบ
                  </p>
                </>
              )}
            </form>
          ) : (
            <></>
          )}
        </Box>
      </Container>
    </div>
  );
}

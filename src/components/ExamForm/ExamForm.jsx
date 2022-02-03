import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import API_URL from "../../config/api";
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

export default function ExamForm() {
  const [All_question, setAll_question] = useState(null);
  const { exam_id } = useParams();
  const [exam_name, setExam_name] = useState(null);
  const [date_pre, setDate_pre] = useState("");
  const [date_post, setDate_post] = useState("");
  const [inputField, setInputField] = useState([]);
  const [stuCode, setStuCode] = useState("");
  const [name, setName] = useState("");
  // const date1 =dayjs('');
  // const date2 = dayjs('');

  var buddhistEra = require("dayjs/plugin/buddhistEra");
  dayjs.extend(buddhistEra);

  const handleCreateReply = async (e) => {
    e.preventDefault();
    await API_URL.post(`api/reply/${exam_id}`, {
      inputField
    })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        const date1 = dayjs(data.date_pre)
        const date2 = dayjs(data.date_post)
       
        // console.log( date2.diff(date1,'m',true));
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
            // console.log(item.ques_id);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    get_Question();
    get_Exam();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (stuCode.length !== 9 || name.length <= 0) {
    //   console.log("ผิด");
    // } else {
    //   let timerInterval;
    //   Swal.fire({
    //     title: "กำลังส่งคำตอบ",
    //     html: "I will close in <b></b> milliseconds.",
    //     timer: 2000,
    //     timerProgressBar: true,
    //     didOpen: () => {
    //       Swal.showLoading();
    //       const b = Swal.getHtmlContainer().querySelector("b");
    //       timerInterval = setInterval(() => {
    //         b.textContent = Swal.getTimerLeft();
    //       }, 100);
    //     },
    //     willClose: () => {
    //       clearInterval(timerInterval);
    //     },
    //   }).then((result) => {
    //     /* Read more about handling dismissals below */
    //     if (result.dismiss === Swal.DismissReason.timer) {
    //       console.log("I was closed by the timer");
    //     }
    //   });

    // }
    // console.log("inputFields", inputField);
    // console.log(inputField);
    // const aws = [{ stu_code: stuCode }, { name: name }, ...inputField];
    const aws = inputField
    for(var j =0;j<aws.length;j++){
      Object.assign(aws[j],{name:name},{stu_code:stuCode},{exam_id:exam_id})
    }
    
    // console.log(aws);
    // let MergeData =[]

    // for(const [key,value] of Object.entries(aws)){
    //   MergeData.push({
    //     "ques_id":aws.ques_id,
    //     "answer_stu":aws.answer_stu,
    //     "stu_code":stuCode,
    //     "name" : name,
    //     [key]:value
    //   })
    // }
    // console.log(MergeData);

    // for (var n =0;n<aws.length;n++){
      await API_URL.post(`api/reply`, aws)
      .then((res) => {
        // return res.data
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // }
    
    
  };

  return (
    <div>
      <CssBaseline />
      <AppBar
        style={{ background: "#2E303B" }}
        sx={{ p: 1, justifyContent: "center" }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AssignmentIcon className="mr-2" />
            <Typography variant="h6">ฟอร์มสอบ</Typography>
          </div>
          <div className="md:flex md:items-center ">
            <div className="md:w-1/3">
              <label className="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4">
                เหลือเวลาอีก
              </label>
            </div>
            <div className="">
              <input
                value="10/50"
                disabled
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </AppBar>
      <Toolbar />
      <Container maxWidth="md">
        <Box sx={{ my: 2 }}>
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
                    // min="111111111"
                    // max="999999999"
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
                        // name={`${All_questions.ques_id}`}
                        name="answer_stu"
                        value={inputField[All_questions.ques_id]}
                        onChange={(e) => {
                          handleChangeInput(All_questions.ques_id, e);
                        }}
                        className=" bg-white appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            <div className="flex items-center justify-around mt-6">
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-20 rounded-lg focus:outline-none focus:shadow-outline"
                type="submit"
              >
                ส่งคำตอบ
              </button>
            </div>
          </form>
        </Box>
      </Container>
    </div>
  );
}

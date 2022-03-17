import React, { useEffect } from "react";
import useState from "react-usestateref";
import Toast from "../Toast/Toast.js";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Divider,
} from "@mui/material";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import API_URL from "../../config/api";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import NumbersIcon from "@mui/icons-material/Numbers";

export default function Stu_Modal({
  active,
  handleModalStu,
  exam_id,
  stu_code,
  ques_id,
}) {
  const [exam, setExam] = useState(null);
  const [exam_data, setExam_data] = useState(null);
  const [score, setScore] = useState(0);

  const [add_ans, setAdd_ans] = useState(false);

  const get_Exam = async () => {
    await API_URL.get(
      `api/reply/${exam_id}/question/${ques_id}/stu/${stu_code}`
    )
      .then(async (res) => {
        setExam(res.data);
        const student = res.data.question[0].students[0];
        if (student != null) {
          // await API_URL.get(`api/answer/${student.replies.ans_id}`)
          //   .then((res) => {
          //     score = res.data.score;
          //     answer = res.data.answer;
          //   })
          //   .catch(() => {
          //     score = 0;
          //     answer = "";
          //   });
          Object.assign(
            student,
            student.replies[0],
            student.replies[0].answer,
            // student.answer,
            // { persent_score: score },
            // { answer: answer }
          );
          delete student["replies"];
          // delete student["answer"];
          setExam_data(student);
          setScore(student.score_stu);
        }

        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (exam === null) {
      get_Exam();
    }
  }, [exam]);

  const handleUpdateReply = async (e) => {
    e.preventDefault();
    await API_URL.put(
      `api/reply/${exam_id}/question/${ques_id}/stu/${stu_code}`,
      {
        score_stu: score,
        check_status: true,
        add_ans: add_ans,
        answer: exam_data.answer_stu,
      }
    )
      .then((res) => {
        handleModalStu();
        Toast.fire({
          icon: "success",
          title: "บันทึกคะแนนเสร็จสิ้น",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalStu}></div>
      <div className="modal-card w-5/6">
        <header className="modal-card-head text-left justify-between">
          <p className=" text-lg my-auto ">
            คำถาม : {exam ? exam.question[0].question : ""}
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalStu}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="flex mb-1 items-center">
            <p className="text-lg text-gray-500 mx-2">ชื่อ - นามสกุล</p>
            <p className="text-xl text-back mx-2">
             {exam_data ? exam_data.name : ""}
            </p>
            <p className="text-lg text-gray-500 ml-10">รหัสนักศึกษา</p>
            <p className="text-xl text-back mx-2">
             {exam_data?exam_data.stu_code:''} 
            </p>
          
          </div>
          <div className="flex mb-5 items-center">
            <p className="text-lg text-gray-500 mx-2 my-auto">สถานะ</p>
            {exam_data ? (
              exam_data.check_status === true ? (
                <div className="flex">
                  <CheckCircleIcon
                    fontSize="small"
                    className="m-1 text-green-600"
                  />
                  <p className="text-xl text-green-600 font-bold mx-2 my-auto">
                    ตรวจแล้ว
                  </p>
                </div>
              ) : (
                <div className="flex">
                  <CancelIcon fontSize="small" className="m-1 text-red-600" />
                  <p className="text-xl text-red-600 font-bold mx-2 my-auto">
                    ยังไม่ได้ตรวจ
                  </p>
                </div>
              )
            ) : (
              ""
            )}
          </div>
          <div className="flex mb-2 ">
            <p className="text-lg text-gray-500 mx-2">คำตอบ</p>
            <div className="w-5/6 rounded-xl bg-white border-slate-200 border-1">
              <p className="text-xl text-back mx-2 p-4">
                {exam_data ? exam_data.answer_stu : "-"}
              </p>
            </div>
          </div>
          <Divider
            sx={{ m: 2, borderBottomWidth: 2, backgroundColor: "#000000" }}
          />
          <div className="flex p-2 w-full">
            <div className="flex  m-2">
              <div className="text-center bg-white p-2 rounded-md shadow-md">
                <DataUsageIcon className="mx-auto" fontSize="large" />
                <p className="mx-auto mt-3">เปอร์เซ็นความถูกต้อง</p>
                <p className="text-lg text-slate-900 font-semibold">
                  {exam_data ? exam_data.persent_get : 0} %
                </p>
              </div>
            </div>
            <div className="flex m-2 ">
              <div className="text-center bg-white py-2 px-7 rounded-md shadow-md">
                <NumbersIcon className="mx-auto" fontSize="large" />
                <p className="mx-auto mt-3">คะแนน</p>
                <p className="text-lg text-slate-900 font-semibold">
                  {exam_data ? exam_data.score : "-"}
                </p>
              </div>
            </div>
            <div className="flex-1 m-2 ">
              <div className="text-left bg-white py-2 px-7 rounded-md shadow-md w-full">
                <FeedbackIcon fontSize="large" />
                <p className="mt-3">เฉลย</p>
                <p className="mt-5 w-full text-lg">
                  {exam_data ? exam_data.answer : "-"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="modal-card-foot justify-end ">
          <form className="w-5/6" onSubmit={handleUpdateReply}>
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
                    step="any"
                    min={0}
                    max={exam ? exam.question[0].full_score : 500}
                    // max ={2}
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
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}

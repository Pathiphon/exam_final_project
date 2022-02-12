import React, { useEffect } from "react";
import useState from "react-usestateref";
import Toast from "../Toast/Toast.js"
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import API_URL from "../../config/api";

export default function Stu_Modal({
  active,
  handleModalStu,
  exam_id,
  stu_code,
  ques_id,
}) {
  const [exam, setExam, examRef] = useState(null);
  const [exam_data, setExam_data, exam_dataRef] = useState(null);
  const [score,setScore] = useState(0);
  const [add_ans,setAdd_ans] = useState(false);

  const get_Exam = async () => {
    await API_URL.get(
      `api/reply/${exam_id}/question/${ques_id}/stu/${stu_code}`
    )
      .then((res) => {
        setExam(res.data);
        console.log(examRef.current);
        const student = res.data.question[0].student;
        if (student != null) {
          for (var j = 0; j < student.length; j++) {
            Object.assign(student[j], student[j].reply, {
              key: student[j].reply.stu_code,
            });
          }
          setExam_data(student);
          setScore(student[0].score_stu)
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
    await API_URL.put(`api/reply/${exam_id}/question/${ques_id}/stu/${stu_code}`, {
      score_stu: score,
      check_status: true,
      add_ans:add_ans,
      answer:exam_data[0].answer_stu,
    })
      .then((res) => {
        handleModalStu();
        Toast.fire({
          icon: 'success',
          title: 'บันทึกคะแนนเสร็จสิ้น'
        })
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
          <div className="flex mb-2 items-center">
            <p className="text-base text-gray-500 mx-2">ชื่อ - นามสกุล</p>
            <p className="text-lg text-back mx-2">
              {exam_data ? exam_data[0].name : ""}
            </p>
          </div>
          <div className="flex mb-2 items-center">
            <p className="text-base text-gray-500 mx-2">สถานะ</p>
            {exam_data ? (
              exam_data[0].check_status === true ? (
                <p className="text-base text-green-600 font-bold mx-2">
                  ตรวจแล้ว
                </p>
              ) : (
                <p className="text-base text-red-700 font-bold mx-2">
                  ยังไม่ได้ตรวจ
                </p>
              )
            ) : (
              ""
            )}
          </div>
          <div className="flex mb-2 ">
            <p className="text-base text-gray-500 mx-2">คำตอบ</p>
            <div className="w-5/6 rounded-xl border-2 border-slate-300">
            <p className="text-lg text-back mx-2  p-4">
              {exam_data ? exam_data[0].answer_stu : "-"}
            </p>
            </div>
          </div>
        </section>

        <footer className="modal-card-foot justify-end ">
          <form className="w-5/6" onSubmit={handleUpdateReply}>
            <div className="flex  items-center justify-end">
              <FormGroup >
                <FormControlLabel
                  control={<Checkbox checked={add_ans} onClick={()=>setAdd_ans(!add_ans)} />}
                  label="นำคำตอบเพิ่มลงเฉลย"
                />
              </FormGroup>
              <div className="flex flex-wrap items-center w-2/6">
                <div className="w-full flex-auto md:w-1/2 px-3">
                  <input
                    value={score||""}
                    onChange={(e) => setScore(e.target.value)}
                    required
                    className="appearance-none shadow-md block w-full bg-white text-black border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
                    placeholder="ป้อนคะแนน...."
                    type="number"
                    min={0}
                    max={exam?exam.question[0].full_score:500}
                  />
                </div>
              </div>
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

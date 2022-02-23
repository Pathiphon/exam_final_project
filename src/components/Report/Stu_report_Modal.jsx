import React, { useEffect, useRef } from "react";
import useState from "react-usestateref";
import {  Divider, Button } from "@mui/material";
import API_URL from "../../config/api";
import logo_stu from "../../img/logo_stu.png";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PrintIcon from "@mui/icons-material/Print";
import Report_Student from "./Report_Student.jsx";
import { useReactToPrint } from "react-to-print";

export default function Stu_report_Modal({
  active,
  handleModalReport,
  exam_id,
  stu_code,
  exam,
}) {
  const [students, setStudents] = useState([]);
  const [replies, setReplies] = useState([]);
  let componentRef = useRef(null);
  const handlePrint_stu = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: students
      ? students.stu_code + " " + students.name
      : "รายงานนักศึกษา",
  });

  useEffect(() => {
    get_Students();
  }, []);

  const get_Students = async () => {
    await API_URL.get(`api/student/${stu_code}/${exam_id}`)
      .then((res) => {
        const student = res.data;
        let sum_score = 0;
        let full_score = 0;
        for (var i = 0; i < student.replies.length; i++) {
          sum_score += student.replies[i].score_stu;
          full_score += student.replies[i].question.full_score;
        }
        Object.assign(
          student,
          { score_stu_full: sum_score },
          { score_full_ques: full_score }
        );

        console.log(student);
        setStudents(student);
        setReplies(student.replies);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalReport}></div>
      <div className="modal-card w-4/6 rounded-lg">
        <header className="modal-card-head text-left justify-between">
          <p className=" text-lg my-auto "></p>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalReport}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="flex justify-between items-center">
            <div className="flex max-w-md items-center">
              <img src={logo_stu} className="rounded h-16" alt="" />
              <p className="text-lg truncate mx-4">
                {students ? students.stu_code : ""}{" "}
                {students ? students.name : ""}
              </p>
            </div>
            <div className="flex-col justify-end ">
              <div className="bg-green-50 rounded-md p-3 h-10  mb-2 text-center">
                <p className="text-base justify-end">
                  ทั้งหมด {students.score_stu_full}/{students.score_full_ques}{" "}
                  คะแนน
                </p>
              </div>

              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                className="w-36"
                onClick={handlePrint_stu}
              >
                พิมพ์
              </Button>
              <Button
                variant="outlined"
                color="error"
                className="mx-2 w-36"
                startIcon={<DeleteForeverIcon />}
                //   onClick={() => handleUpdate(exams.exam_id)}
              >
                ลบ
              </Button>
            </div>
          </div>
          <Divider
            sx={{ m: 1, borderBottomWidth: 3, backgroundColor: "black" }}
          />
          <div>
            {students ? (
              <>
                {replies.map((reply, index) => (
                  <div
                    className="border-2 border-gray-200 rounded-xl w-full p-2 my-2"
                    key={reply.ques_id}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex my-auto w-11/12">
                        <p className="text-base text-gray-500 mx-2 w-16 my-auto">
                          ข้อที่ {index + 1}.
                        </p>
                        <p className="text-base my-auto max-w-xl">
                          {reply.question.question}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-md p-3 h-10 w-44 mb-2 text-center">
                        <p className="text-base justify-end">
                          {reply.score_stu} / {reply.question.full_score} คะแนน
                        </p>
                      </div>
                    </div>
                    <Divider
                      sx={{
                        m: 0.5,
                        borderBottomWidth: 1,
                        backgroundColor: "black",
                      }}
                    />
                    <div className="flex items-center mt-4">
                      <p className="text-base w-1/12 text-gray-500 mx-2 my-auto">
                        คำตอบ :
                      </p>
                      <p className="w-11/12 text-lg text-back my-auto">
                        {reply.answer_stu}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="hidden">
            <Report_Student
              ref={componentRef}
              exam={exam}
              student={students}
              reply={replies}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

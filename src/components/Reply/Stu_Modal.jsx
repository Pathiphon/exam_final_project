import React, { useEffect } from "react";
import useState from "react-usestateref";
import {
  Box,
  TextField,
  Typography,
  FormControl,
  IconButton,
  Divider,
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

  const get_Exam = async () => {
    await API_URL.get(
      `api/reply/${exam_id}/question/${ques_id}/stu/${stu_code}`
    )
      .then((res) => {
        setExam(res.data);
        const student = res.data.question[0].student;
        if (student != null) {
          for (var j = 0; j < student.length; j++) {
            Object.assign(student[j], student[j].reply, {
              key: student[j].reply.stu_code,
            });
          }
          setExam_data(student);
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
  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalStu}></div>
      <div className="modal-card">
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
                <p className="text-base text-green-600 font-bold mx-2">ตรวจแล้ว</p>
              ) : (
                <p className="text-base text-red-700 font-bold mx-2">ยังไม่ได้ตรวจ</p>
              )
            ) : (
              ""
            )}
          </div>
        </section>

        <footer className="modal-card-foot">
          <div className="container mx-auto text-center">
            {ques_id ? (
              <Button
                className="mr-4"
                color="warning"
                variant="contained"
                sx={{ borderRadius: "7px" }}
                style={{
                  fontSize: "18px",
                  maxWidth: "100px",
                  maxHeight: "30px",
                  minWidth: "150px",
                  minHeight: "40px",
                }}
              >
                แก้ไข
              </Button>
            ) : (
              <Button
                type="sub"
                className="mr-4"
                variant="contained"
                color="success"
                sx={{ borderRadius: "7px" }}
                style={{
                  fontSize: "18px",
                  maxWidth: "100px",
                  maxHeight: "30px",
                  minWidth: "150px",
                  minHeight: "40px",
                }}
              >
                บันทึก
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              sx={{ borderRadius: "7px" }}
              style={{
                fontSize: "18px",
                maxWidth: "100px",
                maxHeight: "30px",
                minWidth: "150px",
                minHeight: "40px",
              }}
            >
              ยกเลิก
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

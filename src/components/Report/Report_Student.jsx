import React from "react";
import dayjs from "dayjs";

const Report_Student = React.forwardRef((props, ref) => {
  const exams = props.exam ? props.exam : "";
  const students = props.student ? props.student : "";
  const replys = props.reply ? props.reply : "";

  return (
    <div ref={ref} className="w-10/12 mx-auto text-center my-5">
      <p className="text-lg">ผลสอบนักศึกษา</p>
      <div className="flex mx-auto justify-center">
        <p className="mx-5">รหัสนักศึกษา {students.stu_code}</p>
        <p>{students.name}</p>
      </div>
      <p>เรื่อง {exams.name}</p>
      <p>สอบเมื่อวันที่ {dayjs(exams.date_pre).format("DD/MM/YYYY HH:mm")}</p>
      <div className="flex justify-between w-10/12 mx-auto">
        <p>คะแนนเต็ม {exams.question_sum_score}</p>
        <p>คะแนนที่ได้ {students.score_stu_full} คะแนน</p>
      </div>
      <table className="border-1 border-black w-11/12 mx-auto">
      <thead>
        <tr>
          <th className="border-1 m-2">ข้อที่</th>
          <th className="border-1 m-2 max-w-sx text-left">คำถาม</th>
          <th className="border-1 m-2">คำตอบ</th>
          <th className="border-1 m-2">คะแนน</th>
        </tr>
        </thead>
        <tbody>
        {replys.map((reply, index) => (
          <tr key={index}>
            <td className="border-1 m-2 p-2 w-10">{index + 1}</td>
            <td className="border-1 m-2 p-2 w-48">{reply.question.question}</td>
            <td className="border-1 m-2 p-2 w-52">{reply.answer_stu}</td>
            <td className="border-1 m-2 p-2 w-10">{reply.score_stu}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
});

export default Report_Student;

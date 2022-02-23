import React from "react";
import dayjs from "dayjs";

const Report_Reply = React.forwardRef((props, ref) => {
  const exams = props.exam ? props.exam : "";
  const students = props.student ? props.student : "";

  return (
    <div ref={ref} className="w-full mx-auto text-center bg-white">
      <p className="text-lg my-10">ประกาศผลสอบ</p>
      <p>เรื่อง {exams.name}</p>
      <p>สอบเมื่อวันที่ {dayjs(exams.date_pre).format("DD/MM/YYYY HH:mm")}</p>
      <div className="flex justify-between w-10/12 mx-auto">
        <p>จำนวนผู้เข้าสอบทั้งหมด {students.length} คน</p>
        <p>คะแนนเต็ม {exams.question_sum_score}</p>
      </div>

      <table className="border-1 border-black w-3/6 mx-auto p-2">
      <thead>
        <tr>
          <th className="w-1/12 border-1 p-2">
            <p className="font-semibold text-base my-auto">ลำดับ</p>
          </th>
          <th className="border-1 p-2 w-3/12">
            <p className="font-semibold text-base my-auto">รหัสนักศึกษา</p>
          </th>
          <th className="w-6/12 border-1 p-2">
            <p className="font-semibold text-base my-auto">ชื่อ - นามสกุล</p>
          </th>
          <th className="border-1 p-2">
            <p className="font-semibold text-base my-auto ">คะแนน</p>
          </th>
        </tr>
        </thead>
        <tbody>
        {students.map((student, index) => (
          <tr
            key={index}
          >
            <td className="border-1 p-2">{index + 1}</td>
            <td className="border-1 p-2">{student.stu_code}</td>
            <td className="border-1 p-2"><p className="text-left">{student.name}</p></td>
            <td className="border-1 p-2">{student.score_stu_full}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
});

export default Report_Reply;

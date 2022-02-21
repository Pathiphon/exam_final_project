import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link } from "react-router-dom";
import { Table, Tag } from "antd";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import API_URL from "../../config/api";
import { getCurrentUser } from "../../services/auth.service";
import {
  Button,
} from "@mui/material";

function Reply_Exam() {
  const [token] = useState(getCurrentUser());
  const [exam_data, setExam_data] = useState([]);

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${token && token.user.id}/all`)
      .then(async(res) => {
        const data_table = res.data;
        let stu_length = 0;
        let status_false = 0;
        for (var j = 0; j < data_table.length; j++) {
          await API_URL.get(`api/student/${data_table[j].exam_id}`)
          .then((stu)=>{
              stu_length=stu.data.length;
          })
          for (var i in data_table[j].replies){
            if (data_table[j].replies[i].check_status === false) {
              status_false += 1;
            } 
          }
          Object.assign(
            data_table[j],
            {status_false:status_false},
            { question_num: data_table[j].question.length },
            {stu_length:stu_length}
          );
          status_false = 0;
        }
        console.log(data_table);
        setExam_data(data_table);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    get_Exam();
  }, [token]);

  const columns = [
    {
      title: <div className="header_table">แบบทดสอบ</div>,
      dataIndex: "name",
      render: (name) => <p className="text-lg max-w-xs truncate">{name}</p>,
    },
    {
      title: <div className="header_table">จำนวนคำถาม</div>,
      dataIndex: "question_num",
      sorter: (a, b) => a.question_num - b.question_num,
      align: "center",
      render: (question_num) => (
        <div >
          <p className="text-base my-auto font-semibold">{question_num}</p>
        </div>
      ),
    },
    {
      title: "จำนวนผู้เข้าสอบ",
      dataIndex: "stu_length",
      align: "center",
      sorter: (a, b) => a.stu_length - b.stu_length,
      render: (stu_length) => (
        <div>
          <p className="text-base my-auto font-semibold">{stu_length}</p>
        </div>
      ),
    },
    {
      title: "จำนวนที่ต้องพิจารณา",
      dataIndex: "status_false",
      align: "center",
      sorter: (a, b) => a.status_false - b.status_false,
      render: (status_false) => (
        <Tag key={status_false} color="volcano">
          <p className="text-base font-semibold my-auto">{status_false}</p>
        </Tag>
      ),
    },
    {
      title: "การจัดการ",
      dataIndex: "exam_id",
      key: "exam_id",
      render: (exam_id,index) => (
        <Link key={index} to={`/${exam_id}/Manage_Reply`}>
          <Button
            variant="outlined"
            color="success"
            size="large"
            startIcon={<ManageSearchIcon />}
            //   onClick={() => handleUpdate(exams.exam_id)}
          >
            ตรวจ
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className=" mx-3">
      <Table
        columns={columns}
        className="rounded-lg ml-10"
        dataSource={exam_data}
        rowKey="exam_id"
      />
    </div>
  );
}

export default Reply_Exam;

import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link } from "react-router-dom";
import { Table,Tag } from "antd";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import API_URL from "../../config/api";
import { getCurrentUser } from "../../services/auth.service";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";

export default function Report_Exam() {
  const [inputSearch, setInputSearch] = useState("");
  const [token] = useState(getCurrentUser());
  const [exam_data, setExam_data] = useState([]);
  const [dataSource, setDataSource] = useState(exam_data);

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${token && token.user.id}/all`)
      .then(async (res) => {
        const data_table = res.data;
        let stu_length = 0;
        for (var j = 0; j < data_table.length; j++) {
          await API_URL.get(`api/student/${data_table[j].exam_id}`).then(
            (stu) => {
              stu_length = stu.data.length;
            }
          );
          Object.assign(
            data_table[j],
            { question_num: data_table[j].question.length },
            { check_num: data_table[j].replies.length },
            { stu_length: stu_length }
          );
        }
        setExam_data(data_table);
        setDataSource(data_table);
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
      title: "แบบทดสอบ",
      dataIndex: "name",
      render: (name) => <p className="text-lg max-w-lg truncate ml-1 my-auto">{name}</p>,
    },
    {
      title: "จำนวนคำถาม",
      dataIndex: "question_num",
      width:"15%",
      sorter: (a, b) => a.question_num - b.question_num,
      align: "center",
      render: (question_num) => (
        <div>
          <p className="text-base my-auto font-semibold">{question_num}</p>
        </div>
      ),
    },
    {
      title: "จำนวนผู้เข้าสอบ",
      dataIndex: "stu_length",
      align: "center",
      width:"15%",
      sorter: (a, b) => a.stu_length - b.stu_length,
      render: (stu_length) => (
        <Tag color="gold" className="my-auto">
          <p className="text-base my-auto font-semibold px-3 text-black">{stu_length}</p>
        </Tag>
      ),
    },

    {
      title: "การจัดการ",
      dataIndex: "exam_id",
      key: "exam_id",
      width:"15%",
      align:'center',
      render: (exam_id, index) => (
        <div className="mx-auto">
          <Link key={index} to={`/${exam_id}/Report_Exam_one`}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<ManageSearchIcon />}
            >
              ดูเพิ่มเติม
            </Button>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div className="container ml-5">
      <div className="p-3 bg-white rounded-lg shadow-sm w-50 ">
        <div className="flex  justify-center items-center">
          <div className="flex-auto w-70 ">
            <div className="flex items-center  w-6/6">
              <SearchIcon className="mr-3 " />
              <input
                value={inputSearch}
                className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
                placeholder="ค้นหาหัวข้อสอบ"
                onChange={(e) => {
                  const currValue = e.target.value;
                  setInputSearch(currValue);
                  const filteredData = exam_data.filter((entry) =>
                    entry.name.includes(currValue)
                  );
                  setDataSource(filteredData);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Table
      size="middle"
        columns={columns}
        className="rounded-lg my-3"
        dataSource={dataSource}
        rowKey="exam_id"
      />
    </div>
  );
}

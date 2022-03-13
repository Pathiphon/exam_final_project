import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link } from "react-router-dom";
import { Table, Tag,Spin    } from "antd";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import API_URL from "../../config/api";
import { getCurrentUser } from "../../services/auth.service";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";

function Reply_Exam() {
  const [inputSearch, setInputSearch] = useState("");
  const [token] = useState(getCurrentUser());
  const [exam_data, setExam_data] = useState([]);
  const [dataSource, setDataSource] = useState(exam_data);
  const [loading,setLoading] = useState(true);

  const get_Exam = async () => {
    try {
      await API_URL.get(`api/exam/${token && token.user.id}/all`)
      await API_URL.get(`api/reply/${token && token.user.id}/all`)
      .then(async (res) => {
        const data_table = res.data;
        let stu_length = 0;
        let status_false = 0;
        for (var j = 0; j < data_table.length; j++) {
          await API_URL.get(`api/student/${data_table[j].exam_id}`).then(
            (stu) => {
              stu_length = stu.data.length;
            }
          );
          if(stu_length===0){
            data_table.splice(j,1)
            j--;
            continue;
          }
          for (var i in data_table[j].replies) {
            if (data_table[j].replies[i].check_status === false) {
              status_false += 1;
            }
          }
          Object.assign(
            data_table[j],
            { status_false: status_false },
            { question_num: data_table[j].question.length },
            { stu_length: stu_length }
          );
          
          status_false = 0;
        }
        setDataSource(data_table);
        setExam_data(data_table);
        return res.data;
      })
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    get_Exam();
  }, [token]);

  const columns = [
    {
      title: <p className="my-auto">แบบทดสอบ</p>,
      dataIndex: "name",
      render: (name) => <p className="text-lg max-w-lg my-auto truncate ">{name}</p>,
    },
    {
      title: <p className="my-auto">จำนวนคำถาม</p>,
      dataIndex: "question_num",
      sorter: (a, b) => a.question_num - b.question_num,
      align: "center",
      width:"10%",
      render: (question_num) => (
          <p className="text-base my-auto font-semibold">{question_num}</p>
      ),
    },
    {
      title: <p className="my-auto">จำนวนผู้เข้าสอบ</p>,
      dataIndex: "stu_length",
      align: "center",
      width:"10%",
      sorter: (a, b) => a.stu_length - b.stu_length,
      render: (stu_length) => (
          <p className="text-base my-auto font-semibold">{stu_length}</p>
      ),
    },
    {
      title: <p className="my-auto">รูปแบบที่ต้องพิจารณา</p>,
      dataIndex: "status_false",
      align: "center",
      width:"15%",
      sorter: (a, b) => a.status_false - b.status_false,
      render: (status_false) => (
        <Tag key={status_false} color="volcano" className="my-auto">
          <p className="text-base font-semibold my-auto px-3">{status_false}</p>
        </Tag>
      ),
    },
    {
      title: <p className="my-auto">การจัดการ</p>,
      dataIndex: "exam_id",
      key: "exam_id",
      width:'10%',
      render: (exam_id, index) => (
        <Link key={index} to={`/${exam_id}/Manage_Reply`}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<ManageSearchIcon />}
          >
            ตรวจ
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="container ml-5">
      <div className="p-3 bg-white rounded-lg w-50 shadow-sm">
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
        columns={columns}
        className="rounded-lg my-3"
        dataSource={dataSource}
        rowKey="exam_id"
        loading={{ indicator: <div><Spin size="large" /></div>, spinning:loading}}
      />
    </div>
  );
}

export default Reply_Exam;

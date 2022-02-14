/* eslint-disable react/jsx-pascal-case */
import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Table, Tag } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CssBaseline, Toolbar, Button, Divider } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import API_URL from "../../config/api";
import Stu_Modal from "./Stu_Modal";

const Manage_Reply_one = () => {
  const { ques_id, exam_id } = useParams();
  const [exam_data, setExam_data, exam_dataRef] = useState(null);
  const [exam, setExam, examRef] = useState(null);
  const [list_stu, setList_stu] = useState(null);
  const [stu_code, setStu_code] = useState(null);
  const [stu_ques_id, setStu_ques_id] = useState(null);
  const [stu_exam_id, setStu_exam_id] = useState(null);
  const [activeModalStu, setActiveModalStu] = useState(false);

  let navigate = useNavigate();

  function handleClick_Back() {
    navigate(`/${exam_id}/Manage_Reply`);
    window.location.reload();
  }
  const handleClickStu = async (stu) => {
    setStu_code(stu.stu.stu_code);
    setStu_exam_id(stu.stu.exam_id);
    setStu_ques_id(stu.stu.ques_id);

    setActiveModalStu(true);
  };
  const handleModalStu = async () => {
    get_Exam();
    setActiveModalStu(!activeModalStu);
    setStu_code(null);
    setStu_exam_id(null);
    setStu_ques_id(null);
  };

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${exam_id}/question/${ques_id}`)
      .then((res) => {
        setExam(res.data);
        const student = res.data.question[0].student;
        if (student != null) {
          for (var j = 0; j < student.length; j++) {
            Object.assign(student[j], student[j].reply, {
              key: student[j].reply.stu_code,
            });
          }
          console.log(student);
          setExam_data(student);
        }

        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(exam_data);
  };
  useEffect(() => {
    if (exam === null && exam_data === null) {
      get_Exam();
    }
  }, [exam, exam_data]);

  const columns = [
    {
      title: <div>ชื่อ - นามสกุล</div>,
      dataIndex: "name",
      key: "name",
    
      render: (name) => <p className="text-lg truncate max-w-name">{name}</p>,
    },
    {
      title: <div>คำตอบ</div>,
      dataIndex: "answer_stu",
      key: "stu",
      render: (answer_stu, stu) => (
        <div className="flex items-center">
          {" "}
          <p className="truncate max-w-xs my-auto mr-3">{answer_stu}</p>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleClickStu({ stu })}
          >
            ดูเพิ่มเติม
          </Button>
        </div>
      ),
    },
    {
      title: "เปอร์เซ็นความถูกต้อง",
      dataIndex: "persent_get",
      key: "",
    },
    {
      title: "คะแนน",
      dataIndex: "score_stu",
      key: "",
      align: "center",
      sorter: (a, b) => a.score_stu - b.score_stu,
    },
    {
      title: "สถานะ",
      dataIndex: "check_status",
      key: "",
      sorter: (c, d) => c.check_status - d.check_status,
      // defaultSortOrder: "ascend",
      render: (check_status) => (
        <>
          {check_status ? (
            <>
              <p className="text-green-600">ตรวจแล้ว</p>
            </>
          ) : (
            <>
              <p className="text-red-600">ยังไม่ได้ตรวจ</p>
            </>
          )}
        </>
      ),
    },
  ];
  class App extends React.Component {
    state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    };

    start = () => {
      this.setState({ loading: true });
      // ajax request after empty completing
      setTimeout(() => {
        this.setState({
          selectedRowKeys: [],
          loading: false,
        });
      }, 1000);
    };

    onSelectChange = (selectedRowKeys) => {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.setState({ selectedRowKeys });
    };

    render() {
      const { selectedRowKeys } = this.state;
      const hasSelected = false;
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.setState({ list_stu: selectedRows });
          console.log(list_stu);
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === "Disabled User",
          // Column configuration not to be checked
          name: record.name,
        }),
      };

      return (
        <div>
          {/* <div style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={this.start} disabled={!hasSelected}>
              Reload
            </Button>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
            </span>
          </div> */}
          <Table
          className="-mt-14"
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={exam_data}
          />
        </div>
      );
    }
  }

  return (
    <div>
      <CssBaseline />
      <div
        className="shadow-zinc-500 flex justify-between items-center"
        style={{ background: "white" }}
      >
        <div>
          <Toolbar>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIosIcon />}
              style={{ fontSize: "18px" }}
              onClick={handleClick_Back}
            >
              {" "}
              พิจารณาข้อสอบ
            </Button>
          </Toolbar>
        </div>
        <div className="items-center text-center bg-gray-500 text-white p-3 mx-2 rounded-md">
          <p className="text-lg my-auto">
            คะแนนเต็ม {exam ? exam.question[0].full_score : ""} คะแนน{" "}
          </p>
        </div>
      </div>
      <div className="bg-gray-600 px-20 py-16">
        <p className="text-2xl mx-10 px-20 text-white">
          คำถาม : {exam ? exam.question[0].question : ""}
        </p>
      </div>
      <div className="w-4/5 mx-auto ">
        {/* <Table
          columns={columns}
          className="rounded-lg -mt-14"
          dataSource={exam_data}
          rowKey="stu_code"
        /> */}
        <App />
      </div>
      {activeModalStu===true?<>
      <Stu_Modal
            active={activeModalStu}
            handleModalStu={handleModalStu}
            ques_id={stu_ques_id}
            exam_id={stu_exam_id}
            stu_code={stu_code}
          />
          </>:<></>}
    </div>
  );
};
export default Manage_Reply_one;

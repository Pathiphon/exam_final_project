import React, { useEffect } from "react";
import useState from "react-usestateref";
import API_URL from "../../config/api";
import SearchIcon from "@mui/icons-material/Search";
import { Divider } from "@mui/material";

export default function Question_report_Modal({
  active,
  handleModalReport_ques,
  exam_id,
  ques_id,
}) {
  const [questions, setQuestions] = useState(null);
  const [replys, setReplys] = useState(null);
  const [inputSearch, setInputSearch] = useState("");

  const get_Question = async () => {
    await API_URL.get(`api/reply/${exam_id}/onereply/${ques_id}`)
      .then((res) => {
        const question = res.data.question[0];
        const reply = question.replies;
        let sum_score_stu = 0;

        for (var i = 0; i < question.replies.length; i++) {
          sum_score_stu += question.replies[i].score_stu;
        }
        Object.assign(
          question,
          { sum_scoreStu: sum_score_stu },
          { avg_question: sum_score_stu / question.replies.length }
        );

        setQuestions(question);
        setReplys(reply);
        console.log(question);

        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    get_Question();
  }, []);
  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalReport_ques}></div>
      <div className="modal-card w-4/6 rounded-lg">
        <header className="modal-card-head text-left justify-end">
          <p className=" text-lg my-auto bg-stone-300 px-3 py-1 mr-3  rounded-md">
            เต็ม {questions ? questions.full_score : ""} คะแนน
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalReport_ques}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="shadow-md border-2 bg-white rounded-md p-4 mb-3">
            <div className="flex my-auto items-center justify-between">
              <div className="flex my-auto items-center">
                <p>{questions ? questions.question : ""}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center  w-3/6">
            <SearchIcon className="mr-3 " />
            <input
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
              placeholder="ค้นหาตามคะแนน"
              type="number"
              onChange={(e) => setInputSearch(e.target.value)}
            />
          </div>
          <Divider
            sx={{
              m: 1,
              borderBottomWidth: 1,
              backgroundColor: "black",
            }}
          />
          <div className=" mx-auto">
            {replys ? (
              replys
                .filter((reply) => {
                  if (inputSearch === "") {
                    return reply;
                  } else if (
                    reply.score_stu.toString().includes(inputSearch.toString())
                  ) {
                    return reply;
                  }
                })
                .sort((a, b) => (a.score_stu > b.score_stu ? 1 : -1))
                .map((reply, index) => (
                  <div
                    className="my-3 bg-gray-50 rounded-md  p-3 flex justify-between shadow-sm"
                    key={index}
                  >
                    <div className="flex">
                      <p className="flex w-32 truncate my-auto ">
                        {reply.student.name}
                      </p>
                      <p className="max-w-sm truncate my-auto ml-3">
                        {reply.answer_stu}
                      </p>
                    </div>
                    <p className="max-w-sm truncate my-auto ml-1 bg-orange-100 rounded-md px-5">
                      {reply.score_stu} คะแนน
                    </p>
                  </div>
                ))
            ) : (
              <></>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useState, CSSProperties } from "react";
import { usePapaParse } from "react-papaparse";
import API_URL from "../../config/api";
import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

export default function CSVReader({exam_id}) {
  const { CSVReader } = useCSVReader();
  const [number, setNumber] = useState();
  const [zoneHover, setZoneHover] = useState(false);
  const { readString, readRemoteFile } = usePapaParse();
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );
  const CreateReply = async (results) => {
    let txt_array =[];
    for (let i in results) {
      if (results[i][0] !== "") {
        let text = Object.assign(
          { answer_stu: results[i][0] },
          { name: `0000000${i}`},
          {ques_id:number},
          { stu_code: 611463000+(parseInt(i)+1) },
          { exam_id: exam_id },
          { ans_id: null },
          { score_stu: 0 },
          { persent_get: 0 },
          { check_status: false }
        );
        console.log(text);
        txt_array.push(text)
     
      }

    }
    await API_URL.post(`api/reply`, txt_array)
          .then((res) => {console.log("เสร็จจจจจจจ");})
          .catch((err) => {
            console.log(err);
          });
  };
  return (
    <div>
      <input value={number} onChange={(e) => setNumber(e.target.value)} />
      {number && (
        <CSVReader
          onUploadAccepted={(results) => {
            console.log("---------------------------");
            console.log(CreateReply(results.data));
            console.log(results);
            console.log("---------------------------");
            setZoneHover(false);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setZoneHover(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setZoneHover(false);
          }}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
            Remove,
          }) => (
            <>
              <div {...getRootProps()} style={Object.assign({})}>
                {acceptedFile ? (
                  <>
                    <div>
                      <div>
                        <span>{formatFileSize(acceptedFile.size)}</span>
                        <span>{acceptedFile.name}</span>
                      </div>
                      <div>
                        <ProgressBar />
                      </div>
                      <div
                        {...getRemoveFileProps()}
                        onMouseOver={(event) => {
                          event.preventDefault();
                          setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                        }}
                        onMouseOut={(event) => {
                          event.preventDefault();
                          setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                        }}
                      >
                        <Remove color={removeHoverColor} />
                      </div>
                    </div>
                  </>
                ) : (
                  "Drop CSV file here or click to upload"
                )}
              </div>
            </>
          )}
        </CSVReader>
      )}
    </div>
  );
}

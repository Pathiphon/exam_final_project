import React from "react";
import { useTicker } from "./useTicker";

export default function Ticker({ futureDate }) {
  const { days, hours, minutes, seconds, isTimeUp } = useTicker(futureDate);

  const tickerContents = isTimeUp ? (
    <div>Time is Up!!!!</div>
  ) : (
    <>
      <p className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
        {minutes} นาที {seconds} วินาที
      </p>
    </>
  );

  return <div>{tickerContents}</div>;
}

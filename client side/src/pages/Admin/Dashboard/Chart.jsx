import React from "react";
import "./charts.css"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

function Chart() {
  const data = [
    {
      name: "post A",
      likes : 4000,
      comments : 200


    },
    {
      name: "post B",
      likes : 2000,
      comments : 100


    },
    {
      name: "post C",
      likes : 1000,
      comments : 300


    },
    {
      name: "post D",
      likes : 3000,
      comments : 100

    },
    {
      name: "post E",
      likes : 5000,
      comments : 200

    },
    {
      name: "post F",
      likes : 3000,
      comments : 300
    },
    
  ];
  const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
    { name: "Group E", value: 278 },
    { name: "Group F", value: 189 },
  ];

  return (
    <>
        <div className="single-chart">

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 20,
            bottom: 5,
          }}
        >

          <XAxis dataKey="name" />
          <YAxis  />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="likes"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      </div >
      <div className="single-chart">

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >

          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="comments" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
</div>
</>
  );
}

export default Chart;

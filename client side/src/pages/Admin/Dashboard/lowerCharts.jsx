import React from "react";
import "./charts.css"

import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  PieChart,
  Pie,
} from "recharts";


function lowerCharts() {
    const data = [
        {
          name: "jan&feb",
          posts : 1000,
          users: 4000
        },
        {
          name: "mar&apr",
          posts: 3000,
          users: 3000
        },
        {
          name: "may&jun",
          posts: 2000,
          users: 1000
        },
        {
          name: "july&aug",
          posts: 2780,
          users: 4000
        },
        {
          name: "sep&oct",
          posts: 1890,
          users: 2000
        },
        {
          name: "nov&dec",
          posts: 2390,
          users: 3000
        },
      ];
    
  return (
    <>
    <div className="single-chart">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          height={300}
          data={data}
          margin={{
            top: 5,
            bottom: 5,
          }}
        >

          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      </div>
      <div className="single-chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart height={400}>
          <Pie
            dataKey="posts"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
    </>
  )
}

export default lowerCharts
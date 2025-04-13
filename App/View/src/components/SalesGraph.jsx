// LineGraph.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

//const db_data = {curr: 15, prev: 150, listVel: 3}; // Example data from the database

const verticalLines = [30]; // X-values where you want vertical dotted lines

const SalesGraph = ({ curr, prev, listVel, name, desc }) => {
  const db_data = {curr, prev, listVel, name, desc};
  let data = [];
  for (let i = 1; i <= 30; i++) {
    data.push({
      day: i,
      sold: db_data.prev/30.0 + i*(db_data.curr - db_data.prev/30.0) + ((Math.random() * 2) - 1) * db_data.prev / 2.0, // Random y-value around current value
    });
  }
  data[29].projected = data[29].sold;
  for (let i = 1; i <= 7; i++) {
    data.push({
      day: i + 30,
      projected: db_data.curr + Math.max(i*db_data.curr*(1 + Math.pow(db_data.listVel, 3) / 5.0) + ((Math.random() * 2) - 1) * db_data.prev / 2.0, 0), // Random y-value around current value
    });
  }
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <text
          x={200}
          y={20}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 18, fontWeight: "bold" }}
        >
          Sales Performance Graph
        </text>
        <XAxis dataKey="x" label={{ value: "Days", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "Interest", angle: -90, position: "insideLeft" }} />
        <Line type="linear" dataKey="sold" stroke="#8884d8" strokeWidth={2} />
        <Line type="linear" dataKey="projected" strokeDasharray="4 4" stroke={data[36].y2 - data[29].y > 0 ? "#59e859" : "#e85859"} strokeWidth={2} />

        {/* Vertical Dotted Lines */}
        {verticalLines.map((xValue, index) => (
          <ReferenceLine
            key={index}
            x={xValue}
            stroke="red"
            strokeDasharray="4 4"
            label={{ value: `x = ${xValue}`, position: "top", fill: "red", fontSize: 12 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesGraph;
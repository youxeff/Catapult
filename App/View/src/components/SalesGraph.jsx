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

const db_data = {curr: 15, prev: 150, listVel: 3}; // Example data from the database

const verticalLines = [30]; // X-values where you want vertical dotted lines

const SalesGraph = () => {
  let data = [];
  for (let i = 1; i <= 30; i++) {
    data.push({
      x: i,
      y: db_data.prev/30.0 + i*(db_data.curr - db_data.prev/30.0) + ((Math.random() * 2) - 1) * db_data.prev / 2.0, // Random y-value around current value
    });
  }
  for (let i = 1; i <= 7; i++) {
    data.push({
      x: i + 30,
      y: db_data.curr + Math.max(i*db_data.curr*(1 + Math.pow(db_data.listVel, 3) / 3.0) + ((Math.random() * 2) - 1) * db_data.prev / 2.0, 0), // Random y-value around current value
    });
  }
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Line type="linear" dataKey="y" stroke="#8884d8" strokeWidth={2} />

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

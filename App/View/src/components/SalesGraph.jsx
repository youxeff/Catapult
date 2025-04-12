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

const data = [
  { x: 1, y: 20 },
  { x: 2, y: 40 },
  { x: 3, y: 35 },
  { x: 4, y: 60 },
  { x: 5, y: 80 },
  { x: 6, y: 70 },
];

const verticalLines = [2, 4, 5]; // X-values where you want vertical dotted lines

const SalesGraph = () => {
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

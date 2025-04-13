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

const verticalLines = [30]; // X-values where you want vertical dotted lines

const SalesGraph = ({ curr = 0, prev = 0, listVel = 0, name, desc }) => {
  const data = [];
  // Past 30 days data
  for (let i = 1; i <= 30; i++) {
    data.push({
      day: i,
      sold: Math.max(0, Math.round(prev/30.0 + i*(curr - prev/30.0) + ((Math.random() * 2) - 1) * prev / 5.0)),
    });
  }

  // Add projected data point at day 30
  data[29].projected = data[29].sold;

  // Future 7 days projection
  for (let i = 1; i <= 7; i++) {
    const projectedValue = Math.max(0, Math.round(
      curr + i*curr*(1 + Math.pow(listVel, 3) / 5.0) + 
      ((Math.random() * 2) - 1) * prev / 2.0
    ));
    
    data.push({
      day: i + 30,
      projected: projectedValue
    });
  }

  // Calculate if trend is positive
  const isPositiveTrend = data[data.length - 1].projected > data[29].projected;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 40, right: 20, left: 20, bottom: 20 }}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip 
          formatter={(value) => [value, "Units"]}
          labelFormatter={(day) => `Day ${day}`}
        />
        <text
          x="50%"
          y={20}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-foreground"
          style={{ fontSize: 16, fontWeight: "bold" }}
        >
          Sales Performance
        </text>
        <XAxis 
          dataKey="day" 
          label={{ value: "Days", position: "insideBottom", offset: -10 }}
        />
        <YAxis 
          label={{ 
            value: "Units Sold", 
            angle: -90, 
            position: "insideLeft",
            offset: -5
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="sold" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="projected" 
          strokeDasharray="4 4" 
          stroke={isPositiveTrend ? "#4CAF50" : "#f44336"}
          strokeWidth={2}
          dot={false}
        />

        {verticalLines.map((xValue, index) => (
          <ReferenceLine
            key={index}
            x={xValue}
            stroke="#666"
            strokeDasharray="4 4"
            label={{ 
              value: "Today", 
              position: "top",
              fill: "#666",
              fontSize: 12
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesGraph;
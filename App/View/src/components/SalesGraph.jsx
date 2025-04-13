// LineGraph.tsx
import React, { useEffect } from "react";
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

// Seeded random number generator
const seededRandom = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Calculate trend from historical data
const calculateTrend = (data) => {
  const recentDays = 7; // Look at last 7 days for trend
  const recentData = data.slice(-recentDays);
  
  // Calculate average daily change
  let totalChange = 0;
  for (let i = 1; i < recentData.length; i++) {
    totalChange += recentData[i].sold - recentData[i-1].sold;
  }
  const avgDailyChange = totalChange / (recentData.length - 1);
  
  // Calculate volatility (standard deviation of changes)
  let totalVariance = 0;
  for (let i = 1; i < recentData.length; i++) {
    const change = recentData[i].sold - recentData[i-1].sold;
    totalVariance += Math.pow(change - avgDailyChange, 2);
  }
  const volatility = Math.sqrt(totalVariance / (recentData.length - 1));
  
  return { avgDailyChange, volatility };
};

const SalesGraph = ({ curr = 0, prev = 0, listVel = 0, name, desc, onProjectionUpdate }) => {
  const data = [];
  const seed = React.useMemo(() => Math.floor(Math.random() * 10000) + 1, []);
  let currentSeed = seed;

  // Past 30 days data
  for (let i = 1; i <= 30; i++) {
    data.push({
      day: i,
      sold: Math.max(0, Math.round(prev/30.0 + i*(curr - prev/30.0) + ((seededRandom(currentSeed++) * 2) - 1) * prev / 5.0)),
    });
  }

  // Calculate trend from historical data
  const { avgDailyChange, volatility } = calculateTrend(data);

  // Add projected data point at day 30
  data[29].projected = data[29].sold;
  const lastValue = data[29].sold;

  // Future 7 days projection based on historical trend
  let totalChange = 0;
  for (let i = 1; i <= 7; i++) {
    const trendBasedValue = data[29].sold + (avgDailyChange * i);
    const randomVariation = ((seededRandom(currentSeed++) * 2) - 1) * volatility;
    const velocityImpact = curr * Math.pow(listVel, 2) * 0.1 * i;
    
    const projectedValue = Math.max(0, Math.round(
      trendBasedValue + randomVariation + velocityImpact
    ));
    
    data.push({
      day: i + 30,
      projected: projectedValue
    });

    if (i === 7) {
      totalChange = projectedValue - lastValue;
    }
  }

  // Calculate if trend is positive
  const isPositiveTrend = data[data.length - 1].projected > data[29].projected;

  // Update parent component with projection data
  useEffect(() => {
    if (onProjectionUpdate) {
      onProjectionUpdate({
        lastValue: lastValue,
        projectedValue: data[data.length - 1].projected,
        avgDailyChange: avgDailyChange,
        totalChange: totalChange
      });
    }
  }, [lastValue, data, avgDailyChange, totalChange, onProjectionUpdate]);

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
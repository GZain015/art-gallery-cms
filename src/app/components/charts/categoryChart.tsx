import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const data = {
    labels: ["Arabic", "Modern", "Traditional", "Quotes", "Abstract"],
    datasets: [
      {
        label: "Sales by Category",
        data: [40, 25, 20, 10, 5], // Example data
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        // position: "left   ",
        position: "bottom",
        labels: { color: "#111" }, // legend text color
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "100%", height: "300px", background: "#fff", borderRadius: "10px", padding: "15px" }}>
      {/* <h3 style={{ marginBottom: "5px" }}>Top-Selling Categories</h3> */}
      <h3>Top-Selling Categories</h3>
      <Doughnut data={data} options={options} style={{ marginBottom: "20px"}}/>
    </div>
  );
};

export default CategoryChart;

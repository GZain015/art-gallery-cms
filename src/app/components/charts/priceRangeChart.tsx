import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PriceRangeChart = () => {
  const data = {
    labels: ["$50–100", "$100–200", "$200–300", "$300+"],
    datasets: [
      {
        label: "Number of Artworks Sold",
        data: [12, 25, 15, 5], // Example data
        backgroundColor: "#3b82f6",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Artwork Price Range Distribution",
        color: "#111",
      },
    },
    scales: {
      x: {
        ticks: { color: "#111" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#111" },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px", background: "#fff", borderRadius: "10px", padding: "15px", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PriceRangeChart;

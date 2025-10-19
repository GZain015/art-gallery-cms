import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Define Product interface
interface Product {
  id: string;
  title: string;
  price: string;
  category: string;
  stock: string;
  status: string;
  image: string;
  createdBy: {
    name: string;
  };
}

// Accept products as a prop
interface CategoryChartProps {
  products: Product[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ products }) => {
  // Count products per category
  const categoryCounts: Record<string, number> = {};

  products.forEach((p) => {
    const category = p.category || "Uncategorized";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const labels = Object.keys(categoryCounts);
  const dataValues = Object.values(categoryCounts);

  const data = {
    labels,
    datasets: [
      {
        label: "Artworks by Category",
        data: dataValues,
        backgroundColor: [
          "#3b82f6", // blue
          "#10b981", // green
          "#f59e0b", // yellow
          "#ef4444", // red
          "#8b5cf6", // purple
          "#14b8a6", // teal
          "#f97316", // orange
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: "#111" },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        background: "#fff",
        borderRadius: "10px",
        padding: "15px",
      }}
    >
      <h3>Top-Selling Categories</h3>
      <Doughnut
        data={data}
        options={options}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
};

export default CategoryChart;










// import React from "react";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const CategoryChart = () => {
//   const data = {
//     labels: ["Arabic", "Modern", "Traditional", "Quotes", "Abstract"],
//     datasets: [
//       {
//         label: "Sales by Category",
//         data: [40, 25, 20, 10, 5], // Example data
//         backgroundColor: [
//           "#3b82f6",
//           "#10b981",
//           "#f59e0b",
//           "#ef4444",
//           "#8b5cf6",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     plugins: {
//       legend: {
//         // position: "left   ",
//         position: "bottom",
//         labels: { color: "#111" }, // legend text color
//       },
//     },
//     responsive: true,
//     maintainAspectRatio: false,
//   };

//   return (
//     <div style={{ width: "100%", height: "300px", background: "#fff", borderRadius: "10px", padding: "15px" }}>
//       {/* <h3 style={{ marginBottom: "5px" }}>Top-Selling Categories</h3> */}
//       <h3>Top-Selling Categories</h3>
//       <Doughnut data={data} options={options} style={{ marginBottom: "20px"}}/>
//     </div>
//   );
// };

// export default CategoryChart;

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

// Define Product interface if needed
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
interface PriceRangeChartProps {
  products: Product[];
}

const PriceRangeChart: React.FC<PriceRangeChartProps> = ({ products }) => {
  // Example: group products by price range
  // const ranges = {
  //   "Rs.50–100": 0,
  //   "Rs.100–200": 0,
  //   "Rs.200–300": 0,
  //   "Rs.300+": 0,
  // };

  // products.forEach((p) => {
  //   const price = parseFloat(p.price || "0");
  //   if (price >= 50 && price < 100) ranges["Rs.50–100"]++;
  //   else if (price >= 100 && price < 200) ranges["Rs.100–200"]++;
  //   else if (price >= 200 && price < 300) ranges["Rs.200–300"]++;
  //   else if (price >= 300) ranges["Rs.300+"]++;
  // });

  const ranges = {
    "$50–$100": 0,
    "$100–$200": 0,
    "$200–$300": 0,
    "$300+": 0,
  };

  products.forEach((p) => {
    const price = parseFloat(p.price || "0");
    if (price >= 50 && price < 100) ranges["$50–$100"]++;
    else if (price >= 100 && price < 200) ranges["$100–$200"]++;
    else if (price >= 200 && price < 300) ranges["$200–$300"]++;
    else if (price >= 300) ranges["$300+"]++;
  });



  const data = {
    labels: Object.keys(ranges),
    datasets: [
      {
        label: "Number of Artworks",
        data: Object.values(ranges),
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
    <div
      style={{
        width: "100%",
        height: "300px",
        background: "#fff",
        borderRadius: "10px",
        padding: "15px",
      }}
    >
      <Bar data={data} options={options} />
    </div>
  );
};

export default PriceRangeChart;



// import React from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const PriceRangeChart = () => {
//   const data = {
//     // labels: ["$50–100", "$100–200", "$200–300", "$300+"],
//     labels: ["Rs.50–100", "Rs.100–200", "Rs.200–300", "Rs.300+"],
//     datasets: [
//       {
//         label: "Number of Artworks Sold",
//         data: [12, 25, 15, 5], // Example data
//         backgroundColor: "#3b82f6",
//         borderRadius: 5,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       title: {
//         display: true,
//         text: "Artwork Price Range Distribution",
//         color: "#111",
//       },
//     },
//     scales: {
//       x: {
//         ticks: { color: "#111" },
//         grid: { display: false },
//       },
//       y: {
//         ticks: { color: "#111" },
//         grid: { color: "#e5e7eb" },
//       },
//     },
//   };

//   return (
//     <div style={{ width: "100%", height: "300px", background: "#fff", borderRadius: "10px", padding: "15px", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// export default PriceRangeChart;



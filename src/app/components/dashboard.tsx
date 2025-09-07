// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
// import CategoryChart from "./charts/categoryChart";
// import PriceRangeChart from "./charts/priceRangeChart";

// const salesData = [
//   { month: "Jan", earnings: 4000 },
//   { month: "Feb", earnings: 3000 },
//   { month: "Mar", earnings: 5000 },
//   { month: "Apr", earnings: 4780 },
//   { month: "May", earnings: 5890 },
//   { month: "Jun", earnings: 6390 },
//   { month: "Jul", earnings: 7490 },
// ]

// function Dashboard() {
//   const { token } = useAuth();
//   const router = useRouter();

//   // Artworks & Artists
//   const [artworks, setArtworks] = useState([]);
//   const [artists, setArtists] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Stats
//   const [totalPurchases, setTotalPurchases] = useState(0);
//   const [monthlyEarnings, setMonthlyEarnings] = useState(0);
//   const [stockAvailable, setStockAvailable] = useState(0);

//   // Pagination
//   const [currentArtworkPage, setCurrentArtworkPage] = useState(1);
//   const [totalArtworks, setTotalArtworks] = useState(0);
//   const [totalArtworksPages, setTotalArtworksPages] = useState(0);
//   const rowsPerPageArtwork = 5;

//   const [currentArtistPage, setCurrentArtistPage] = useState(1);
//   const [totalArtists, setTotalArtists] = useState(0);
//   const [totalArtistsPages, setTotalArtistsPages] = useState(0);
//   const rowsPerPageArtist = 5;

//   const [currentDateTime, setCurrentDateTime] = useState("");

//   // Current Date & Time
//   useEffect(() => {
//     const now = new Date();
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: "short",
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     };
//     setCurrentDateTime(now.toLocaleString("en-US", options));

//     const timer = setInterval(() => {
//       const now = new Date();
//       setCurrentDateTime(now.toLocaleString("en-US", options));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Fetch Data
//   useEffect(() => {
//     if (!token) return;

//     const fetchArtworks = async () => {
//       try {
//         const response: any = await axios.get(
//           `${process.env.NEXT_PUBLIC_HOST}/artworks?page=${currentArtworkPage}&limit=${rowsPerPageArtwork}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const allArtworks = response?.data?.data || [];
//         setTotalArtworks(response?.data?.total || 0);
//         setTotalArtworksPages(response?.data?.totalPages || 0);

//         setArtworks(allArtworks);
//       } catch (err) {
//         console.error("Failed to fetch artworks:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchArtists = async () => {
//       try {
//         const response: any = await axios.get(
//           `${process.env.NEXT_PUBLIC_HOST}/artists?page=${currentArtistPage}&limit=${rowsPerPageArtist}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const allArtists = response?.data?.data || [];
//         setTotalArtists(response?.data?.total || 0);
//         setTotalArtistsPages(response?.data?.totalPages || 0);

//         setArtists(allArtists);
//       } catch (err) {
//         console.error("Failed to fetch artists:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchStats = async () => {
//       try {
//         const response: any = await axios.get(
//           `${process.env.NEXT_PUBLIC_HOST}/stats/dashboard`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setTotalPurchases(response?.data?.totalPurchases || 0);
//         setMonthlyEarnings(response?.data?.monthlyEarnings || 0);
//         setStockAvailable(response?.data?.stockAvailable || 0);
//       } catch (err) {
//         console.error("Failed to fetch stats:", err);
//       }
//     };

//     fetchArtworks();
//     fetchArtists();
//     fetchStats();
//   }, [token, currentArtworkPage, currentArtistPage]);

//   useEffect(() => {
//     if (!token) {
//       // router.push("/signIn");
//     }
//   }, [token, router]);

//   // Pagination handlers
//   const handlePageChangeArtworks = (direction: string) => {
//     if (direction === "next" && currentArtworkPage < totalArtworksPages)
//       setCurrentArtworkPage((prev) => prev + 1);
//     else if (direction === "prev" && currentArtworkPage > 1)
//       setCurrentArtworkPage((prev) => prev - 1);
//   };

//   const handlePageChangeArtists = (direction: string) => {
//     if (direction === "next" && currentArtistPage < totalArtistsPages)
//       setCurrentArtistPage((prev) => prev + 1);
//     else if (direction === "prev" && currentArtistPage > 1)
//       setCurrentArtistPage((prev) => prev - 1);
//   };

//   if (isLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-100">
//         <p className="text-gray-600 text-xl">Loading Art Gallery Data...</p>
//       </div>
//     );
//   }

//   if (!token) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-100">
//         <h1 className="text-red-600 text-2xl font-bold">Unauthorized Access</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen p-6 text-gray-800">
//       {/* Dashboard Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-700">Art Gallery Dashboard</h1>
//         <p className="text-sm text-gray-500">{currentDateTime}</p>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
//           <p className="text-2xl font-bold text-blue-600">{totalPurchases}</p>
//         </div>
//         {/* <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
//           <p className="text-2xl font-bold text-green-600">${monthlyEarnings}</p>
//         </div> */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
//           <p className="text-2xl font-bold text-green-600">${monthlyEarnings}</p>
//           <p className="text-sm text-gray-500 flex items-center">
//             <span className="text-green-500 font-medium mr-1">▲ 12%</span> vs last month
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Stock Available</h3>
//           <p className="text-2xl font-bold text-purple-600">{stockAvailable}</p>
//         </div>
//       </div>

//       {/* Artworks Section */}
//       {/* <div className="mb-6 bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold text-gray-700 mb-2">Artworks</h2>
//         <p className="text-sm text-gray-500 mb-4">Manage artworks in the gallery</p>
//         <p>Total Artworks: {totalArtworks}</p>
//       </div> */}

//       {/* <div className="mb-6 bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold text-gray-700 mb-2">Top Selling Artworks</h2>
//         <table className="w-full text-sm text-gray-600">
//           <thead>
//             <tr className="text-left border-b">
//               <th className="py-2">Artwork</th>
//               <th className="py-2">Artist</th>
//               <th className="py-2">Sales</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>"Starry Night"</td>
//               <td>Vincent</td>
//               <td>$2,500</td>
//             </tr>
//             <tr>
//               <td>"Mona Lisa"</td>
//               <td>Leonardo</td>
//               <td>$2,000</td>
//             </tr>
//           </tbody>
//         </table>
//       </div> */}

//       <div className="mb-6 bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold text-gray-700 mb-2">Recent Purchases</h2>
//         <ul className="text-sm text-gray-600 space-y-2">
//           <li>🎨 Artwork <span className="font-medium">"Starry Night"</span> bought by <span className="font-medium">Alice</span></li>
//           <li>🎨 Artwork <span className="font-medium">"Mona Lisa"</span> bought by <span className="font-medium">John</span></li>
//           <li>🎨 Artwork <span className="font-medium">"The Scream"</span> bought by <span className="font-medium">Emma</span></li>
//         </ul>
//       </div>


//       {/* Artists Section */}
//       {/* <div className="mb-6 bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold text-gray-700 mb-2">Artists</h2>
//         <p className="text-sm text-gray-500 mb-4">Manage artists featured in the gallery</p>
//         <p>Total Artists: {totalArtists}</p>
//       </div> */}
      
//       {/* <div className="p-6 space-y-6"> */}
//         {/* Overview Section */}
//         {/* <h2 className="text-2xl font-bold">Dashboard Overview</h2> */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Card className="shadow-md rounded-2xl">
//             <CardHeader>
//               <CardTitle>Total Users</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">1,250</p>
//             </CardContent>
//           </Card>
//           <Card className="shadow-md rounded-2xl">
//             <CardHeader>
//               <CardTitle>Total Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">3,420</p>
//             </CardContent>
//           </Card>
//           <Card className="shadow-md rounded-2xl">
//             <CardHeader>
//               <CardTitle>Total Sales</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold">$45,200</p>
//             </CardContent>
//           </Card>
//         </div> */}

//         {/* Monthly Sales Trend */}
//         <h2 className="text-2xl font-bold">Monthly Sales Trend</h2>
//         {/* <Card className="shadow-md rounded-2xl p-4">
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={salesData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="earnings" stroke="#4F46E5" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </Card> */}
//         <Card className="shadow-md rounded-2xl p-4">
//           <div className="w-full overflow-x-auto">
//             <div className="min-w-[500px]">
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={salesData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="earnings"
//                     stroke="#4F46E5"
//                     strokeWidth={3}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </Card>

        
//         <div className="my-5">
//           <CategoryChart/>
//         </div>
//         <div className="my-5">
//           <PriceRangeChart />
//         </div>
        
//       {/* </div> */}
//     </div>
//   );
// }

// export default Dashboard;









"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import CategoryChart from "./charts/categoryChart";
import PriceRangeChart from "./charts/priceRangeChart";

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

interface Order {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    product: {
      title: string;
    };
    quantity: number;
  }>;
}

interface Artist {
  id: string;
  name: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Dashboard() {
  const { token } = useAuth();
  const router = useRouter();

  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState("");

  // Current Date & Time
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    setCurrentDateTime(now.toLocaleString("en-US", options));

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString("en-US", options));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch Data
  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products
        const productsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/products/all?page=1&limit=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch orders
        const ordersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/orders/?page=1&limit=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch artists
        const artistsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/admin/user/all/arttist/list`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const productsData = productsResponse.data.data || [];
        const ordersData = ordersResponse.data.data.data || [];
        const artistsData = artistsResponse.data.data || [];

        setProducts(productsData);
        setOrders(ordersData);
        setArtists(artistsData);

        // Calculate stats
        const totalRevenue = ordersData.reduce((sum: number, order: Order) => 
          sum + parseFloat(order.totalAmount || "0"), 0);
        
        const lowStockProducts = productsData.filter((product: Product) => 
          parseInt(product.stock || "0") < 10).length;

        setStats({
          totalProducts: productsData.length,
          totalOrders: ordersData.length,
          totalRevenue,
          lowStockProducts
        });

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    if (!token) {
      // router.push("/signIn");
    }
  }, [token, router]);

  // Prepare data for charts
  const monthlySalesData = orders.reduce((acc: any[], order: Order) => {
    const date = new Date(order.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    
    const existingMonth = acc.find(item => item.month === month);
    if (existingMonth) {
      existingMonth.earnings += parseFloat(order.totalAmount);
    } else {
      acc.push({ month, earnings: parseFloat(order.totalAmount) });
    }
    
    return acc;
  }, []).sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  const categoryData = products.reduce((acc: any[], product: Product) => {
    const category = product.category || 'Uncategorized';
    const existingCategory = acc.find(item => item.name === category);
    
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    
    return acc;
  }, []);

  const recentOrders = orders
    .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-xl">Loading Art Gallery Data...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-red-600 text-2xl font-bold">Unauthorized Access</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 text-gray-800">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Art Gallery Dashboard</h1>
        <p className="text-sm text-gray-500">{currentDateTime}</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
            <p className="text-sm text-gray-500">Artworks in gallery</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500">Completed purchases</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Total earnings</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats.lowStockProducts}</p>
            <p className="text-sm text-gray-500">Products needing restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Sales Trend */}
        <Card className="shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-4">Monthly Sales Trend</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                <Bar dataKey="earnings" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-4">Artwork Categories</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} artworks`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="shadow-md rounded-2xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                  <td className="py-2 px-4">{order.user?.name}</td>
                  <td className="py-2 px-4 font-medium">${parseFloat(order.totalAmount).toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'paid' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-4">Price Range Distribution</h2>
          <PriceRangeChart products={products} />
        </Card>
        
        <Card className="shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-4">Category Analysis</h2>
          <CategoryChart products={products} />
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
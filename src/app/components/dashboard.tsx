"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import CategoryChart from "./charts/categoryChart";
import PriceRangeChart from "./charts/priceRangeChart";

const salesData = [
  { month: "Jan", earnings: 4000 },
  { month: "Feb", earnings: 3000 },
  { month: "Mar", earnings: 5000 },
  { month: "Apr", earnings: 4780 },
  { month: "May", earnings: 5890 },
  { month: "Jun", earnings: 6390 },
  { month: "Jul", earnings: 7490 },
]

function Dashboard() {
  const { token } = useAuth();
  const router = useRouter();

  // Artworks & Artists
  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stats
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [stockAvailable, setStockAvailable] = useState(0);

  // Pagination
  const [currentArtworkPage, setCurrentArtworkPage] = useState(1);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [totalArtworksPages, setTotalArtworksPages] = useState(0);
  const rowsPerPageArtwork = 5;

  const [currentArtistPage, setCurrentArtistPage] = useState(1);
  const [totalArtists, setTotalArtists] = useState(0);
  const [totalArtistsPages, setTotalArtistsPages] = useState(0);
  const rowsPerPageArtist = 5;

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

    const fetchArtworks = async () => {
      try {
        const response: any = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/artworks?page=${currentArtworkPage}&limit=${rowsPerPageArtwork}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allArtworks = response?.data?.data || [];
        setTotalArtworks(response?.data?.total || 0);
        setTotalArtworksPages(response?.data?.totalPages || 0);

        setArtworks(allArtworks);
      } catch (err) {
        console.error("Failed to fetch artworks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchArtists = async () => {
      try {
        const response: any = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/artists?page=${currentArtistPage}&limit=${rowsPerPageArtist}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allArtists = response?.data?.data || [];
        setTotalArtists(response?.data?.total || 0);
        setTotalArtistsPages(response?.data?.totalPages || 0);

        setArtists(allArtists);
      } catch (err) {
        console.error("Failed to fetch artists:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response: any = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/stats/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTotalPurchases(response?.data?.totalPurchases || 0);
        setMonthlyEarnings(response?.data?.monthlyEarnings || 0);
        setStockAvailable(response?.data?.stockAvailable || 0);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchArtworks();
    fetchArtists();
    fetchStats();
  }, [token, currentArtworkPage, currentArtistPage]);

  useEffect(() => {
    if (!token) {
      // router.push("/signIn");
    }
  }, [token, router]);

  // Pagination handlers
  const handlePageChangeArtworks = (direction: string) => {
    if (direction === "next" && currentArtworkPage < totalArtworksPages)
      setCurrentArtworkPage((prev) => prev + 1);
    else if (direction === "prev" && currentArtworkPage > 1)
      setCurrentArtworkPage((prev) => prev - 1);
  };

  const handlePageChangeArtists = (direction: string) => {
    if (direction === "next" && currentArtistPage < totalArtistsPages)
      setCurrentArtistPage((prev) => prev + 1);
    else if (direction === "prev" && currentArtistPage > 1)
      setCurrentArtistPage((prev) => prev - 1);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600">{totalPurchases}</p>
        </div>
        {/* <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
          <p className="text-2xl font-bold text-green-600">${monthlyEarnings}</p>
        </div> */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
          <p className="text-2xl font-bold text-green-600">${monthlyEarnings}</p>
          <p className="text-sm text-gray-500 flex items-center">
            <span className="text-green-500 font-medium mr-1">▲ 12%</span> vs last month
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Stock Available</h3>
          <p className="text-2xl font-bold text-purple-600">{stockAvailable}</p>
        </div>
      </div>

      {/* Artworks Section */}
      {/* <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Artworks</h2>
        <p className="text-sm text-gray-500 mb-4">Manage artworks in the gallery</p>
        <p>Total Artworks: {totalArtworks}</p>
      </div> */}

      {/* <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Top Selling Artworks</h2>
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Artwork</th>
              <th className="py-2">Artist</th>
              <th className="py-2">Sales</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>"Starry Night"</td>
              <td>Vincent</td>
              <td>$2,500</td>
            </tr>
            <tr>
              <td>"Mona Lisa"</td>
              <td>Leonardo</td>
              <td>$2,000</td>
            </tr>
          </tbody>
        </table>
      </div> */}

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Recent Purchases</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>🎨 Artwork <span className="font-medium">"Starry Night"</span> bought by <span className="font-medium">Alice</span></li>
          <li>🎨 Artwork <span className="font-medium">"Mona Lisa"</span> bought by <span className="font-medium">John</span></li>
          <li>🎨 Artwork <span className="font-medium">"The Scream"</span> bought by <span className="font-medium">Emma</span></li>
        </ul>
      </div>


      {/* Artists Section */}
      {/* <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Artists</h2>
        <p className="text-sm text-gray-500 mb-4">Manage artists featured in the gallery</p>
        <p>Total Artists: {totalArtists}</p>
      </div> */}
      
      {/* <div className="p-6 space-y-6"> */}
        {/* Overview Section */}
        {/* <h2 className="text-2xl font-bold">Dashboard Overview</h2> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,250</p>
            </CardContent>
          </Card>
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3,420</p>
            </CardContent>
          </Card>
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$45,200</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Monthly Sales Trend */}
        <h2 className="text-2xl font-bold">Monthly Sales Trend</h2>
        {/* <Card className="shadow-md rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card> */}
        <Card className="shadow-md rounded-2xl p-4">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#4F46E5"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        
        <div className="my-5">
          <CategoryChart/>
        </div>
        <div className="my-5">
          <PriceRangeChart />
        </div>
        
      {/* </div> */}
    </div>
  );
}

export default Dashboard;

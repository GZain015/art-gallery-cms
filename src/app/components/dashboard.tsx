"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { all } from "axios";
import { useAuth } from "@/context/AuthContext";

function Dashboard() {
  const { token } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [doctorTypeFilter, setDoctorTypeFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  const [currentAppointmentPage, setCurrentAppointmentPage] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalAppointmentsPages, setTotalAppointmentsPages] = useState(0);
  const rowsPerPageAppointment = 5;
  
  const [currentDoctorPage, setCurrentDoctorPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalDoctorsPages, setTotalDoctorsPages] = useState(0);
  const rowsPerPageDoctor = 5;

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

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;

      try {
        const response : any = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/appointment?page=${currentAppointmentPage}&limit=${rowsPerPageAppointment}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const allAppointments = response?.data?.data || [];
        setTotalAppointments(response?.data?.total || 0);
        setTotalAppointmentsPages(response?.data?.totalPages || 0);
        // console.log('all ', allAppointments)
        console.log('all ', response?.data)
        // const activeAppointments = allAppointments.filter(
        //   (appt) =>
        //     appt.status === "Pending" ||
        //     appt.status === "Confirmed" ||
        //     appt.status === "Completed" ||
        //     appt.status === "Rescheduled" ||
        //     appt.status === "Cancelled"
        // );

        setAppointments(allAppointments);
        setFilteredAppointments(allAppointments);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDoctors = async () => {
      if (!token) return;

      try {
        // const response : any = await axios.get(
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/doctor?page=${currentDoctorPage}&limit=${rowsPerPageDoctor}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const allDoctors = response?.data?.data || [];
        // console.log("allDoctors: ", allDoctors)
        console.log("allDoctors: ", response?.data)
        setTotalDoctors(response?.data?.total || 0);
        setTotalDoctorsPages(response?.data?.totalPages)
        // const activeDoctors = allDoctors.filter(
        //   (appt) =>
        //     appt.status === "PendingApproval" ||
        //     appt.status === "Pending" ||
        //     appt.status === "Active"
        // );

        setDoctors(allDoctors);
        setFilteredDoctors(allDoctors);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
    fetchAppointments();
  }, [token, currentAppointmentPage, currentDoctorPage]);

  useEffect(() => {
    if (!token) {
      // setTimeout(() => router.push("/signIn"), 30000);
    }
  }, [token, router]);


  // console.log("filterd :", filteredAppointments.length)
  // const totalPagesAppointments = Math.ceil(filteredAppointments.length / rowsPerPageAppointment);
  // const totalPagesAppointments = Math.ceil(appointments.length / rowsPerPageAppointment);
  // const paginatedAppointments = filteredAppointments.slice(
  //   (currentAppointmentPage - 1) * rowsPerPageAppointment,
  //   currentAppointmentPage * rowsPerPageAppointment
  // );
  // const paginatedAppointments = filteredAppointments;
  
  // const totalPagesDoctors = Math.ceil(filteredDoctors.length / rowsPerPageDoctor);
  // const paginatedDoctors = filteredDoctors.slice(
  //   (currentDoctorPage - 1) * rowsPerPageDoctor,
  //   currentDoctorPage * rowsPerPageDoctor
  // );
  // const paginatedDoctors = filteredDoctors;

  const handlePageChangeAppointments = (direction: string) => {
    if (direction === "next" && currentAppointmentPage < totalAppointmentsPages)
      setCurrentAppointmentPage((prev) => prev + 1);
    else if (direction === "prev" && currentAppointmentPage > 1)
      setCurrentAppointmentPage((prev) => prev - 1);
  };

  const handlePageChangeDoctors = (direction: string) => {
    if (direction === "next" && currentDoctorPage < totalDoctorsPages)
      setCurrentDoctorPage((prev) => prev + 1);
    else if (direction === "prev" && currentDoctorPage > 1)
      setCurrentDoctorPage((prev) => prev - 1);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-xl">Loading...</p>
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
        <h1 className="text-2xl font-bold text-gray-700">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">{currentDateTime}</p>
      </div>

    </div>
  );
  
}

export default Dashboard;

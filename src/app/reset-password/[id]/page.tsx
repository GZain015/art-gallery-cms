"use client";


import Changepasswordlink from "../../components/changepasswordlink";
import { useParams } from "next/navigation"; // Import useParams to extract the dynamic parameter

export default function DashboardLayout() {
  const { id } = useParams(); // Extract the 'id' parameter from the URL

  return (
    <>
      <Changepasswordlink id={id} /> {/* Pass the ID as a prop */}{" "}
    </>
  );
}

import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // default styling

const NeradniDani = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState(new Set());

  // Helper function to determine if a day is a weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 6 || day === 0; // Saturday (6) or Sunday (0)
  };

  // Update selected days and re-select weekends when the year changes
  useEffect(() => {
    const year = date.getFullYear();
    const newSelectedDays = new Set();
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    let day = new Date(yearStart);
    while (day <= yearEnd) {
      if (isWeekend(day)) {
        newSelectedDays.add(formatDate(day)); // Use local date formatting
      }
      day = new Date(day.setDate(day.getDate() + 1));
    }

    setSelectedDays(newSelectedDays);
  }, [date.getFullYear()]); // Dependency on year change

  const handleDayClick = (value) => {
    const dateStr = formatDate(value); // Use local date formatting
    const newSet = new Set(selectedDays);

    if (newSet.has(dateStr)) {
      newSet.delete(dateStr);
    } else {
      newSet.add(dateStr);
    }
    setSelectedDays(newSet);
    console.log("Selected days: ", Array.from(newSet)); // Keep console logging on day select/deselect
  };

  const handleChange = (value) => {
    setDate(value);
  };

  const formatDate = (date) => {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  const saveDays = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      console.error("No token found, redirecting to login.");
      // Redirect logic here, e.g., history.push('/login') or other appropriate action
      return;
    }

    const daysArray = Array.from(selectedDays);
    console.log("Spremanje neradnih dana:", daysArray); // Log days before sending them

    const response = await fetch(
      "http://192.168.2.100/ERP-API/public/api/neradni/bulk",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ datumi: daysArray }),
      }
    );

    if (response.ok) {
      console.log("Neradni dani uspješno spremljeni!");
    } else {
      console.error("Failed to save days in bulk. Status:", response.status);
    }
  };

  return (
    <div>
      sa
      <Calendar
        onChange={handleChange}
        value={date}
        onClickDay={handleDayClick}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const dateStr = formatDate(date);
            if (selectedDays.has(dateStr)) {
              return (
                <div style={{ backgroundColor: "darkblue", color: "white" }}>
                  {date.getDate()}
                </div>
              );
            }
          }
        }}
      />
      <div style={{ paddingTop: "1%" }}>
        <Button onClick={saveDays} variant="contained">
          Spremi neradne dane
        </Button>
      </div>
    </div>
  );
};

export default NeradniDani;

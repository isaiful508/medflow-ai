"use client";

import { useState } from "react";
import { doctors, timeSlotsByDay } from "@/lib/medflow-ai-data";
import { AppointmentsScreen } from "@/components/modules/dashboard/appointments-screen";

export default function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(0);
  const [selectedDay, setSelectedDay] = useState("21");
  const [selectedTime, setSelectedTime] = useState("09:30");

  const confirmDoctor = doctors[selectedDoctor] ?? doctors[0];
  const timeSlots = timeSlotsByDay[selectedDay] ?? timeSlotsByDay["21"];

  return (
    <AppointmentsScreen
      doctorsList={doctors}
      selectedDoctor={selectedDoctor}
      onDoctorSelect={setSelectedDoctor}
      selectedDay={selectedDay}
      onDaySelect={setSelectedDay}
      selectedTime={selectedTime}
      onTimeSelect={setSelectedTime}
      confirmDoctor={confirmDoctor}
      timeSlots={timeSlots}
    />
  );
}

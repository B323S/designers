"use client";

import dynamic from "next/dynamic";
import React from "react";

const GuestTaskCard = dynamic(() => import("./GuestTaskCard"), { ssr: false });

export default function GuestTaskCardClient() {
  return <GuestTaskCard />;
}

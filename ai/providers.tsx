"use client"

import type React from "react"

import { AI } from "ai/react"

export function AIProvider({ children }: { children: React.ReactNode }) {
  return <AI>{children}</AI>
}

"use client"

import type React from "react"

import { AI } from "@ai-sdk/react"
import { chat } from "@/ai/chat" // Corrected import path

export function AIProvider({ children }: { children: React.ReactNode }) {
  return (
    <AI initialAIState={{ chatId: Date.now().toString(), messages: [] }} actions={{ chat }}>
      {children}
    </AI>
  )
}

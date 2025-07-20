"use client"
import { toast } from "sonner"

type Toast = typeof toast

export function useToast(): { toast: Toast } {
  return { toast }
}

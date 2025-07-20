"use client"

import { useLayoutEffect } from "react"

export function useLockBodyScroll(lock: boolean) {
  useLayoutEffect(() => {
    if (lock) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [lock])
}

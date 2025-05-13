"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { Input } from "@/components/ui/input"

interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string
  onValueChange: (value: string) => void
}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ value, onValueChange, placeholder, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value || "")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value

      // Limita a entrada para o formato HH:MM
      if (newValue) {
        // Remove caracteres não numéricos, exceto ":"
        newValue = newValue.replace(/[^\d:]/g, "")

        // Adiciona ":" automaticamente após as horas
        if (newValue.length === 2 && !newValue.includes(":")) {
          newValue = `${newValue}:`
        }

        // Limita a 5 caracteres (HH:MM)
        if (newValue.length > 5) {
          newValue = newValue.slice(0, 5)
        }

        // Valida o formato HH:MM
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/
        if (newValue.length === 5 && !timeRegex.test(newValue)) {
          // Se inválido, não atualiza
          return
        }
      }

      setInternalValue(newValue)
      onValueChange(newValue)
    }

    return (
      <Input
        ref={ref}
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder || "HH:MM"}
        {...props}
      />
    )
  },
)

TimeInput.displayName = "TimeInput"

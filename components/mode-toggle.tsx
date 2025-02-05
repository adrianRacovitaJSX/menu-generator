"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Esperar a que el componente se monte para evitar el error de hidratación
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // No renderizar nada hasta que el componente esté montado
  if (!mounted) {
    return <Button variant="ghost" size="icon" aria-label="Toggle theme">
      <Sun className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <Sun 
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
      />
      <Moon 
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
      />
    </Button>
  )
}
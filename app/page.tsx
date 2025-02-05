"use client";
import MenuForm from "@/components/menu/menu-form";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto flex justify-end mb-4">
        <ModeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto text-center mb-8"
      >
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold">Generador de menús</h1>
        </div>
      </motion.div>
      <MenuForm />
      <footer className="text-center text-gray-600 mt-8">
        <p>© {new Date().getFullYear()} El Reino de Drácula</p>
      </footer>
    </main>
  );
}

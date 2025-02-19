"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMenuStore } from "@/lib/store";
import { generatePDF } from "@/lib/pdf";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  FileDown,
  LanguagesIcon,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

export default function MenuForm() {
  const store = useMenuStore();

  const formatSelectedDate = (date: Date | null | undefined) => {
    if (!date) return null;

    // Si es string, convertir a Date
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Verificar si la fecha es válida
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return null;
    }

    return format(dateObj, "dd/MM/yyyy");
  };

  const onGeneratePDF = async () => {
    try {
      await generatePDF(store);
      toast.success(store.language === "es" ? "PDF generado" : "PDF generat");
    } catch (error) {
      toast.error(
        store.language === "es"
          ? "Error al generar PDF"
          : "Eroare la generarea PDF"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle className="text-center text-3xl">
            El Reino de Drácula
          </CardTitle>
          <div className="flex justify-between items-center gap-4">
            <Select
              value={store.language}
              onValueChange={(value: "es" | "ro") => store.setLanguage(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
                <SelectItem value="ro">🇷🇴 Română</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatSelectedDate(store.selectedDate) ||
                    (store.language === "es"
                      ? "Seleccionar fecha"
                      : "Selectați data")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={store.selectedDate}
                  onSelect={(date) => {
                    // Asegurarse de que la fecha es válida antes de guardarla
                    if (date && !isNaN(date.getTime())) {
                      store.setSelectedDate(date);
                    }
                  }}
                  initialFocus
                  weekStartsOn={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>
              {store.language === "es" ? "Primeros Platos" : "Felul Întâi"}
            </Label>
            {store.firstCourses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <Input
                  value={course.name}
                  onChange={(e) =>
                    store.updateFirstCourse(index, e.target.value)
                  }
                  placeholder={
                    store.language === "es"
                      ? "Nombre del plato"
                      : "Numele preparatului"
                  }
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => store.removeFirstCourse(index)}
                  disabled={store.firstCourses.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            <Button onClick={store.addFirstCourse} variant="outline">
              <ChevronRight className="w-4 h-4 mr-2" />
              {store.language === "es"
                ? "Añadir Primer Plato"
                : "Adăugați Primul Fel"}
            </Button>
          </div>

          <div className="space-y-4">
            <Label>
              {store.language === "es" ? "Segundos Platos" : "Felul Doi"}
            </Label>
            {store.secondCourses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <Input
                  value={course.name}
                  onChange={(e) =>
                    store.updateSecondCourse(index, e.target.value)
                  }
                  placeholder={
                    store.language === "es"
                      ? "Nombre del plato"
                      : "Numele preparatului"
                  }
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => store.removeSecondCourse(index)}
                  disabled={store.secondCourses.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            <Button onClick={store.addSecondCourse} variant="outline">
              <ChevronRight className="w-4 h-4 mr-2" />
              {store.language === "es"
                ? "Añadir Segundo Plato"
                : "Adăugați Al Doilea Fel"}
            </Button>
          </div>

          <div className="flex gap-4">
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button onClick={onGeneratePDF} className="w-full">
                <FileDown className="w-4 h-4 mr-2" />
                {store.language === "es" ? "Generar PDF" : "Generați PDF"}
              </Button>
            </motion.div>
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => {
                  store.setLanguage("es");
                  store.resetCourses();
                  toast.success(
                    store.language === "es"
                      ? "Menú reseteado"
                      : "Meniul a fost resetat"
                  );
                }}
                variant="outline"
                className="w-full"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                {store.language === "es" ? "Resetear Menú" : "Resetați Meniul"}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

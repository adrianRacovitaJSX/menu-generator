import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
  Globe,
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { format } from "date-fns";

export default function MenuForm() {
  const store = useMenuStore();
  const [isLoading, setIsLoading] = useState(false);

  const formatSelectedDate = (date: Date | null | undefined) => {
    if (!date) return null;
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return null;
    }
    return format(dateObj, "dd/MM/yyyy");
  };

  const onGeneratePDF = async () => {
    if (!store.selectedDate) {
      toast.error(
        store.language === "es" 
          ? "Por favor, selecciona una fecha" 
          : "Vă rugăm să selectați o dată"
      );
      return;
    }

    if (!store.firstCourses.some(course => course.name) || 
        !store.secondCourses.some(course => course.name)) {
      toast.error(
        store.language === "es"
          ? "Añade al menos un plato en cada sección"
          : "Adăugați cel puțin un fel de mâncare în fiecare secțiune"
      );
      return;
    }

    setIsLoading(true);
    try {
      await generatePDF(store);
      
      const messages = {
        es: {
          success: "¡Menú generado y publicado!",
          details: "PDF generado y menú actualizado en la web"
        },
        ro: {
          success: "Meniu generat și publicat!",
          details: "PDF generat și meniu actualizat pe web"
        }
      };

      toast.success(messages[store.language].success, {
        description: messages[store.language].details,
        duration: 5000
      });

    } catch (error) {
      const errorMessages = {
        es: {
          both: "Error al generar PDF y publicar en la web"
        },
        ro: {
          both: "Eroare la generarea PDF și publicarea pe web"
        }
      };

      toast.error(errorMessages[store.language].both, {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Header */}
        <header className="space-y-2">
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            El Reino de Drácula
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-base text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {store.language === "es" 
              ? "Sistema de Gestión del Menú Diario" 
              : "Sistem de Gestionare a Meniului Zilnic"}
          </motion.p>
        </header>

        {/* Main Form */}
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <Select
                value={store.language}
                onValueChange={(value: "es" | "ro") => store.setLanguage(value)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="ro">🇷🇴 Română</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto relative"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {formatSelectedDate(store.selectedDate) ||
                      (store.language === "es"
                        ? "Seleccionar fecha"
                        : "Selectați data")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={store.selectedDate}
                    onSelect={(date) => {
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

            {/* Menu Sections */}
            <div className="space-y-6">
              {/* First Courses */}
              <section className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium">
                    {store.language === "es" ? "Primeros Platos" : "Felul Întâi"}
                  </Label>
                  <Button 
                    onClick={store.addFirstCourse} 
                    variant="ghost" 
                    size="sm"
                    className="h-8 hover:bg-accent"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {store.language === "es" ? "Añadir" : "Adăugați"}
                  </Button>
                </div>
                
                <AnimatePresence>
                  {store.firstCourses.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-2"
                    >
                      <Input
                        value={course.name}
                        onChange={(e) => store.updateFirstCourse(index, e.target.value)}
                        placeholder={
                          store.language === "es"
                            ? "Nombre del plato"
                            : "Numele preparatului"
                        }
                        className="flex-grow"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => store.removeFirstCourse(index)}
                        disabled={store.firstCourses.length === 1}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </section>

              {/* Second Courses */}
              <section className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium">
                    {store.language === "es" ? "Segundos Platos" : "Felul Doi"}
                  </Label>
                  <Button 
                    onClick={store.addSecondCourse} 
                    variant="ghost" 
                    size="sm"
                    className="h-8 hover:bg-accent"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {store.language === "es" ? "Añadir" : "Adăugați"}
                  </Button>
                </div>
                
                <AnimatePresence>
                  {store.secondCourses.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-2"
                    >
                      <Input
                        value={course.name}
                        onChange={(e) => store.updateSecondCourse(index, e.target.value)}
                        placeholder={
                          store.language === "es"
                            ? "Nombre del plato"
                            : "Numele preparatului"
                        }
                        className="flex-grow"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => store.removeSecondCourse(index)}
                        disabled={store.secondCourses.length === 1}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </section>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button 
                  onClick={onGeneratePDF} 
                  className="w-full h-11 text-base relative" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {store.language === "es" ? "Procesando..." : "Se procesează..."}
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4 mr-2" />
                      <Globe className="w-4 h-4 mr-2" />
                      {store.language === "es" ? "Generar PDF y Publicar" : "Generați PDF și Publicați"}
                    </>
                  )}
                </Button>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-3">
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
                  className="w-full sm:flex-1"
                  disabled={isLoading}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  {store.language === "es" ? "Resetear Menú" : "Resetați Meniul"}
                </Button>

                <a 
                  href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/menu-del-dia`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <UtensilsCrossed className="w-4 h-4 mr-2" />
                    {store.language === "es" ? "Ver en Web" : "Vezi pe Web"}
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
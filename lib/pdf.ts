import jsPDF from "jspdf";
import type { MenuStore } from "./store";

export const generatePDF = (store: MenuStore) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPos = margin;

  // Cabecera
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(40, 40, 40);
  doc.text("El Reino de Drácula", pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  // Fecha
  doc.setFontSize(18);
  doc.setTextColor(80, 80, 80);
  const menuDate = store.selectedDate || new Date();
  const formatDate = (date: Date, language: string) => {
    if (language === 'ro') {
      const months = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];    
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
   };
  
  const dateStr = formatDate(new Date(menuDate), store.language);

  doc.text(
    store.language === "es" ? "Menú del Día" : "Meniu Zilei",
    pageWidth / 2,
    yPos,
    { align: "center" }
  );
  yPos += 10;
  doc.text(dateStr, pageWidth / 2, yPos, { align: "center" });
  yPos += 25;

  // Primeros platos
  doc.setFontSize(20);
  doc.setTextColor(100, 100, 100);
  doc.text(
    store.language === "es" ? "Primeros Platos" : "Felul Întâi",
    pageWidth / 2,
    yPos,
    { align: "center" }
  );
  yPos += 15;

  // Platos destacados
  doc.setFont("helvetica", "normal");
  doc.setFontSize(26);
  doc.setTextColor(20, 20, 20);
  store.firstCourses.forEach((course) => {
    if (course.name) {
      doc.text(course.name.toUpperCase(), pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 15;
    }
  });

  yPos += 15;

  // Segundos platos
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(100, 100, 100);
  doc.text(
    store.language === "es" ? "Segundos Platos" : "Felul Doi",
    pageWidth / 2,
    yPos,
    { align: "center" }
  );
  yPos += 15;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(26);
  doc.setTextColor(20, 20, 20);
  store.secondCourses.forEach((course) => {
    if (course.name) {
      doc.text(course.name.toUpperCase(), pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 15;
    }
  });

  // Pie de página
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text("El Reino de Drácula", pageWidth / 2, pageHeight - 15, {
    align: "center",
  });

  const filename = `menu-${new Date(menuDate)
    .toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-")}.pdf`;

  doc.save(filename);
};

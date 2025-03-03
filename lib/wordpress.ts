import type { MenuStore } from "./store";

interface MenuData {
  date: string;
  first_courses: string[];
  second_courses: string[];
  language: 'es' | 'ro';
}

function generateWordPressContent(menuData: MenuData): string {
  const content = `
    <!-- wp:group {"className":"menu-dia-content"} -->
    <div class="wp-block-group menu-dia-content">
      <!-- wp:heading {"level":2,"className":"menu-dia-title"} -->
      <h2 class="menu-dia-title">${menuData.language === 'es' ? 'Menú del Día' : 'Meniu Zilei'}</h2>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"className":"menu-dia-date"} -->
      <p class="menu-dia-date">${menuData.date}</p>
      <!-- /wp:paragraph -->

      <!-- wp:heading {"level":3,"className":"menu-section-title"} -->
      <h3 class="menu-section-title">${menuData.language === 'es' ? 'Primeros Platos' : 'Felul Întâi'}</h3>
      <!-- /wp:heading -->

      <!-- wp:list {"className":"menu-items"} -->
      <ul class="menu-items">
        ${menuData.first_courses.map(course => `<li>${course}</li>`).join('')}
      </ul>
      <!-- /wp:list -->

      <!-- wp:heading {"level":3,"className":"menu-section-title"} -->
      <h3 class="menu-section-title">${menuData.language === 'es' ? 'Segundos Platos' : 'Felul Doi'}</h3>
      <!-- /wp:heading -->

      <!-- wp:list {"className":"menu-items"} -->
      <ul class="menu-items">
        ${menuData.second_courses.map(course => `<li>${course}</li>`).join('')}
      </ul>
      <!-- /wp:list -->
    </div>
    <!-- /wp:group -->
  `;

  return content.trim();
}

export async function sendToWordPress(store: MenuStore) {
  try {
    // Asegurarse de que tenemos una fecha válida
    if (!store.selectedDate) {
      throw new Error(
        store.language === 'es'
          ? 'No se ha seleccionado una fecha para el menú'
          : 'Nu a fost selectată o dată pentru meniu'
      );
    }
    
    const menuDate = new Date(store.selectedDate);
    if (isNaN(menuDate.getTime())) {
      throw new Error(
        store.language === 'es'
          ? 'La fecha seleccionada no es válida'
          : 'Data selectată nu este validă'
      );
    }
    
    const dateStr = formatDate(menuDate, store.language);
    
    // Filtrar platos vacíos
    const validFirstCourses = store.firstCourses
      .filter(course => course.name && course.name.trim() !== '')
      .map(course => course.name);
      
    const validSecondCourses = store.secondCourses
      .filter(course => course.name && course.name.trim() !== '')
      .map(course => course.name);
      
    if (validFirstCourses.length === 0 || validSecondCourses.length === 0) {
      throw new Error(
        store.language === 'es'
          ? 'Debes incluir al menos un plato en cada sección'
          : 'Trebuie să incluzi cel puțin un fel de mâncare în fiecare secțiune'
      );
    }
    
    const menuData: MenuData = {
      date: dateStr,
      first_courses: validFirstCourses,
      second_courses: validSecondCourses,
      language: store.language
    };

    console.log('Enviando menú a WordPress:', {
      date: dateStr,
      firstCoursesCount: validFirstCourses.length,
      secondCoursesCount: validSecondCourses.length,
      language: store.language
    });

    const response = await fetch('/api/update-menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menu_content: generateWordPressContent(menuData),
        date: dateStr,
        language: store.language
      })
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || 'Error desconocido al actualizar el menú';
      } catch (e) {
        errorMessage = `Error HTTP ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Respuesta de WordPress:', result);
    
    return result;
  } catch (error) {
    console.error('Error al enviar a WordPress:', error);
    throw error;
  }
}

// Función para formatear la fecha según el idioma
const formatDate = (date: Date, language: string) => {
  if (language === 'ro') {
    const months = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];    
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  
  // Para español
  try {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    // Fallback por si hay problemas con el locale
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }
};
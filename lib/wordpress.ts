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
    const menuDate = store.selectedDate || new Date();
    const dateStr = formatDate(new Date(menuDate), store.language);
    
    const menuData: MenuData = {
      date: dateStr,
      first_courses: store.firstCourses
        .filter(course => course.name)
        .map(course => course.name),
      second_courses: store.secondCourses
        .filter(course => course.name)
        .map(course => course.name),
      language: store.language
    };

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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar el menú');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending to WordPress:', error);
    throw error;
  }
}

// Mantener la función formatDate que ya tenías
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
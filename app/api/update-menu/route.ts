import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!process.env.WORDPRESS_URL) {
      console.error('WORDPRESS_URL no está configurado en las variables de entorno');
      return NextResponse.json(
        { error: 'Error de configuración: WORDPRESS_URL no está definido' },
        { status: 500 }
      );
    }

    if (!process.env.WORDPRESS_API_KEY) {
      console.error('WORDPRESS_API_KEY no está configurado en las variables de entorno');
      return NextResponse.json(
        { error: 'Error de configuración: WORDPRESS_API_KEY no está definido' },
        { status: 500 }
      );
    }

    console.log(`Enviando datos al endpoint: ${process.env.WORDPRESS_URL}/wp-json/menu-diario/v1/actualizar`);
    
    const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/menu-diario/v1/actualizar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.WORDPRESS_API_KEY
      },
      body: JSON.stringify(data)
    });

    // Convertir la respuesta a texto para depuración
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`Error del servidor WordPress (${response.status}):`, responseText);
      
      let errorMessage;
      try {
        // Intentar parsear como JSON si es posible
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || 'Error desconocido desde WordPress';
      } catch (e) {
        // Si no es JSON, usar el texto completo
        errorMessage = responseText || `Error HTTP ${response.status}`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // Parsear la respuesta exitosa
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.warn('La respuesta no es un JSON válido:', responseText);
      responseData = { success: true, message: 'Menú actualizado correctamente' };
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error interno:', error);
    
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : 'Error interno del servidor';
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
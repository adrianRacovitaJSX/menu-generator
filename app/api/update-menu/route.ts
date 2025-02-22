import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/menu-diario/v1/actualizar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.WORDPRESS_API_KEY || ''
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Error al actualizar el menú' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
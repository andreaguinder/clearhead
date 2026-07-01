import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  // 🌟 Inicializamos la API Key ACÁ adentro. Así Next.js no rompe al compilar.
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error("Error: RESEND_API_KEY no está configurada en las variables de entorno.");
    return NextResponse.json({ error: 'Configuración del servidor incompleta' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const { email, boardId } = await request.json();

    if (!email || !boardId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}?board=${boardId}`;

    const data = await resend.emails.send({
      from: 'ClearHead <onboarding@resend.dev>',
      to: [email],
      subject: '¡Te invitaron a colaborar en un tablero de ClearHead!',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4f46e5; text-align: center;">¡Hola!</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.5;">
            Te invitaron a formar parte de un espacio de trabajo colaborativo en <strong>ClearHead</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              Ir al Tablero Compartido
            </a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
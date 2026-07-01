import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializamos Resend con la API Key que vas a guardar en tu .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, boardId } = await request.json();

    if (!email || !boardId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Armamos el enlace dinámico al tablero de tu app
    // En desarrollo será localhost:3000, en producción tu dominio real
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}?board=${boardId}`;

    const data = await resend.emails.send({
      from: 'ClearHead <onboarding@resend.dev>', // Resend te da este dominio por defecto para pruebas
      to: [email],
      subject: '¡Te invitaron a colaborar en un tablero de ClearHead!',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4f46e5; text-align: center;">¡Hola!</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.5;">
            Te invitaron a formar parte de un espacio de trabajo colaborativo en <strong>ClearHead</strong> para organizar tareas de forma inteligente.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              Ir al Tablero Compartido
            </a>
          </div>
          <p style="font-size: 12px; color: #666; text-align: center;">
            Si el botón no funciona, podés copiar y pegar este enlace en tu navegador:<br>
            <a href="${inviteLink}" style="color: #4f46e5;">${inviteLink}</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
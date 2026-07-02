import { NextResponse } from 'next/server';
import { Resend } from 'resend';
// Importás tus funciones para consultar tu base de datos (Firebase, Supabase, etc.)
// import { getTasksByDueDate, getBoardById, getMembersByIds } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Calcular fecha (dentro de 2 días)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const targetDateString = targetDate.toISOString().split('T')[0];

    // 2. Traer tareas que vencen ese día (Ficticio, acá usás tu DB)
    // const tasksToNotify = await getTasksByDueDate(targetDateString);
    const tasksToNotify: any[] = []; 

    for (const task of tasksToNotify) {
      // Si la tarea no tiene a nadie asignado, no mandamos mail
      if (!task.assignedTo || task.assignedTo.length === 0) continue;

      // 3. 🚀 MAGIA: Vamos a buscar el tablero específico de esta tarea para saber el nombre
      // const board = await getBoardById(task.boardId);
      const boardName = "Tablero del Laburo"; // Ejemplo dinámico: board.name

      // 4. Vamos a buscar los emails reales de los usuarios asignados a esta tarea
      // const assignedUsers = await getMembersByIds(task.assignedTo);
      // const emails = assignedUsers.map(u => u.email);
      const emails = ['compañero@laburo.com']; 

      // 5. Formateamos la fecha para el mail (DD/MM)
      const [year, month, day] = task.dueDate.split('-');
      const formattedDate = `${day}/${month}`;

      // 6. Mandamos el mail súper específico
      await resend.emails.send({
        from: 'Zylos <onboarding@resend.dev>', // Cambiar por tu dominio real en producción
        to: emails,
        subject: `⏰ [${boardName}] "${task.title}" vence en 2 días`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; background-color: #f8fafc; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0;">
            
            <div style="margin-bottom: 24px;">
              <span style="background-color: #4f46e5; color: white; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 14px;">Zylos Alerts</span>
            </div>

            <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">¡Hola! Tenés una entrega próxima</h2>
            
            <p style="font-size: 16px; line-height: 1.5; color: #334155;">
              Te recordamos que una tarea en la que estás asignado está muy cerca de vencer:
            </p>

            <div style="background-color: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; display: block; margin-bottom: 4px;">Tablero de trabajo</span>
              <strong style="font-size: 14px; color: #4f46e5; display: block; margin-bottom: 12px;">${boardName}</strong>
              
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; display: block; margin-bottom: 4px;">Tarea</span>
              <span style="font-size: 16px; font-weight: 600; color: #0f172a; display: block; margin-bottom: 12px;">${task.title}</span>
              
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; display: block; margin-bottom: 4px;">Fecha límite</span>
              <span style="font-size: 14px; font-weight: 600; color: #ea580c;">⏳ Rinde el ${formattedDate}</span>
            </div>

            <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
              Ingresá a Zylos para actualizar el estado del tablero o dejar un comentario sobre el avance.
            </p>

            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">Este es un aviso automático de Zylos para tu cuenta.</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, processed: tasksToNotify.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
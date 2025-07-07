/**
 * Envia { message, groups } para o webhook definido em src/config.ts.
 * Lança erro se o retorno não for 2xx.
 */
import { WEBHOOK } from '../config';

export async function broadcast(message: string, groups: string[]) {
  if (!message.trim() || groups.length === 0) {
    throw new Error('Mensagem vazia ou nenhum grupo selecionado.');
  }

  const res = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, groups }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Webhook ${res.status}: ${txt}`);
  }

  return res.json(); // opcional, caso o n8n devolva algo
}
/** Cierra un WebSocket sin warning si aún está en CONNECTING (React Strict Mode) */
export function safeCloseWebSocket(ws: WebSocket | null | undefined): void {
  if (!ws) return;

  ws.onopen = null;
  ws.onmessage = null;
  ws.onerror = null;
  ws.onclose = null;

  const { readyState } = ws;
  if (readyState === WebSocket.CLOSED || readyState === WebSocket.CLOSING) return;

  if (readyState === WebSocket.CONNECTING) {
    ws.addEventListener(
      'open',
      () => {
        try {
          ws.close();
        } catch {
          /* ignore */
        }
      },
      { once: true },
    );
    return;
  }

  try {
    ws.close();
  } catch {
    /* ignore */
  }
}

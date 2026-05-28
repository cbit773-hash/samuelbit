/** Comparación de rutas para navegación (pathname + query) */
export function isNavItemActive(pathname: string, search: string, to: string): boolean {
  const current = pathname + search;
  if (to.includes('?')) {
    return current === to;
  }
  const toPath = to.split('?')[0];
  return pathname === toPath || pathname.startsWith(`${toPath}/`);
}

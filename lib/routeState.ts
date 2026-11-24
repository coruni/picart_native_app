// 当前路由快照（非 React 环境用）。
let currentPathname = "/";

export function setCurrentPathname(pathname: string): void {
  currentPathname = pathname || "/";
}

export function getCurrentPathname(): string {
  return currentPathname;
}

export function isAuthRoute(): boolean {
  return currentPathname.startsWith("/auth");
}

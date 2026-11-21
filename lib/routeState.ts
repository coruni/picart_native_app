/**
 * 当前路由快照（非 React 环境用）。
 *
 * expo-router 没有暴露「当前 pathname」的命令式读取接口，但请求拦截器
 * 需要在 401 时判断「是不是已经在登录页」。如果已经在登录页还去
 * replace("/auth")，会把用户正在输入的登录表单整个重挂，表现就是
 * 输密码输到一半被清空、或者登录页与首页来回跳。
 *
 * 由 app/_layout.tsx 用 usePathname() 持续写入。
 */
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

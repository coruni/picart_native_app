// 生成客户端前先跑这里。
//
// openapi.json 是后端导出的产物，每次重新导出都会把 /user/register 的小写 `device-id`
// header 打回必填，生成器于是把 body 挤到第二个参数（register(deviceId, body, …)），
// 而这台设备的设备号本来由 api/client.ts 的默认 header 统一带。
//
// 所以这里把它改成可选，输出一份临时 spec 给生成器用；openapi.json 保持与后端一致，
// 谁重新导出都不用再手工改一遍。
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "openapi.json";
const OUT = ".openapi.patched.json";

const spec = JSON.parse(readFileSync(SRC, "utf8"));
const params = spec.paths?.["/user/register"]?.post?.parameters ?? [];
const deviceId = params.find((p) => p.in === "header" && p.name === "device-id");

if (deviceId) {
  deviceId.required = false;
  deviceId.description = "设备标识（可选；前端由默认 header 统一带，与登录同口径，缺省 20016）";
}

writeFileSync(OUT, JSON.stringify(spec, null, 2));
console.log(
  `[openapi] ${OUT} 就绪，/user/register 的 device-id ${deviceId ? "→ 可选" : "未找到，跳过"}`,
);

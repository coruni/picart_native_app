import type { AxiosResponse } from "axios";
import api from "./client";
import type {
  DtoChangePasswordRequest,
  DtoEmailCodeRequest,
  DtoResetPasswordRequest,
} from "./generated";

// 这 3 个接口后端 openapi 还没写 requestBody（DTO 本身已经在 components 里），
// 生成器把 body 参数吞成了第一个 header 参数。这里把 body 手动补回去，
// 等 spec 补全后删掉本文件、直接调 api。对应交接文档 docs/api-compat-handover.md。

type Sender<TBody> = (body: TBody) => Promise<AxiosResponse<unknown>>;

export function sendVerificationCode(body: DtoEmailCodeRequest) {
  return (
    api.userControllerSendVerificationCode as unknown as Sender<DtoEmailCodeRequest>
  )(body);
}

export function changePassword(body: DtoChangePasswordRequest) {
  return (
    api.userControllerChangePassword as unknown as Sender<DtoChangePasswordRequest>
  )(body);
}

export function resetPassword(body: DtoResetPasswordRequest) {
  return (
    api.userControllerResetPassword as unknown as Sender<DtoResetPasswordRequest>
  )(body);
}

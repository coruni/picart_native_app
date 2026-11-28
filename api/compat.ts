import type { AxiosResponse } from "axios";
import api from "./client";
import type {
  AuthControllerSendSmsCode200Response,
  DtoChangePasswordRequest,
  DtoEmailCodeRequest,
  DtoResetPasswordRequest,
  DtoSmsCodeRequest,
  DtoSmsLoginRequest,
  QqOAuthControllerWebCallback200Response,
} from "./generated";

// 这几个接口后端 openapi 还没写 requestBody（DTO 本身已经在 components 里），
// 生成器把 body 参数吞成了第一个 header 参数。这里把 body 手动补回去，
// 等 spec 补全后删掉本文件、直接调 api。对应交接文档 docs/api-compat-handover.md。

type BodyCall<TBody, TRes> = (body: TBody) => Promise<AxiosResponse<TRes>>;

function withBody<TBody, TRes>(endpoint: unknown): BodyCall<TBody, TRes> {
  return endpoint as BodyCall<TBody, TRes>;
}

export function sendVerificationCode(body: DtoEmailCodeRequest) {
  return withBody<
    DtoEmailCodeRequest,
    AuthControllerSendSmsCode200Response
  >(api.userControllerSendVerificationCode)(body);
}

export function changePassword(body: DtoChangePasswordRequest) {
  return withBody<
    DtoChangePasswordRequest,
    AuthControllerSendSmsCode200Response
  >(api.userControllerChangePassword)(body);
}

export function resetPassword(body: DtoResetPasswordRequest) {
  return withBody<
    DtoResetPasswordRequest,
    AuthControllerSendSmsCode200Response
  >(api.userControllerResetPassword)(body);
}

/** 发送短信验证码（scene 传 login） */
export function sendSmsCode(body: DtoSmsCodeRequest) {
  return withBody<DtoSmsCodeRequest, AuthControllerSendSmsCode200Response>(
    api.authControllerSendSmsCode,
  )(body);
}

/** 手机验证码登录，返回体与账号密码登录一致 */
export function smsLogin(body: DtoSmsLoginRequest) {
  return withBody<DtoSmsLoginRequest, QqOAuthControllerWebCallback200Response>(
    api.authControllerSmsLogin,
  )(body);
}

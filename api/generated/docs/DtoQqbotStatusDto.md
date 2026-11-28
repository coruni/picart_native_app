# DtoQqbotStatusDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**app_id** | **string** | AppID 便于运维核对填错（AppID 是公开标识，不敏感）。 | [optional] [default to undefined]
**configured** | **boolean** | Configured 凭据是否齐全（app_id + app_secret；webhook 验签另需 bot_secret）。 | [optional] [default to undefined]
**enabled** | **boolean** | Enabled 总开关（qqbot_enabled）。 | [optional] [default to undefined]
**missing** | **Array&lt;string&gt;** | Missing 缺失的配置 key 列表（空时 []）。 | [optional] [default to undefined]
**outbox_deferred** | **number** |  | [optional] [default to undefined]
**outbox_failed** | **number** |  | [optional] [default to undefined]
**outbox_pending** | **number** | 池子积压（运维最关心的一组数字）。 | [optional] [default to undefined]
**outbox_sent** | **number** |  | [optional] [default to undefined]
**pending_applications** | **number** | PendingApplications 待审批申请数。 | [optional] [default to undefined]
**recent_error** | **string** | RecentError / RecentErrorAt 最近一次投递失败的归类与时间（无失败时不传时间）。 | [optional] [default to undefined]
**recent_error_at** | **string** |  | [optional] [default to undefined]
**token_error** | **string** | TokenError 取 token 失败时的归类标签（retryable / config / unknown…），成功时 \&quot;\&quot;。 | [optional] [default to undefined]
**token_ok** | **boolean** | TokenOK 拉一次 access_token 是否成功（Enabled&#x3D;false 或未配置时恒 false）。 | [optional] [default to undefined]
**webhook_ready** | **boolean** | WebhookReady bot_secret 是否已配置（缺它 webhook 一律验签失败）。 | [optional] [default to undefined]

## Example

```typescript
import { DtoQqbotStatusDto } from './api';

const instance: DtoQqbotStatusDto = {
    app_id,
    configured,
    enabled,
    missing,
    outbox_deferred,
    outbox_failed,
    outbox_pending,
    outbox_sent,
    pending_applications,
    recent_error,
    recent_error_at,
    token_error,
    token_ok,
    webhook_ready,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

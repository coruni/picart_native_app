# DtoQqbotOutboxDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**attempts** | **number** |  | [optional] [default to undefined]
**content** | **string** | Content 待发文本（**原样返回**：这是排查发件池问题的唯一线索）。 | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**invite_code** | **string** | InviteCode 本任务要发放的邀请码（仅 INVITE_CODE 类型有值，其它为空串）。 | [optional] [default to undefined]
**kind** | **string** | Kind INVITE_CODE / REJECT / CHAT / AUTO_REPLY。 | [optional] [default to undefined]
**last_code** | **number** |  | [optional] [default to undefined]
**last_error** | **string** | LastError / LastCode / LastKind 最后失败详情（LastKind 取 SDK 的 ErrorKind： retryable / window_expired / permanent / config / invalid_argument）。 | [optional] [default to undefined]
**last_kind** | **string** |  | [optional] [default to undefined]
**msg_seq** | **number** |  | [optional] [default to undefined]
**msg_type** | **number** |  | [optional] [default to undefined]
**next_retry_at** | **string** |  | [optional] [default to undefined]
**open_id** | **string** |  | [optional] [default to undefined]
**ref_id** | **string** |  | [optional] [default to undefined]
**reply_msg_at** | **string** |  | [optional] [default to undefined]
**reply_msg_id** | **string** | ReplyMsgID / ReplyMsgAt 被动回复源消息与其到达时间（窗口判定依据）。 | [optional] [default to undefined]
**sender_id** | **string** |  | [optional] [default to undefined]
**sent_at** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoQqbotOutboxDto } from './api';

const instance: DtoQqbotOutboxDto = {
    attempts,
    content,
    created_at,
    id,
    invite_code,
    kind,
    last_code,
    last_error,
    last_kind,
    msg_seq,
    msg_type,
    next_retry_at,
    open_id,
    ref_id,
    reply_msg_at,
    reply_msg_id,
    sender_id,
    sent_at,
    status,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

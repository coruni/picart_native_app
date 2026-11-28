# DtoQqbotMessageDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**direction** | **string** | Direction INBOUND（用户发）/ OUTBOUND（机器人或后台发）。 | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_wakeup** | **boolean** |  | [optional] [default to undefined]
**msg_seq** | **number** |  | [optional] [default to undefined]
**msg_type** | **number** | MsgType 官方 msg_type：0 文本 / 2 markdown / 7 富媒体。 | [optional] [default to undefined]
**open_id** | **string** | OpenID 对话方。 | [optional] [default to undefined]
**qqbot_msg_id** | **string** | QqbotMsgID 平台消息 ID（入站即被动回复源；出站为发送响应 id）。 | [optional] [default to undefined]
**reply_msg_id** | **string** |  | [optional] [default to undefined]
**sender_id** | **string** | SenderID 后台管理员 ID（仅「后台发出的」消息有值）。 | [optional] [default to undefined]

## Example

```typescript
import { DtoQqbotMessageDto } from './api';

const instance: DtoQqbotMessageDto = {
    content,
    created_at,
    direction,
    id,
    is_wakeup,
    msg_seq,
    msg_type,
    open_id,
    qqbot_msg_id,
    reply_msg_id,
    sender_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

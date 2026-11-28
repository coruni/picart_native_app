# DtoConversationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**conversation_id** | **string** |  | [optional] [default to undefined]
**counterpart** | [**DtoMessageUserBriefDto**](DtoMessageUserBriefDto.md) |  | [optional] [default to undefined]
**counterpart_id** | **string** | CounterpartID 对方用户 ID（扁平字符串）。  为什么与 Counterpart 并存：前端 lib/message-socket.ts 按 &#x60;counterpart_id&#x60; 解析， 而我们原先只给嵌套对象 &#x60;counterpart&#x60; → 前端拿不到 id（docs/28 §六 E 段）。 保留对象是为向后兼容（已有调用方读 counterpart.nickname 等）；两者恒一致。 空值时是 \&quot;\&quot;（不是不传）—— 遵守 docs/21 字符串规则；Counterpart 为 nil 时同样 \&quot;\&quot;。 | [optional] [default to undefined]
**last_message_at** | **string** |  | [optional] [default to undefined]
**latest_message** | [**DtoPrivateMessageDto**](DtoPrivateMessageDto.md) |  | [optional] [default to undefined]
**unread_count** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoConversationDto } from './api';

const instance: DtoConversationDto = {
    conversation_id,
    counterpart,
    counterpart_id,
    last_message_at,
    latest_message,
    unread_count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

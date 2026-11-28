# DtoQqbotConversationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**deferred_count** | **number** | DeferredCount 其中处于 DEFERRED（等用户开口激活窗口）的条数。 | [optional] [default to undefined]
**last_direction** | **string** | LastDirection 最后一条消息的方向：INBOUND / OUTBOUND（无消息时为空串）。 | [optional] [default to undefined]
**last_message** | **string** | LastMessage 最后一条消息内容（空串表示尚无消息）。 | [optional] [default to undefined]
**last_message_at** | **string** | LastMessageAt 最后一条消息时间（无消息时不传）。 | [optional] [default to undefined]
**message_count** | **number** |  | [optional] [default to undefined]
**nickname** | **string** |  | [optional] [default to undefined]
**open_id** | **string** |  | [optional] [default to undefined]
**pending_count** | **number** | PendingCount 该用户还在池子里没发出去的消息数（含 DEFERRED）—— 对应「用户没收到」的可观测面。 | [optional] [default to undefined]
**unread_count** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoQqbotConversationDto } from './api';

const instance: DtoQqbotConversationDto = {
    deferred_count,
    last_direction,
    last_message,
    last_message_at,
    message_count,
    nickname,
    open_id,
    pending_count,
    unread_count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

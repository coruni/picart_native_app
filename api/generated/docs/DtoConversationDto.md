# DtoConversationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**conversation_id** | **string** |  | [optional] [default to undefined]
**counterpart** | [**DtoMessageUserBriefDto**](DtoMessageUserBriefDto.md) |  | [optional] [default to undefined]
**last_message_at** | **string** |  | [optional] [default to undefined]
**latest_message** | [**DtoPrivateMessageDto**](DtoPrivateMessageDto.md) |  | [optional] [default to undefined]
**unread_count** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoConversationDto } from './api';

const instance: DtoConversationDto = {
    conversation_id,
    counterpart,
    last_message_at,
    latest_message,
    unread_count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

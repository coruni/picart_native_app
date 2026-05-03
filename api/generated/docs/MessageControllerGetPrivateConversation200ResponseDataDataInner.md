# MessageControllerGetPrivateConversation200ResponseDataDataInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**conversationId** | **number** |  | [optional] [default to undefined]
**senderId** | **number** |  | [optional] [default to undefined]
**receiverId** | **number** |  | [optional] [default to undefined]
**messageKind** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**payload** | **object** |  | [optional] [default to undefined]
**readAt** | **string** |  | [optional] [default to undefined]
**recalledAt** | **string** |  | [optional] [default to undefined]
**recalledById** | **string** |  | [optional] [default to undefined]
**recallReason** | **string** |  | [optional] [default to undefined]
**sender** | [**MessageControllerSearch200ResponseDataDataInnerReceiver**](MessageControllerSearch200ResponseDataDataInnerReceiver.md) |  | [default to undefined]
**receiver** | [**MessageControllerGetPrivateConversations200ResponseDataDataInnerCounterpart**](MessageControllerGetPrivateConversations200ResponseDataDataInnerCounterpart.md) |  | [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**isRead** | **boolean** |  | [optional] [default to undefined]
**isRecalled** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { MessageControllerGetPrivateConversation200ResponseDataDataInner } from './api';

const instance: MessageControllerGetPrivateConversation200ResponseDataDataInner = {
    id,
    conversationId,
    senderId,
    receiverId,
    messageKind,
    content,
    payload,
    readAt,
    recalledAt,
    recalledById,
    recallReason,
    sender,
    receiver,
    createdAt,
    updatedAt,
    type,
    isRead,
    isRecalled,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

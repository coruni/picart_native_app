# DtoPrivateMessageDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** |  | [optional] [default to undefined]
**conversation_id** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_read** | **boolean** |  | [optional] [default to undefined]
**is_recalled** | **boolean** |  | [optional] [default to undefined]
**message_kind** | **string** |  | [optional] [default to undefined]
**payload** | **{ [key: string]: any; }** | 透传载荷：保留 map 原类型，空时整个不传 | [optional] [default to undefined]
**read_at** | **string** | 时间 / 可选字符串：空时整个不传（未读、未撤回没有自然的空表示） | [optional] [default to undefined]
**recall_reason** | **string** |  | [optional] [default to undefined]
**recalled_at** | **string** |  | [optional] [default to undefined]
**recalled_by_id** | **string** |  | [optional] [default to undefined]
**receiver** | [**DtoMessageUserBriefDto**](DtoMessageUserBriefDto.md) |  | [optional] [default to undefined]
**receiver_id** | **string** |  | [optional] [default to undefined]
**sender** | [**DtoMessageUserBriefDto**](DtoMessageUserBriefDto.md) |  | [optional] [default to undefined]
**sender_id** | **string** |  | [optional] [default to undefined]
**type** | **string** | 派生字段：isRead / isRecalled 为 false 也是有效语义，不加 omitempty | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoPrivateMessageDto } from './api';

const instance: DtoPrivateMessageDto = {
    content,
    conversation_id,
    created_at,
    id,
    is_read,
    is_recalled,
    message_kind,
    payload,
    read_at,
    recall_reason,
    recalled_at,
    recalled_by_id,
    receiver,
    receiver_id,
    sender,
    sender_id,
    type,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

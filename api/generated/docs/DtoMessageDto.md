# DtoMessageDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article_id** | **any** | 透传载荷：运行时不定的业务结构，保留 map / interface{} 原类型，空时整个不传。 注意：interface{} 字段**不能带 example**，swag 会报 \&quot;any is unsupported type in example value\&quot;（实测踩到）。 | [optional] [default to undefined]
**comment_id** | **any** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_broadcast** | **boolean** |  | [optional] [default to undefined]
**is_read** | **boolean** | 布尔：false 有意义，不加 omitempty | [optional] [default to undefined]
**metadata** | **{ [key: string]: any; }** | metadata 是运行时不定的业务结构（jsonb 列），保留 map 原类型，空时整个不传 | [optional] [default to undefined]
**notification_type** | **any** |  | [optional] [default to undefined]
**receiver** | [**DtoMessageUserBriefDto**](DtoMessageUserBriefDto.md) |  | [optional] [default to undefined]
**receiver_id** | **string** |  | [optional] [default to undefined]
**sender** | [**DtoMessageUserBriefDto**](DtoMessageUserBriefDto.md) |  | [optional] [default to undefined]
**sender_id** | **string** |  | [optional] [default to undefined]
**target_id** | **any** |  | [optional] [default to undefined]
**target_type** | **any** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoMessageDto } from './api';

const instance: DtoMessageDto = {
    article_id,
    comment_id,
    content,
    created_at,
    id,
    is_broadcast,
    is_read,
    metadata,
    notification_type,
    receiver,
    receiver_id,
    sender,
    sender_id,
    target_id,
    target_type,
    title,
    type,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

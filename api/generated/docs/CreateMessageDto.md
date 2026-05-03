# CreateMessageDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**senderId** | **object** | 发送者ID | [optional] [default to undefined]
**receiverId** | **number** | 接收者ID（单发） | [optional] [default to undefined]
**receiverIds** | **Array&lt;string&gt;** | 接收者ID列表（批量） | [optional] [default to undefined]
**content** | **string** | 消息内容 | [default to undefined]
**title** | **string** | 消息标题 | [optional] [default to undefined]
**type** | **string** | 消息类型 | [default to TypeEnum_Private]
**isBroadcast** | **boolean** | 是否为广播消息 | [default to false]
**metadata** | **object** | 消息元数据 | [optional] [default to undefined]

## Example

```typescript
import { CreateMessageDto } from './api';

const instance: CreateMessageDto = {
    senderId,
    receiverId,
    receiverIds,
    content,
    title,
    type,
    isBroadcast,
    metadata,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

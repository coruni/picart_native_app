# UpdateMessageDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** | 消息内容 | [optional] [default to undefined]
**title** | **string** | 消息标题 | [optional] [default to undefined]
**isRead** | **boolean** | 是否已读 | [optional] [default to undefined]
**type** | **string** | 消息类型 | [optional] [default to undefined]
**isBroadcast** | **boolean** | 是否为广播消息 | [optional] [default to undefined]
**metadata** | **object** | 消息元数据 | [optional] [default to undefined]

## Example

```typescript
import { UpdateMessageDto } from './api';

const instance: UpdateMessageDto = {
    content,
    title,
    isRead,
    type,
    isBroadcast,
    metadata,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

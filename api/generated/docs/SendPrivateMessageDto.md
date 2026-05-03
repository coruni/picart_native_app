# SendPrivateMessageDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** | 文本内容 | [optional] [default to undefined]
**messageKind** | **string** | 消息类型 | [default to MessageKindEnum_Text]
**payload** | **object** | 结构化负载 | [optional] [default to undefined]

## Example

```typescript
import { SendPrivateMessageDto } from './api';

const instance: SendPrivateMessageDto = {
    content,
    messageKind,
    payload,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

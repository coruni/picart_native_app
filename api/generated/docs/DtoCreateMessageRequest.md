# DtoCreateMessageRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** |  | [optional] [default to undefined]
**is_broadcast** | **boolean** |  | [optional] [default to undefined]
**metadata** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**receiver_id** | **string** |  | [optional] [default to undefined]
**receiver_ids** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**sender_id** | **string** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoCreateMessageRequest } from './api';

const instance: DtoCreateMessageRequest = {
    content,
    is_broadcast,
    metadata,
    receiver_id,
    receiver_ids,
    sender_id,
    title,
    type,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

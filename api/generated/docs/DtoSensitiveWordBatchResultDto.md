# DtoSensitiveWordBatchResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**added** | **number** | Added 批量新增实际生效条数（批量删除端点为 0，改用 Removed）。 | [optional] [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**removed** | **number** | Removed 批量删除实际生效条数（批量新增端点为 0，改用 Added）。 | [optional] [default to undefined]
**success** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoSensitiveWordBatchResultDto } from './api';

const instance: DtoSensitiveWordBatchResultDto = {
    added,
    message,
    removed,
    success,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

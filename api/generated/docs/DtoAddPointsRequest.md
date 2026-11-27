# DtoAddPointsRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**related_id** | **string** |  | [optional] [default to undefined]
**related_type** | **string** |  | [optional] [default to undefined]
**source** | **string** |  | [default to undefined]
**valid_days** | **number** | ValidDays 积分有效期天数，0 表示永久。 | [optional] [default to undefined]

## Example

```typescript
import { DtoAddPointsRequest } from './api';

const instance: DtoAddPointsRequest = {
    amount,
    description,
    related_id,
    related_type,
    source,
    valid_days,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

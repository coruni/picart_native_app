# SpendPointsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** | 积分数量 | [default to undefined]
**source** | **string** | 用途 | [default to undefined]
**description** | **string** | 描述 | [optional] [default to undefined]
**relatedType** | **string** | 关联业务类型 | [optional] [default to undefined]
**relatedId** | **number** | 关联业务ID | [optional] [default to undefined]

## Example

```typescript
import { SpendPointsDto } from './api';

const instance: SpendPointsDto = {
    amount,
    source,
    description,
    relatedType,
    relatedId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

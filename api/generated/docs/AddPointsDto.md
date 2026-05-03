# AddPointsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** | 积分数量 | [default to undefined]
**source** | **string** | 积分来源 | [default to undefined]
**description** | **string** | 描述 | [optional] [default to undefined]
**relatedType** | **string** | 关联业务类型 | [optional] [default to undefined]
**relatedId** | **number** | 关联业务ID | [optional] [default to undefined]
**validDays** | **number** | 有效天数（0为永久） | [optional] [default to 0]

## Example

```typescript
import { AddPointsDto } from './api';

const instance: AddPointsDto = {
    amount,
    source,
    description,
    relatedType,
    relatedId,
    validDays,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

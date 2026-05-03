# CreateMembershipOrderDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**plan** | **string** | 套餐：1m/3m/6m/12m/lifetime（可选） | [optional] [default to undefined]
**duration** | **number** | 充值时长（月）（当未选择套餐时必填） | [optional] [default to undefined]
**remark** | **string** | 备注 | [optional] [default to undefined]

## Example

```typescript
import { CreateMembershipOrderDto } from './api';

const instance: CreateMembershipOrderDto = {
    plan,
    duration,
    remark,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

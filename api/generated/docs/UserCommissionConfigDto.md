# UserCommissionConfigDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**articleCommissionRate** | **number** | 文章抽成比例（0-1之间） | [default to undefined]
**membershipCommissionRate** | **number** | 会员抽成比例（0-1之间） | [default to undefined]
**productCommissionRate** | **number** | 商品抽成比例（0-1之间） | [default to undefined]
**serviceCommissionRate** | **number** | 服务抽成比例（0-1之间） | [default to undefined]
**enableCustomCommission** | **boolean** | 是否启用自定义抽成 | [default to undefined]
**remark** | **string** | 备注 | [default to undefined]

## Example

```typescript
import { UserCommissionConfigDto } from './api';

const instance: UserCommissionConfigDto = {
    articleCommissionRate,
    membershipCommissionRate,
    productCommissionRate,
    serviceCommissionRate,
    enableCustomCommission,
    remark,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

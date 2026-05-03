# CreateInviteDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | 邀请类型 | [default to TypeEnum_General]
**commissionRate** | **number** | 邀请分成比例（0-1之间） | [optional] [default to undefined]
**expiredAt** | **string** | 过期时间 | [optional] [default to undefined]
**remark** | **string** | 备注 | [optional] [default to undefined]

## Example

```typescript
import { CreateInviteDto } from './api';

const instance: CreateInviteDto = {
    type,
    commissionRate,
    expiredAt,
    remark,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

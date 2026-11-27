# DtoInviteDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**commission_rate** | **number** | CommissionRate 分成比例（0-1 的小数，不是百分数） | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**expired_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**invite_code** | **string** |  | [optional] [default to undefined]
**invite_url** | **string** |  | [optional] [default to undefined]
**invitee_id** | **string** |  | [optional] [default to undefined]
**inviter_id** | **string** |  | [optional] [default to undefined]
**remark** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**used_at** | **string** | 时间：usedAt / expiredAt 空时不传 | [optional] [default to undefined]

## Example

```typescript
import { DtoInviteDto } from './api';

const instance: DtoInviteDto = {
    commission_rate,
    created_at,
    expired_at,
    id,
    invite_code,
    invite_url,
    invitee_id,
    inviter_id,
    remark,
    status,
    type,
    updated_at,
    used_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

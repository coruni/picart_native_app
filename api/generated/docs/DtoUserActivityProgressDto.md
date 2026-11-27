# DtoUserActivityProgressDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activity_id** | **string** |  | [optional] [default to undefined]
**completed_at** | **string** | 时间：空时整个字段不传（未完成 / 未领奖时库里是 NULL） | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**current_comments** | **number** |  | [optional] [default to undefined]
**current_likes** | **number** |  | [optional] [default to undefined]
**current_recharge** | **number** |  | [optional] [default to undefined]
**current_shares** | **number** |  | [optional] [default to undefined]
**current_sign_in_days** | **number** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_completed** | **boolean** |  | [optional] [default to undefined]
**is_rewarded** | **boolean** |  | [optional] [default to undefined]
**rewarded_at** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**user_id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoUserActivityProgressDto } from './api';

const instance: DtoUserActivityProgressDto = {
    activity_id,
    completed_at,
    created_at,
    current_comments,
    current_likes,
    current_recharge,
    current_shares,
    current_sign_in_days,
    id,
    is_completed,
    is_rewarded,
    rewarded_at,
    updated_at,
    user_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

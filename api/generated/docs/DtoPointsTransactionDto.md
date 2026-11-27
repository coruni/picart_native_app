# DtoPointsTransactionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** | Amount 变动数量（正数增加、负数减少），单位是积分不是金额。 | [optional] [default to undefined]
**balance** | **number** | Balance 变动后的积分余额。 | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** | Description 中文业务描述（data 内容，不翻译）。 | [optional] [default to undefined]
**expired** | **boolean** | Expired 过期积分是否已被回收（EXPIRE 清扫任务用）。 | [optional] [default to undefined]
**expired_at** | **string** | ExpiredAt 积分过期时间；无过期语义时不传该字段（不是 null）。 | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**related_id** | **string** |  | [optional] [default to undefined]
**related_type** | **string** |  | [optional] [default to undefined]
**source** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**user_id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoPointsTransactionDto } from './api';

const instance: DtoPointsTransactionDto = {
    amount,
    balance,
    created_at,
    description,
    expired,
    expired_at,
    id,
    related_id,
    related_type,
    source,
    type,
    updated_at,
    user_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

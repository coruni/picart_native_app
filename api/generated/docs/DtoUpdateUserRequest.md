# DtoUpdateUserRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **string** |  | [optional] [default to undefined]
**avatar** | **string** |  | [optional] [default to undefined]
**background** | **string** |  | [optional] [default to undefined]
**ban_reason** | **string** | BanReason 封禁原因（仅在封禁时有意义）。 | [optional] [default to undefined]
**banned** | **string** | ---- 封禁 2 ---- Banned 封禁时间戳（RFC3339）。传值&#x3D;封禁并撤销全部 token；传空串&#x3D;解封。 | [optional] [default to undefined]
**birth_date** | **string** | BirthDate 生日（\&quot;2006-01-02\&quot;）。 | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**gender** | **string** |  | [optional] [default to undefined]
**invite_code** | **string** | ---- 邀请 1 ---- | [optional] [default to undefined]
**membership_end_date** | **string** |  | [optional] [default to undefined]
**membership_level** | **number** | ---- 会员 5 ---- | [optional] [default to undefined]
**membership_level_name** | **string** |  | [optional] [default to undefined]
**membership_start_date** | **string** |  | [optional] [default to undefined]
**membership_status** | **string** |  | [optional] [default to undefined]
**nick_id** | **string** | ---- 资料 7（含 nick_id）---- NickID 对外展示号码，字符串形态（同 UpdateProfileRequest 的精度说明）。 | [optional] [default to undefined]
**nickname** | **string** |  | [optional] [default to undefined]
**password** | **string** |  | [optional] [default to undefined]
**role_ids** | **Array&lt;string&gt;** | ---- 管理 3 ---- | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**username** | **string** | ---- 身份 3 ---- | [optional] [default to undefined]
**wallet** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoUpdateUserRequest } from './api';

const instance: DtoUpdateUserRequest = {
    address,
    avatar,
    background,
    ban_reason,
    banned,
    birth_date,
    description,
    gender,
    invite_code,
    membership_end_date,
    membership_level,
    membership_level_name,
    membership_start_date,
    membership_status,
    nick_id,
    nickname,
    password,
    role_ids,
    status,
    username,
    wallet,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# UpdateUserDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**username** | **string** | 用户名 | [optional] [default to undefined]
**nickname** | **string** | 昵称 | [optional] [default to undefined]
**password** | **string** | 密码 | [optional] [default to undefined]
**roleIds** | **Array&lt;number&gt;** | 角色ID列表 | [optional] [default to undefined]
**wallet** | **number** | 钱包余额 | [optional] [default to undefined]
**inviteCode** | **string** | 邀请码 | [optional] [default to undefined]
**avatar** | **string** | 头像 | [optional] [default to undefined]
**description** | **string** | 个人描述 | [optional] [default to undefined]
**background** | **string** | 个人背景 | [optional] [default to undefined]
**address** | **string** | 地址 | [optional] [default to undefined]
**gender** | **string** | 性别 | [optional] [default to undefined]
**birthDate** | **string** | 生日 | [optional] [default to undefined]
**membershipLevel** | **number** | 会员等级 | [optional] [default to undefined]
**membershipLevelName** | **string** | 会员等级名称 | [optional] [default to undefined]
**membershipStatus** | **string** | 会员状态 | [optional] [default to undefined]
**membershipStartDate** | **string** | 会员开通时间 | [optional] [default to undefined]
**membershipEndDate** | **string** | 会员到期时间 | [optional] [default to undefined]
**status** | **string** | 用户状态 | [optional] [default to undefined]
**banned** | **string** | 封禁时间 | [optional] [default to undefined]
**banReason** | **string** | 封禁原因 | [optional] [default to undefined]

## Example

```typescript
import { UpdateUserDto } from './api';

const instance: UpdateUserDto = {
    username,
    nickname,
    password,
    roleIds,
    wallet,
    inviteCode,
    avatar,
    description,
    background,
    address,
    gender,
    birthDate,
    membershipLevel,
    membershipLevelName,
    membershipStatus,
    membershipStartDate,
    membershipEndDate,
    status,
    banned,
    banReason,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

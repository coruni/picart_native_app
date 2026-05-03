# CreateUserDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**username** | **string** | 用户名 | [default to undefined]
**nickname** | **string** | 昵称 | [optional] [default to undefined]
**password** | **string** | 密码 | [default to undefined]
**email** | **string** | 邮箱 | [optional] [default to undefined]
**phone** | **string** | 手机号 | [optional] [default to undefined]
**roleIds** | **Array&lt;number&gt;** | 角色ID列表（仅超级管理员可指定） | [optional] [default to undefined]
**wallet** | **number** | 钱包余额 | [optional] [default to undefined]
**inviteCode** | **string** | 邀请码 | [optional] [default to undefined]
**verificationCode** | **string** | 邮箱验证码 | [optional] [default to undefined]

## Example

```typescript
import { CreateUserDto } from './api';

const instance: CreateUserDto = {
    username,
    nickname,
    password,
    email,
    phone,
    roleIds,
    wallet,
    inviteCode,
    verificationCode,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

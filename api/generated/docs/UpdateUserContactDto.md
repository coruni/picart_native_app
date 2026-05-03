# UpdateUserContactDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | 新邮箱 | [optional] [default to undefined]
**phone** | **string** | 新手机号 | [optional] [default to undefined]
**verificationCode** | **string** | 邮箱验证码，仅修改邮箱时需要 | [optional] [default to undefined]

## Example

```typescript
import { UpdateUserContactDto } from './api';

const instance: UpdateUserContactDto = {
    email,
    phone,
    verificationCode,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

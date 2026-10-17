# ApplyCertificationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | 认证类型：OFFICIAL-官方，CREATOR-创作者 | [default to undefined]
**realName** | **string** | 真实姓名/主体名称 | [optional] [default to undefined]
**organizationName** | **string** | 机构名称（官方认证必填） | [optional] [default to undefined]
**description** | **string** | 认证说明 | [optional] [default to undefined]
**slogan** | **string** | 认证标语（公开展示，长度不超过80字符，勿填私人信息） | [optional] [default to undefined]
**materials** | **Array&lt;string&gt;** | 证明材料（文件URL数组） | [optional] [default to undefined]

## Example

```typescript
import { ApplyCertificationDto } from './api';

const instance: ApplyCertificationDto = {
    type,
    realName,
    organizationName,
    description,
    slogan,
    materials,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

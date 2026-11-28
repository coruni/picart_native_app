# DtoUpdateProfileRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **string** |  | [optional] [default to undefined]
**avatar** | **string** |  | [optional] [default to undefined]
**background** | **string** |  | [optional] [default to undefined]
**birth_date** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**gender** | **string** |  | [optional] [default to undefined]
**nick_id** | **string** | NickID 对外展示号码，**字符串形态**（bigint 会超 JS 的 2^53-1，传数字会丢精度）。  ⚠️ 默认**不可修改**：配置 &#x60;nick_id_allow_modify&#x3D;false&#x60; 时该字段被静默忽略， 只能由系统发号。开关通过 PATCH /config/group/nick_id 打开。 若 &#x60;nick_id_allow_duplicate&#x3D;false&#x60;，改成他人已占用的号返回 10005。 | [optional] [default to undefined]
**nickname** | **string** |  | [optional] [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoUpdateProfileRequest } from './api';

const instance: DtoUpdateProfileRequest = {
    address,
    avatar,
    background,
    birth_date,
    description,
    email,
    gender,
    nick_id,
    nickname,
    phone,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

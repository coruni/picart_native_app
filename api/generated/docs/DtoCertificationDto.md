# DtoCertificationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**certified_at** | **string** | CertifiedAt 认证**通过**的时间；未通过 / 被拒 / 已撤销时整个字段不传。  与 reviewed_at 是两回事：reviewed_at 是审核动作时间（拒绝也有）， certified_at 是认证生效时间（只在 APPROVED 时存在）。见 model.UserCertification。 | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**organization_name** | **string** |  | [optional] [default to undefined]
**real_name** | **string** | 字符串值类型：空时 \&quot;\&quot;（docs/21-JSON序列化规范.md） | [optional] [default to undefined]
**review_reason** | **string** |  | [optional] [default to undefined]
**reviewed_at** | **string** | 时间：空时不传 | [optional] [default to undefined]
**slogan** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**user_id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoCertificationDto } from './api';

const instance: DtoCertificationDto = {
    certified_at,
    created_at,
    description,
    id,
    organization_name,
    real_name,
    review_reason,
    reviewed_at,
    slogan,
    status,
    type,
    user_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

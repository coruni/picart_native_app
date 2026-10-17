# AuditCertificationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **string** | 审核结果：APPROVED-通过，REJECTED-拒绝 | [default to undefined]
**reason** | **string** | 审核意见/拒绝原因（拒绝时建议填写） | [optional] [default to undefined]

## Example

```typescript
import { AuditCertificationDto } from './api';

const instance: AuditCertificationDto = {
    status,
    reason,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

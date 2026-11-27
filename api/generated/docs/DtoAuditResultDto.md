# DtoAuditResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**action** | **string** | Action 处置动作，取值见上方说明。 | [optional] [default to undefined]
**detail_json** | **string** | DetailJSON 云服务商原始响应（jsonb 文本透传）；无则空串。 | [optional] [default to undefined]
**label** | **string** | Label 命中的标签（如 sensitive_word）；无命中时为空串。 | [optional] [default to undefined]
**passed** | **boolean** |  | [optional] [default to undefined]
**reason** | **string** | Reason 命中原因（**中文业务数据**，不是 message，按 AGENTS 不翻译）。 | [optional] [default to undefined]
**score** | **number** | Score 云服务商返回的风险分（0~100）；本地敏感词命中时为 0。 | [optional] [default to undefined]

## Example

```typescript
import { DtoAuditResultDto } from './api';

const instance: DtoAuditResultDto = {
    action,
    detail_json,
    label,
    passed,
    reason,
    score,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

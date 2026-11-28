# DtoQqbotApplicationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**invite_code** | **string** | InviteCode 批准后分配的邀请码（未批准与拒绝时为空串）。 | [optional] [default to undefined]
**invite_id** | **string** |  | [optional] [default to undefined]
**nickname** | **string** |  | [optional] [default to undefined]
**open_id** | **string** | OpenID 机器人维度唯一标识。**不是本站用户 ID**，不能拿去查 user 表。 | [optional] [default to undefined]
**qqbot_msg_id** | **string** | QqbotMsgID 触发申请的原始消息 ID（唯一索引，重复推送命中它而不是插两条）。 | [optional] [default to undefined]
**review_note** | **string** |  | [optional] [default to undefined]
**reviewed_at** | **string** | ReviewedAt 审批时间：未审批时不传该字段。 | [optional] [default to undefined]
**reviewer_id** | **string** |  | [optional] [default to undefined]
**status** | **string** | Status 见 model.QqbotAppXxx：PENDING / APPROVED / REJECTED / CANCELLED。 | [optional] [default to undefined]
**union_open_id** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoQqbotApplicationDto } from './api';

const instance: DtoQqbotApplicationDto = {
    content,
    created_at,
    id,
    invite_code,
    invite_id,
    nickname,
    open_id,
    qqbot_msg_id,
    review_note,
    reviewed_at,
    reviewer_id,
    status,
    union_open_id,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

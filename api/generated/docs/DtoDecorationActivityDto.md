# DtoDecorationActivityDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article_id** | **string** |  | [optional] [default to undefined]
**completed_count** | **number** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**decoration_id** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**end_time** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_permanent** | **boolean** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**participant_count** | **number** |  | [optional] [default to undefined]
**required_comments** | **number** |  | [optional] [default to undefined]
**required_likes** | **number** |  | [optional] [default to undefined]
**required_recharge** | **number** |  | [optional] [default to undefined]
**required_shares** | **number** |  | [optional] [default to undefined]
**required_sign_in_days** | **number** |  | [optional] [default to undefined]
**start_time** | **string** | 活动起止时间：库里 NOT NULL（创建时必有值），故用 string 而非 omitempty 指针 | [optional] [default to undefined]
**status** | **string** | ACTIVE / INACTIVE / ENDED | [optional] [default to undefined]
**type** | **string** | LIKE / COMMENT / SHARE / RECHARGE / SIGN_IN / CUSTOM | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**valid_days** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoDecorationActivityDto } from './api';

const instance: DtoDecorationActivityDto = {
    article_id,
    completed_count,
    created_at,
    decoration_id,
    description,
    end_time,
    id,
    is_permanent,
    name,
    participant_count,
    required_comments,
    required_likes,
    required_recharge,
    required_shares,
    required_sign_in_days,
    start_time,
    status,
    type,
    updated_at,
    valid_days,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

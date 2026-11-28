# DtoDecorationActivityDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article** | [**DtoDecorationArticleBriefDto**](DtoDecorationArticleBriefDto.md) | ---- 内嵌引用（前端交接单第三版 §二.4）----  活动卡片要能渲染文章封面并点进文章、要能显示奖励装扮的图，只给 id 前端做不到。 两者都是**对象 + omitempty**：article_id 为空（不关联文章的纯门槛活动）或 关联行已被删除时，整个字段不传；绝不下发 &#x60;null&#x60;（docs/21）。 组装方式：列表接口对整页做 **IN 批量预取**（2 条额外查询，与页大小无关）， 不是逐条查询 —— 见 service.decorationService.activityViews。 | [optional] [default to undefined]
**article_id** | **string** |  | [optional] [default to undefined]
**completed_count** | **number** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**decoration** | [**DtoDecorationBriefDto**](DtoDecorationBriefDto.md) |  | [optional] [default to undefined]
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
    article,
    article_id,
    completed_count,
    created_at,
    decoration,
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

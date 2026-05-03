# CreateActivityDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 活动名称 | [default to undefined]
**description** | **string** | 活动描述 | [optional] [default to undefined]
**type** | **string** | 活动类型 | [default to undefined]
**decorationId** | **number** | 奖励装饰品ID | [default to undefined]
**articleId** | **number** | 关联文章ID（活动说明） | [optional] [default to undefined]
**requiredLikes** | **number** | 所需点赞数 | [optional] [default to undefined]
**requiredComments** | **number** | 所需评论数 | [optional] [default to undefined]
**requiredShares** | **number** | 所需分享数 | [optional] [default to undefined]
**requiredRecharge** | **number** | 所需充值金额 | [optional] [default to undefined]
**requiredSignInDays** | **number** | 所需签到天数 | [optional] [default to undefined]
**isPermanent** | **boolean** | 奖励是否永久 | [default to undefined]
**validDays** | **number** | 奖励有效天数 | [optional] [default to undefined]
**startTime** | **string** | 开始时间 | [default to undefined]
**endTime** | **string** | 结束时间 | [default to undefined]

## Example

```typescript
import { CreateActivityDto } from './api';

const instance: CreateActivityDto = {
    name,
    description,
    type,
    decorationId,
    articleId,
    requiredLikes,
    requiredComments,
    requiredShares,
    requiredRecharge,
    requiredSignInDays,
    isPermanent,
    validDays,
    startTime,
    endTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

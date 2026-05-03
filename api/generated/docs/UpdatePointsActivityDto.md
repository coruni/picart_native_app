# UpdatePointsActivityDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **string** | 活动代码 | [optional] [default to undefined]
**name** | **string** | 活动名称 | [optional] [default to undefined]
**description** | **string** | 活动描述 | [optional] [default to undefined]
**type** | **string** | 活动类型 | [optional] [default to undefined]
**rewardPoints** | **number** | 奖励积分 | [optional] [default to undefined]
**targetCount** | **number** | 目标数量 | [optional] [default to 1]
**dailyLimit** | **number** | 每日限制次数（0为不限制） | [optional] [default to 0]
**totalLimit** | **number** | 总限制次数（0为不限制） | [optional] [default to 0]
**validDays** | **number** | 积分有效期（天数，0为永久） | [optional] [default to 0]
**icon** | **string** | 活动图标 | [optional] [default to undefined]
**link** | **string** | 跳转链接 | [optional] [default to undefined]
**isActive** | **boolean** | 是否启用 | [optional] [default to true]
**sort** | **number** | 排序 | [optional] [default to 0]

## Example

```typescript
import { UpdatePointsActivityDto } from './api';

const instance: UpdatePointsActivityDto = {
    code,
    name,
    description,
    type,
    rewardPoints,
    targetCount,
    dailyLimit,
    totalLimit,
    validDays,
    icon,
    link,
    isActive,
    sort,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

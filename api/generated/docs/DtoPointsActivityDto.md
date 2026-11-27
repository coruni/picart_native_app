# DtoPointsActivityDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**daily_limit** | **number** | DailyLimit / TotalLimit 为 0 表示不限制。 | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**icon** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_active** | **boolean** | IsActive 是否启用（等价于「活动是否上线」）。 | [optional] [default to undefined]
**link** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**reward_points** | **number** | RewardPoints 奖励积分（整数，不是金额，无精度问题）。 | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]
**target_count** | **number** |  | [optional] [default to undefined]
**total_limit** | **number** |  | [optional] [default to undefined]
**type** | **string** | 活动类型，取值见 model.PointsActivity* 常量。 | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**valid_days** | **number** | ValidDays 积分有效期天数，0 表示永久。 | [optional] [default to undefined]

## Example

```typescript
import { DtoPointsActivityDto } from './api';

const instance: DtoPointsActivityDto = {
    code,
    created_at,
    daily_limit,
    description,
    icon,
    id,
    is_active,
    link,
    name,
    reward_points,
    sort,
    target_count,
    total_limit,
    type,
    updated_at,
    valid_days,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

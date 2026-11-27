# DtoAchievementDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**claimed** | **boolean** |  | [optional] [default to undefined]
**claimed_at** | **string** |  | [optional] [default to undefined]
**code** | **string** |  | [optional] [default to undefined]
**completed** | **boolean** |  | [optional] [default to undefined]
**completed_at** | **string** | 时间：空时不传（未完成无 completedAt，未领取无 claimedAt） | [optional] [default to undefined]
**condition** | [**DtoAchievementConditionDto**](DtoAchievementConditionDto.md) | Condition 完成条件（必有，jsonb 默认零值 {type:\&quot;\&quot;,target:0}） | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**enabled** | **boolean** |  | [optional] [default to undefined]
**hidden** | **boolean** |  | [optional] [default to undefined]
**icon** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**progress** | **number** | 当前用户进度（未登录时 progress&#x3D;0 / completed&#x3D;false / claimed&#x3D;false） | [optional] [default to undefined]
**rarity** | **string** |  | [optional] [default to undefined]
**reward_decoration_id** | **string** |  | [optional] [default to undefined]
**reward_exp** | **number** |  | [optional] [default to undefined]
**reward_points** | **number** |  | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoAchievementDto } from './api';

const instance: DtoAchievementDto = {
    claimed,
    claimed_at,
    code,
    completed,
    completed_at,
    condition,
    created_at,
    description,
    enabled,
    hidden,
    icon,
    id,
    name,
    progress,
    rarity,
    reward_decoration_id,
    reward_exp,
    reward_points,
    sort,
    type,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

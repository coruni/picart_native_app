# CreateAchievementDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **string** | 成就代码（唯一标识） | [default to undefined]
**name** | **string** | 成就名称 | [default to undefined]
**description** | **string** | 成就描述 | [default to undefined]
**icon** | **string** | 成就图标URL | [optional] [default to undefined]
**type** | **string** | 成就类型 | [default to undefined]
**rarity** | **string** | 稀有度 | [default to RarityEnum_Common]
**condition** | **object** | 完成条件 | [default to undefined]
**rewardPoints** | **number** | 奖励积分 | [default to 0]
**rewardExp** | **number** | 奖励经验 | [default to 0]
**rewardDecorationId** | **number** | 奖励装饰品ID | [optional] [default to undefined]
**hidden** | **boolean** | 是否隐藏 | [default to false]
**sort** | **number** | 排序 | [default to 0]
**enabled** | **boolean** | 是否启用 | [default to true]

## Example

```typescript
import { CreateAchievementDto } from './api';

const instance: CreateAchievementDto = {
    code,
    name,
    description,
    icon,
    type,
    rarity,
    condition,
    rewardPoints,
    rewardExp,
    rewardDecorationId,
    hidden,
    sort,
    enabled,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

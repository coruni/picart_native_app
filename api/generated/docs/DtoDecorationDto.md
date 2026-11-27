# DtoDecorationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**achievement_id** | **string** |  | [optional] [default to undefined]
**activity_id** | **string** | 归属来源（反查唯一来源；非来源方向时为空串，不是 null） | [optional] [default to undefined]
**bubble_color** | **string** | 仅评论气泡用 | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**image_url** | **string** |  | [optional] [default to undefined]
**is_permanent** | **boolean** |  | [optional] [default to undefined]
**is_purchasable** | **boolean** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**obtain_method** | **string** | PURCHASE / ACTIVITY / GIFT / ACHIEVEMENT / DEFAULT | [optional] [default to undefined]
**preview_url** | **string** |  | [optional] [default to undefined]
**price** | **number** |  | [optional] [default to undefined]
**rarity** | **string** | COMMON / RARE / EPIC / LEGENDARY | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]
**status** | **string** | ACTIVE / INACTIVE | [optional] [default to undefined]
**type** | **string** | AVATAR_FRAME / COMMENT_BUBBLE / ACHIEVEMENT_BADGE | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**valid_days** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoDecorationDto } from './api';

const instance: DtoDecorationDto = {
    achievement_id,
    activity_id,
    bubble_color,
    created_at,
    description,
    id,
    image_url,
    is_permanent,
    is_purchasable,
    name,
    obtain_method,
    preview_url,
    price,
    rarity,
    sort,
    status,
    type,
    updated_at,
    valid_days,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

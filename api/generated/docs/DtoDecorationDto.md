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
**is_owned** | **boolean** | ---- 归属 / 装备状态（前端交接单第三版 §二.5）----  GET /decoration（商城列表）与 GET /decoration/{id} 会带上登录用户语境填充； 管理端 CRUD、持有记录里的嵌套定义不计算归属，这两个字段**不传**。  为什么是 *bool + omitempty 而不是 bool：   - nil &#x3D; 「本次响应没有归属语境」，整个字段不传（docs/21 对象/未计算态）；   - false &#x3D; **明确未拥有**，必须出现 —— 前端要靠它显示「未解锁」。   直接用 bool + omitempty 会把 false 吃掉，前端永远看不到「未拥有」，   等于装饰页仍然全坏的（这正是本次要修的缺陷）。 | [optional] [default to undefined]
**is_permanent** | **boolean** |  | [optional] [default to undefined]
**is_purchasable** | **boolean** |  | [optional] [default to undefined]
**is_using** | **boolean** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**obtain_method** | **string** | PURCHASE / ACTIVITY / GIFT / ACHIEVEMENT / DEFAULT | [optional] [default to undefined]
**preview_url** | **string** |  | [optional] [default to undefined]
**price** | **number** |  | [optional] [default to undefined]
**rarity** | **string** | COMMON / RARE / EPIC / LEGENDARY | [optional] [default to undefined]
**required_comments** | **number** |  | [optional] [default to undefined]
**required_likes** | **number** | ---- 解锁门槛（同一交接单 §二.5 的「门槛文案」）----  ⚠️ 事实核对：model.Decoration **没有** required_likes / required_comments 这两列 （&#x60;grep -n \&quot;RequiredLikes\&quot; internal/model/decoration.go&#x60; 只命中 DecorationActivity）。 所以这里**不是**装饰品自身的列，而是它的**来源活动**（activity_id 指向的 decoration_activities 行）上声明的门槛 —— 对「活动获取」的装饰品这就是真实的 解锁条件，不是编造。非活动来源（购买/赠送/成就）不传该字段（nil）。 若产品需要「每个装饰品独立门槛」，必须给 decorations 表加列，那是另一个决策。 | [optional] [default to undefined]
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
    is_owned,
    is_permanent,
    is_purchasable,
    is_using,
    name,
    obtain_method,
    preview_url,
    price,
    rarity,
    required_comments,
    required_likes,
    sort,
    status,
    type,
    updated_at,
    valid_days,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

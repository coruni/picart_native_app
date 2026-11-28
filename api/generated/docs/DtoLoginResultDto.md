# DtoLoginResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **string** |  | [optional] [default to undefined]
**article_count** | **number** |  | [optional] [default to undefined]
**avatar** | **string** |  | [optional] [default to undefined]
**background** | **string** |  | [optional] [default to undefined]
**birth_date** | **string** | ---- 时间字段：空时不传（时间没有\&quot;空\&quot;的自然表示，见规范 §一）---- | [optional] [default to undefined]
**config** | [**DtoUserConfigDto**](DtoUserConfigDto.md) | Config 用户的配置全集（通知 / 隐私 / 水印 / 佣金）。  为什么挂在 UserDto 而不是各自加：LoginResultDto 与 UserProfileDto 都内嵌它， 加一处两个接口同时满足；登录一次就要拿到全部配置，否则前端进设置页要再发一次 GET /user/config（docs/28 §四 C 段）。  **只在详情类接口填充**（login / profile / user/{id}），列表接口留 nil —— UserDto 被 GET /user、关注/粉丝列表复用，N 个用户各带 28 字段配置会让响应体爆炸。 指针 + omitempty：不加载时整个字段不传（docs/21 规则 ③），不会出现 config: null。 | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**experience** | **number** |  | [optional] [default to undefined]
**follower_count** | **number** |  | [optional] [default to undefined]
**following_count** | **number** |  | [optional] [default to undefined]
**gender** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**invite_count** | **number** |  | [optional] [default to undefined]
**invite_earnings** | **number** |  | [optional] [default to undefined]
**is_member** | **boolean** |  | [optional] [default to undefined]
**level** | **number** |  | [optional] [default to undefined]
**likes** | **number** |  | [optional] [default to undefined]
**membership_end_date** | **string** |  | [optional] [default to undefined]
**membership_level** | **number** |  | [optional] [default to undefined]
**membership_level_name** | **string** |  | [optional] [default to undefined]
**membership_status** | **string** |  | [optional] [default to undefined]
**my_invite_code** | **string** |  | [optional] [default to undefined]
**nickname** | **string** | ---- 字符串字段：值类型，空时 \&quot;\&quot;（不是 null、不是省略）---- 见 docs/21-JSON序列化规范.md §一。model 层保持 *string（数据库要区分 NULL）， 转换发生在 service.buildUserView → strOrEmpty()。 | [optional] [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]
**points** | **number** |  | [optional] [default to undefined]
**refresh_token** | **string** |  | [optional] [default to undefined]
**roles** | [**Array&lt;DtoRoleBriefDto&gt;**](DtoRoleBriefDto.md) | ---- 数组字段：去掉 omitempty，空时输出 []（不是省略、不是 null）---- | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**token** | **string** |  | [optional] [default to undefined]
**username** | **string** |  | [optional] [default to undefined]
**wallet** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoLoginResultDto } from './api';

const instance: DtoLoginResultDto = {
    address,
    article_count,
    avatar,
    background,
    birth_date,
    config,
    created_at,
    description,
    email,
    experience,
    follower_count,
    following_count,
    gender,
    id,
    invite_count,
    invite_earnings,
    is_member,
    level,
    likes,
    membership_end_date,
    membership_level,
    membership_level_name,
    membership_status,
    my_invite_code,
    nickname,
    phone,
    points,
    refresh_token,
    roles,
    status,
    token,
    username,
    wallet,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

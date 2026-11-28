# DtoLoginResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **string** |  | [optional] [default to undefined]
**article_count** | **number** |  | [optional] [default to undefined]
**avatar** | **string** |  | [optional] [default to undefined]
**background** | **string** |  | [optional] [default to undefined]
**birth_date** | **string** | ---- 时间字段：空时不传（时间没有\&quot;空\&quot;的自然表示，见规范 §一）---- | [optional] [default to undefined]
**certification** | [**DtoCertificationBriefDto**](DtoCertificationBriefDto.md) | Certification 已通过的认证摘要（brief 版，未认证时不传）。  为什么用 brief 而不是完整 CertificationDto：登录响应已经很大 （UserDto 33 字段 + config 28 字段），完整认证 12 字段里申请材料/审核记录 前端在登录后根本不用（交接单 §二.9）。需要完整版走 GET /user/certification/status。 | [optional] [default to undefined]
**config** | [**DtoUserConfigDto**](DtoUserConfigDto.md) | Config 用户的配置全集（通知 / 隐私 / 水印 / 佣金）。  为什么挂在 UserDto 而不是各自加：LoginResultDto 与 UserProfileDto 都内嵌它， 加一处两个接口同时满足；登录一次就要拿到全部配置，否则前端进设置页要再发一次 GET /user/config（docs/28 §四 C 段）。  **只在详情类接口填充**（login / profile / user/{id}），列表接口留 nil —— UserDto 被 GET /user、关注/粉丝列表复用，N 个用户各带 28 字段配置会让响应体爆炸。 指针 + omitempty：不加载时整个字段不传（docs/21 规则 ③），不会出现 config: null。 | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**equipped_decorations** | [**{ [key: string]: DtoEquippedDecorationDto; }**](DtoEquippedDecorationDto.md) | EquippedDecorations 佩戴中的装饰品，按 type 分组（avatar_frame / comment_bubble）。  空时不传（不是 null、不是空对象）—— docs/21 §一 规则 ③。 列表接口批量装配走「一次 IN 查询」，不做逐用户查询（见 service.attachUserDecorations）。 | [optional] [default to undefined]
**experience** | **number** |  | [optional] [default to undefined]
**follower_count** | **number** |  | [optional] [default to undefined]
**following_count** | **number** |  | [optional] [default to undefined]
**gender** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**invite_count** | **number** |  | [optional] [default to undefined]
**invite_earnings** | **number** |  | [optional] [default to undefined]
**is_followed** | **boolean** | IsFollowed 当前登录用户是否已关注此人。  三个列表接口（GET /user、关注列表、粉丝列表）与详情都用它 —— 关注/粉丝列表 的按钮原本全是「关注」态，用户点一次才准（交接单 §二.3）。 值类型 bool（不 omitempty、不是 null）：未登录即 false，前端可直接判。 看自己主页恒为 false（不能出现「关注自己」）。 | [optional] [default to undefined]
**is_member** | **boolean** |  | [optional] [default to undefined]
**level** | **number** |  | [optional] [default to undefined]
**likes** | **number** |  | [optional] [default to undefined]
**membership_end_date** | **string** |  | [optional] [default to undefined]
**membership_level** | **number** |  | [optional] [default to undefined]
**membership_level_name** | **string** |  | [optional] [default to undefined]
**membership_status** | **string** |  | [optional] [default to undefined]
**my_invite_code** | **string** |  | [optional] [default to undefined]
**nick_id** | **number** | NickID 对外展示用的号码（**bigint 自增，从 10001 起**；唯一主键仍是 id）。  是否可改 / 是否允许重名由**配置开关**决定（默认都关，见下）：   nick_id_allow_modify    false → 用户不能改，只能系统发号   nick_id_allow_duplicate false → 改号时查重，撞号 10005  ⚠️ 必须与 NickIDStr **成对使用**：   · NickID      number —— 方便前端直接比较/排序，但超过 2^53-1 会丢精度   · NickIDStr   string —— **精确值**，展示与回传一律用它 只给 number 的话，前端 JSON.parse 那一刻精度就已经丢了，之后无法补救。 老用户没有该值时输出 0 / \&quot;\&quot;（不是 null）。 | [optional] [default to undefined]
**nick_id_str** | **string** |  | [optional] [default to undefined]
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
    certification,
    config,
    created_at,
    description,
    email,
    equipped_decorations,
    experience,
    follower_count,
    following_count,
    gender,
    id,
    invite_count,
    invite_earnings,
    is_followed,
    is_member,
    level,
    likes,
    membership_end_date,
    membership_level,
    membership_level_name,
    membership_status,
    my_invite_code,
    nick_id,
    nick_id_str,
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

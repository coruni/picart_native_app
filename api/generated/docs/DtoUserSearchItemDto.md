# DtoUserSearchItemDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article_count** | **number** |  | [optional] [default to undefined]
**avatar** | **string** |  | [optional] [default to undefined]
**certification** | [**DtoCertificationBriefDto**](DtoCertificationBriefDto.md) |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**equipped_decorations** | [**{ [key: string]: DtoEquippedDecorationDto; }**](DtoEquippedDecorationDto.md) | 装扮与认证：搜索结果卡片与个人主页保持一致的视觉信息。  omitempty：当前 service 层**没有**批量装配扮的实现（AuthorBriefDto 同样 声明了 equipped_decorations 却全仓无填充点），所以这里用 omitempty 让 「没有就不传」，而不是返回一个空 map 假装有契约。 | [optional] [default to undefined]
**follower_count** | **number** |  | [optional] [default to undefined]
**following_count** | **number** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_followed** | **boolean** |  | [optional] [default to undefined]
**is_member** | **boolean** |  | [optional] [default to undefined]
**level** | **number** |  | [optional] [default to undefined]
**nick_id** | **number** |  | [optional] [default to undefined]
**nick_id_str** | **string** |  | [optional] [default to undefined]
**nickname** | **string** |  | [optional] [default to undefined]
**username** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoUserSearchItemDto } from './api';

const instance: DtoUserSearchItemDto = {
    article_count,
    avatar,
    certification,
    created_at,
    description,
    equipped_decorations,
    follower_count,
    following_count,
    id,
    is_followed,
    is_member,
    level,
    nick_id,
    nick_id_str,
    nickname,
    username,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

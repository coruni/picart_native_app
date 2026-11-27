# DtoArticleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activity_id** | **string** |  | [optional] [default to undefined]
**allow_reprint** | **boolean** |  | [optional] [default to undefined]
**author** | [**DtoAuthorBriefDto**](DtoAuthorBriefDto.md) |  | [optional] [default to undefined]
**author_id** | **string** |  | [optional] [default to undefined]
**category** | [**DtoCategoryBriefDto**](DtoCategoryBriefDto.md) |  | [optional] [default to undefined]
**category_id** | **string** |  | [optional] [default to undefined]
**comment_count** | **number** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**cover** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**download_count** | **number** |  | [optional] [default to undefined]
**downloads** | [**Array&lt;DtoArticleDownloadRequest&gt;**](DtoArticleDownloadRequest.md) | Downloads 下载资源列表（对齐原 article.downloads 一对多）。  空时输出 []（不是 null）—— 见 docs/21 §一 规则 ②。 | [optional] [default to undefined]
**favorite_count** | **number** |  | [optional] [default to undefined]
**featured_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**is_disliked** | **boolean** |  | [optional] [default to undefined]
**is_favorited** | **boolean** |  | [optional] [default to undefined]
**is_featured** | **boolean** |  | [optional] [default to undefined]
**is_liked** | **boolean** |  | [optional] [default to undefined]
**is_pinned_on_profile** | **boolean** |  | [optional] [default to undefined]
**likes** | **number** |  | [optional] [default to undefined]
**list_require_login** | **boolean** |  | [optional] [default to undefined]
**pinned_at** | **string** |  | [optional] [default to undefined]
**reaction_stats** | **{ [key: string]: number; }** | ReactionStats 各表情的计数（键固定为 like/love/haha/wow/sad/angry/dislike）。  对齐原 buildEmptyReactionStats()：无表态时是**全 0 对象**，不是 null。 | [optional] [default to undefined]
**require_follow** | **boolean** |  | [optional] [default to undefined]
**require_login** | **boolean** |  | [optional] [default to undefined]
**require_membership** | **boolean** |  | [optional] [default to undefined]
**require_payment** | **boolean** |  | [optional] [default to undefined]
**shares** | **number** |  | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**summary** | **string** |  | [optional] [default to undefined]
**tags** | [**Array&lt;DtoTagBriefDto&gt;**](DtoTagBriefDto.md) |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**user_reaction** | **string** | UserReaction 当前用户对该文章的表态；未表态或未登录时为 \&quot;\&quot;（不是 null）。 | [optional] [default to undefined]
**video_url** | **string** |  | [optional] [default to undefined]
**view_price** | **number** |  | [optional] [default to undefined]
**views** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoArticleDto } from './api';

const instance: DtoArticleDto = {
    activity_id,
    allow_reprint,
    author,
    author_id,
    category,
    category_id,
    comment_count,
    content,
    cover,
    created_at,
    download_count,
    downloads,
    favorite_count,
    featured_at,
    id,
    images,
    is_disliked,
    is_favorited,
    is_featured,
    is_liked,
    is_pinned_on_profile,
    likes,
    list_require_login,
    pinned_at,
    reaction_stats,
    require_follow,
    require_login,
    require_membership,
    require_payment,
    shares,
    sort,
    status,
    summary,
    tags,
    title,
    type,
    updated_at,
    user_reaction,
    video_url,
    view_price,
    views,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

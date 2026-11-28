# DtoCommentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article** | [**DtoCommentArticleBriefDto**](DtoCommentArticleBriefDto.md) | Article 内嵌文章精简视图（读接口填充；写接口只回本体，不带内嵌）。 | [optional] [default to undefined]
**article_id** | **string** |  | [optional] [default to undefined]
**author** | [**DtoAuthorBriefDto**](DtoAuthorBriefDto.md) |  | [optional] [default to undefined]
**author_id** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**floor** | **number** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**is_liked** | **boolean** |  | [optional] [default to undefined]
**is_pinned** | **boolean** |  | [optional] [default to undefined]
**likes** | **number** |  | [optional] [default to undefined]
**parent** | [**DtoCommentParentBriefDto**](DtoCommentParentBriefDto.md) | Parent 被回复的评论（仅回复有值；一级评论不传该字段）。 | [optional] [default to undefined]
**parent_id** | **string** | 被回复的评论 ID / 楼层根评论 ID；一级评论两者均为 \&quot;\&quot;。 | [optional] [default to undefined]
**replies** | [**Array&lt;DtoCommentDto&gt;**](DtoCommentDto.md) |  | [optional] [default to undefined]
**reply_count** | **number** |  | [optional] [default to undefined]
**root_id** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoCommentDto } from './api';

const instance: DtoCommentDto = {
    article,
    article_id,
    author,
    author_id,
    content,
    created_at,
    floor,
    id,
    images,
    is_liked,
    is_pinned,
    likes,
    parent,
    parent_id,
    replies,
    reply_count,
    root_id,
    status,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

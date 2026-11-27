# DtoCollectionItemDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article** | [**DtoArticleDto**](DtoArticleDto.md) | 内嵌文章：对象，空时整个字段不传（docs/21 §一）。 类型是 dto.ArticleDto（service.ArticleView 的别名）—— 与 article 域共用一份定义， 不在这里重复声明字段（那样两边一改就打架）。 | [optional] [default to undefined]
**article_id** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**note** | **string** | 字符串：空时 \&quot;\&quot;（改前是 *string + omitempty，空时省略）。 | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoCollectionItemDto } from './api';

const instance: DtoCollectionItemDto = {
    article,
    article_id,
    created_at,
    id,
    note,
    sort,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

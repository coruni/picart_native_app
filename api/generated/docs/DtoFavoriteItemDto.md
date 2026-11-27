# DtoFavoriteItemDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article_id** | **string** |  | [optional] [default to undefined]
**author_id** | **string** |  | [optional] [default to undefined]
**cover** | **string** | 字符串值类型：空时 \&quot;\&quot;（docs/21）；指针会让空值输出 null。 | [optional] [default to undefined]
**favorited_at** | **string** |  | [optional] [default to undefined]
**summary** | **string** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoFavoriteItemDto } from './api';

const instance: DtoFavoriteItemDto = {
    article_id,
    author_id,
    cover,
    favorited_at,
    summary,
    title,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

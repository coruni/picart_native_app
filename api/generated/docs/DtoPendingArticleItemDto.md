# DtoPendingArticleItemDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**author_id** | **string** |  | [optional] [default to undefined]
**category_id** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**status** | **string** | Status 文章当前状态；本接口只返回 PENDING 的文章。 | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoPendingArticleItemDto } from './api';

const instance: DtoPendingArticleItemDto = {
    author_id,
    category_id,
    created_at,
    id,
    status,
    title,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

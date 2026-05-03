# CreateCommentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** | 评论内容 | [default to undefined]
**articleId** | **number** | 文章ID | [default to undefined]
**parentId** | **number** | 父评论ID | [optional] [default to undefined]
**images** | [**CreateCommentDtoImages**](CreateCommentDtoImages.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CreateCommentDto } from './api';

const instance: CreateCommentDto = {
    content,
    articleId,
    parentId,
    images,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

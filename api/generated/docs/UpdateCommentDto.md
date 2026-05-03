# UpdateCommentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** | 评论内容 | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** | 评论图片列表（最多9张） | [optional] [default to undefined]
**isPinned** | **boolean** | 是否置顶，仅文章作者或管理员可设置 | [optional] [default to false]

## Example

```typescript
import { UpdateCommentDto } from './api';

const instance: UpdateCommentDto = {
    content,
    images,
    isPinned,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

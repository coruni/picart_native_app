# CreateReportDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | 举报类型 | [default to undefined]
**reason** | **string** | 举报原因 | [default to undefined]
**category** | **string** | 举报分类 | [default to undefined]
**description** | **string** | 详细描述 | [optional] [default to undefined]
**reportedUserId** | **number** | 被举报用户ID | [optional] [default to undefined]
**reportedArticleId** | **number** | 被举报文章ID | [optional] [default to undefined]
**reportedCommentId** | **number** | 被举报评论ID | [optional] [default to undefined]

## Example

```typescript
import { CreateReportDto } from './api';

const instance: CreateReportDto = {
    type,
    reason,
    category,
    description,
    reportedUserId,
    reportedArticleId,
    reportedCommentId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

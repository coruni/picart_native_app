# DtoBrowseHistoryDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article** | [**DtoArticleDto**](DtoArticleDto.md) |  | [optional] [default to undefined]
**article_id** | **string** |  | [optional] [default to undefined]
**duration** | **number** |  | [optional] [default to undefined]
**id** | **string** | ID 浏览记录主键（唯一稳定 key；前端 keyExtractor / 去重用它，别再用 article_id@viewed_at 拼）。 | [optional] [default to undefined]
**progress** | **number** |  | [optional] [default to undefined]
**view_count** | **number** |  | [optional] [default to undefined]
**viewed_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoBrowseHistoryDto } from './api';

const instance: DtoBrowseHistoryDto = {
    article,
    article_id,
    duration,
    id,
    progress,
    view_count,
    viewed_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# DtoCreateArticleRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activity_id** | **string** |  | [optional] [default to undefined]
**allow_reprint** | **boolean** |  | [optional] [default to undefined]
**category_id** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**cover** | **string** |  | [optional] [default to undefined]
**downloads** | [**Array&lt;DtoArticleDownloadRequest&gt;**](DtoArticleDownloadRequest.md) |  | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**is_featured** | **boolean** |  | [optional] [default to undefined]
**is_pinned_on_profile** | **boolean** |  | [optional] [default to undefined]
**list_require_login** | **boolean** |  | [optional] [default to undefined]
**require_follow** | **boolean** |  | [optional] [default to undefined]
**require_login** | **boolean** |  | [optional] [default to undefined]
**require_membership** | **boolean** |  | [optional] [default to undefined]
**require_payment** | **boolean** |  | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**summary** | **string** |  | [optional] [default to undefined]
**tag_ids** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**tag_names** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**title** | **string** |  | [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**video_url** | **string** |  | [optional] [default to undefined]
**view_price** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoCreateArticleRequest } from './api';

const instance: DtoCreateArticleRequest = {
    activity_id,
    allow_reprint,
    category_id,
    content,
    cover,
    downloads,
    images,
    is_featured,
    is_pinned_on_profile,
    list_require_login,
    require_follow,
    require_login,
    require_membership,
    require_payment,
    sort,
    status,
    summary,
    tag_ids,
    tag_names,
    title,
    type,
    video_url,
    view_price,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

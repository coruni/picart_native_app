# ServiceCreateArticleRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activityId** | **string** |  | [optional] [default to undefined]
**allowReprint** | **boolean** |  | [optional] [default to undefined]
**categoryId** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**cover** | **string** |  | [optional] [default to undefined]
**downloads** | [**Array&lt;ServiceArticleDownloadRequest&gt;**](ServiceArticleDownloadRequest.md) |  | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**isFeatured** | **boolean** |  | [optional] [default to undefined]
**isPinnedOnProfile** | **boolean** |  | [optional] [default to undefined]
**listRequireLogin** | **boolean** |  | [optional] [default to undefined]
**requireFollow** | **boolean** |  | [optional] [default to undefined]
**requireLogin** | **boolean** |  | [optional] [default to undefined]
**requireMembership** | **boolean** |  | [optional] [default to undefined]
**requirePayment** | **boolean** |  | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**summary** | **string** |  | [optional] [default to undefined]
**tagIds** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**tagNames** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**title** | **string** |  | [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**videoUrl** | **string** |  | [optional] [default to undefined]
**viewPrice** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { ServiceCreateArticleRequest } from './api';

const instance: ServiceCreateArticleRequest = {
    activityId,
    allowReprint,
    categoryId,
    content,
    cover,
    downloads,
    images,
    isFeatured,
    isPinnedOnProfile,
    listRequireLogin,
    requireFollow,
    requireLogin,
    requireMembership,
    requirePayment,
    sort,
    status,
    summary,
    tagIds,
    tagNames,
    title,
    type,
    videoUrl,
    viewPrice,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

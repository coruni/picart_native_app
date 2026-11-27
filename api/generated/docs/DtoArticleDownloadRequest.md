# DtoArticleDownloadRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**extraction_code** | **string** | ExtractionCode 下载提取码（可空，与 password 是两回事）。 | [optional] [default to undefined]
**password** | **string** | Password 网盘分享密码（可空）。 | [optional] [default to undefined]
**type** | **string** | Type 下载类型，取值固定 10 个（对齐原 DownloadType 枚举）。 | [default to undefined]
**url** | **string** |  | [default to undefined]
**visible_without_permission** | **boolean** | VisibleWithoutPermission 文章设了门槛时该资源是否仍对无权限用户可见。 | [optional] [default to undefined]

## Example

```typescript
import { DtoArticleDownloadRequest } from './api';

const instance: DtoArticleDownloadRequest = {
    extraction_code,
    password,
    type,
    url,
    visible_without_permission,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

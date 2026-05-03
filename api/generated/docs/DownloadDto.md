# DownloadDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | 下载类型 | [default to undefined]
**url** | **string** | 下载链接 | [default to undefined]
**password** | **string** | 提取密码 | [optional] [default to undefined]
**extractionCode** | **string** | 提取码 | [optional] [default to undefined]
**visibleWithoutPermission** | **boolean** | 是否在文章需要权限时仍可见 | [optional] [default to false]

## Example

```typescript
import { DownloadDto } from './api';

const instance: DownloadDto = {
    type,
    url,
    password,
    extractionCode,
    visibleWithoutPermission,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

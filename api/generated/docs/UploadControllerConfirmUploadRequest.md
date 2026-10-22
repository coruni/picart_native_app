# UploadControllerConfirmUploadRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | **string** | S3 Key | [default to undefined]
**url** | **string** | 文件访问 URL | [default to undefined]
**originalName** | **string** | 原始文件名 | [default to undefined]
**mimeType** | **string** | MIME 类型 | [default to undefined]
**size** | **number** | 文件大小（字节） | [default to undefined]
**hash** | **string** | 文件哈希（可选） | [optional] [default to undefined]
**scene** | **string** | 上传场景，默认 image；上传头像请传 avatar，头像不会添加水印 | [optional] [default to undefined]

## Example

```typescript
import { UploadControllerConfirmUploadRequest } from './api';

const instance: UploadControllerConfirmUploadRequest = {
    key,
    url,
    originalName,
    mimeType,
    size,
    hash,
    scene,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

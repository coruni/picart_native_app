# DtoUploadDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**audit_result** | [**DtoUploadAuditResultDto**](DtoUploadAuditResultDto.md) |  | [optional] [default to undefined]
**audit_status** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**filename** | **string** |  | [optional] [default to undefined]
**hash** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**mime_type** | **string** |  | [optional] [default to undefined]
**original** | [**DtoUploadOriginalDto**](DtoUploadOriginalDto.md) | ---- 对象字段：空时整个字段不传（jsonb 列无值时是 JSON null）---- | [optional] [default to undefined]
**original_name** | **string** |  | [optional] [default to undefined]
**path** | **string** |  | [optional] [default to undefined]
**processed** | **boolean** |  | [optional] [default to undefined]
**reference_count** | **number** |  | [optional] [default to undefined]
**scene** | **string** |  | [optional] [default to undefined]
**size** | **number** |  | [optional] [default to undefined]
**storage** | **string** |  | [optional] [default to undefined]
**thumbnails** | [**Array&lt;DtoUploadThumbnailDto&gt;**](DtoUploadThumbnailDto.md) | ---- 数组字段：空时 []（去掉 omitempty，组装时必须 make）---- | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**url** | **string** |  | [optional] [default to undefined]
**user_id** | **string** |  | [optional] [default to undefined]
**video_compression_job** | [**DtoUploadVideoJobDto**](DtoUploadVideoJobDto.md) |  | [optional] [default to undefined]
**video_compression_status** | **string** |  | [optional] [default to undefined]
**watermarked** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoUploadDto } from './api';

const instance: DtoUploadDto = {
    audit_result,
    audit_status,
    created_at,
    filename,
    hash,
    id,
    mime_type,
    original,
    original_name,
    path,
    processed,
    reference_count,
    scene,
    size,
    storage,
    thumbnails,
    updated_at,
    url,
    user_id,
    video_compression_job,
    video_compression_status,
    watermarked,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

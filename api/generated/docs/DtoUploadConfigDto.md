# DtoUploadConfigDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**allowed_mime_types** | **{ [key: string]: Array&lt;string&gt;; }** |  | [optional] [default to undefined]
**compression** | [**DtoUploadCompressionDto**](DtoUploadCompressionDto.md) |  | [optional] [default to undefined]
**image_processing** | [**DtoUploadImageProcessingDto**](DtoUploadImageProcessingDto.md) |  | [optional] [default to undefined]
**limits** | [**DtoUploadLimitsDto**](DtoUploadLimitsDto.md) |  | [optional] [default to undefined]
**queue** | [**DtoUploadQueueDto**](DtoUploadQueueDto.md) |  | [optional] [default to undefined]
**storage** | [**DtoUploadStorageDto**](DtoUploadStorageDto.md) |  | [optional] [default to undefined]
**video_processing** | [**DtoUploadVideoProcessingDto**](DtoUploadVideoProcessingDto.md) |  | [optional] [default to undefined]
**watermark** | [**DtoUploadWatermarkDto**](DtoUploadWatermarkDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { DtoUploadConfigDto } from './api';

const instance: DtoUploadConfigDto = {
    allowed_mime_types,
    compression,
    image_processing,
    limits,
    queue,
    storage,
    video_processing,
    watermark,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# CreateBannerDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | 轮播标题 | [default to undefined]
**description** | **string** | 轮播描述 | [optional] [default to undefined]
**imageUrl** | **string** | 轮播图片URL | [default to undefined]
**linkUrl** | **string** | 跳转链接URL | [optional] [default to undefined]
**sortOrder** | **number** | 排序顺序（数字越大越靠前） | [default to undefined]
**status** | **string** | 轮播状态 | [optional] [default to StatusEnum_Active]

## Example

```typescript
import { CreateBannerDto } from './api';

const instance: CreateBannerDto = {
    title,
    description,
    imageUrl,
    linkUrl,
    sortOrder,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

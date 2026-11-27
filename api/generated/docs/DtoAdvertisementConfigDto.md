# DtoAdvertisementConfigDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article_bottom** | **string** |  | [optional] [default to undefined]
**article_bottom_link** | **string** |  | [optional] [default to undefined]
**article_sidebar** | **string** |  | [optional] [default to undefined]
**article_sidebar_link** | **string** |  | [optional] [default to undefined]
**article_top** | **string** |  | [optional] [default to undefined]
**article_top_link** | **string** |  | [optional] [default to undefined]
**enabled** | **boolean** |  | [optional] [default to undefined]
**global_notice** | **string** |  | [optional] [default to undefined]
**home_banner** | **string** |  | [optional] [default to undefined]
**home_banner_link** | **string** |  | [optional] [default to undefined]
**raw** | **{ [key: string]: any; }** | Raw 广告组的原始键值（含上面 11 个字段的源 key）。无配置时为 {}（不是 null）。 | [optional] [default to undefined]

## Example

```typescript
import { DtoAdvertisementConfigDto } from './api';

const instance: DtoAdvertisementConfigDto = {
    article_bottom,
    article_bottom_link,
    article_sidebar,
    article_sidebar_link,
    article_top,
    article_top_link,
    enabled,
    global_notice,
    home_banner,
    home_banner_link,
    raw,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# DtoAuditConfigDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aliyun_access_key_id** | **string** | Aliyun 阿里云 green（凭据字段不下发，见类型注释）。 | [optional] [default to undefined]
**aliyun_region** | **string** |  | [optional] [default to undefined]
**article_enabled** | **boolean** |  | [optional] [default to undefined]
**auto_block** | **boolean** | AutoBlock 命中后的处置：true &#x3D; 硬拦截（action&#x3D;block，passed&#x3D;false）； false &#x3D; 放行但转人工（action&#x3D;review，passed&#x3D;true）。 | [optional] [default to undefined]
**avatar_enabled** | **boolean** |  | [optional] [default to undefined]
**comment_enabled** | **boolean** | 四类内容的审核开关（false &#x3D; 该类型不送审，直接放行）。 | [optional] [default to undefined]
**image_enabled** | **boolean** |  | [optional] [default to undefined]
**provider** | **string** | Provider 审核服务商：none（仅本地敏感词）/ aliyun / tencent。 | [optional] [default to undefined]
**review_mode** | **string** | ReviewMode 审核模式：auto / manual。 | [optional] [default to undefined]
**sensitivity** | **string** | Sensitivity 敏感度：low / medium / high（默认 medium）。 | [optional] [default to undefined]
**tencent_image_biz** | **string** |  | [optional] [default to undefined]
**tencent_region** | **string** |  | [optional] [default to undefined]
**tencent_secret_id** | **string** | Tencent 腾讯云 CMS（凭据字段不下发，见类型注释）。 | [optional] [default to undefined]
**tencent_text_biz** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoAuditConfigDto } from './api';

const instance: DtoAuditConfigDto = {
    aliyun_access_key_id,
    aliyun_region,
    article_enabled,
    auto_block,
    avatar_enabled,
    comment_enabled,
    image_enabled,
    provider,
    review_mode,
    sensitivity,
    tencent_image_biz,
    tencent_region,
    tencent_secret_id,
    tencent_text_biz,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

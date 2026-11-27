# DtoConfigDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**group** | **string** |  | [optional] [default to undefined]
**has_value** | **boolean** | HasValue 后端是否已配置（DB 值非空）。敏感项 value 被打码后仍能靠它判断「有没有配」。 | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**key** | **string** |  | [optional] [default to undefined]
**masked** | **boolean** | Masked 该项是否属敏感项（读时打码 + 写时 \&quot;***\&quot; 视为「保持原值」）。 | [optional] [default to undefined]
**_public** | **boolean** |  | [optional] [default to undefined]
**startup_only** | **boolean** | StartupOnly 启动期配置：改了必须重启才生效，管理端应置灰只读（四个写入口也会硬拒）。 与 Masked 互不排斥 —— s3_access_key 两者同为 true（写路径拒、读路径仍打码）。 | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**value** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoConfigDto } from './api';

const instance: DtoConfigDto = {
    created_at,
    description,
    group,
    has_value,
    id,
    key,
    masked,
    _public,
    startup_only,
    type,
    updated_at,
    value,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# DtoTagDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article_count** | **number** |  | [optional] [default to undefined]
**avatar** | **string** |  | [optional] [default to undefined]
**background** | **string** |  | [optional] [default to undefined]
**cover** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** | 字符串字段：值类型，空时 \&quot;\&quot;（原 service.TagView 用 *string + omitempty， 会让前端拿到 undefined；docs/21 §一 要求 \&quot;\&quot;） | [optional] [default to undefined]
**follow_count** | **number** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_followed** | **boolean** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoTagDto } from './api';

const instance: DtoTagDto = {
    article_count,
    avatar,
    background,
    cover,
    created_at,
    description,
    follow_count,
    id,
    is_followed,
    name,
    sort,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# DtoCollectionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**avatar** | **string** |  | [optional] [default to undefined]
**cover** | **string** |  | [optional] [default to undefined]
**created_at** | **string** | 时间必有值（DB 记录的 created_at / updated_at），用 RFC3339 字符串。 | [optional] [default to undefined]
**description** | **string** | 字符串：值类型，空时 \&quot;\&quot;（docs/21 §一）。 改前是 *string + omitempty（空时省略），两种都不是 null，但规范要求 \&quot;\&quot;。 | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_public** | **boolean** |  | [optional] [default to undefined]
**item_count** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**user_id** | **string** |  | [optional] [default to undefined]
**views** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoCollectionDto } from './api';

const instance: DtoCollectionDto = {
    avatar,
    cover,
    created_at,
    description,
    id,
    is_public,
    item_count,
    name,
    sort,
    updated_at,
    user_id,
    views,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

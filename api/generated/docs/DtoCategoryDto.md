# DtoCategoryDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**article_count** | **number** |  | [optional] [default to undefined]
**avatar** | **string** |  | [optional] [default to undefined]
**background** | **string** |  | [optional] [default to undefined]
**children** | [**Array&lt;DtoCategoryDto&gt;**](DtoCategoryDto.md) | Children 子分类（tree&#x3D;true 或详情时填充；叶节点是 [] 不是 null）。 | [optional] [default to undefined]
**cover** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**follow_count** | **number** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**link** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**parent_id** | **string** |  | [optional] [default to undefined]
**sort** | **number** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoCategoryDto } from './api';

const instance: DtoCategoryDto = {
    article_count,
    avatar,
    background,
    children,
    cover,
    created_at,
    description,
    follow_count,
    id,
    link,
    name,
    parent_id,
    sort,
    status,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

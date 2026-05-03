# CreateFavoriteDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 收藏夹名称 | [default to undefined]
**description** | **string** | 收藏夹描述 | [optional] [default to undefined]
**cover** | **string** | 封面图片 | [optional] [default to undefined]
**isPublic** | **boolean** | 是否公开 | [optional] [default to false]
**sort** | **number** | 排序 | [optional] [default to 0]

## Example

```typescript
import { CreateFavoriteDto } from './api';

const instance: CreateFavoriteDto = {
    name,
    description,
    cover,
    isPublic,
    sort,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# CreateCollectionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 合集名称 | [default to undefined]
**description** | **string** | 合集描述 | [optional] [default to undefined]
**avatar** | **string** | 头像 | [optional] [default to undefined]
**cover** | **string** | 封面图片 | [optional] [default to undefined]
**isPublic** | **boolean** | 是否公开 | [optional] [default to false]
**sort** | **number** | 排序 | [optional] [default to 0]

## Example

```typescript
import { CreateCollectionDto } from './api';

const instance: CreateCollectionDto = {
    name,
    description,
    avatar,
    cover,
    isPublic,
    sort,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

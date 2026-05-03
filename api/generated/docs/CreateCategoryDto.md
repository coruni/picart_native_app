# CreateCategoryDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 分类名称 | [default to undefined]
**description** | **string** | 分类描述 | [optional] [default to undefined]
**sort** | **number** | 排序 | [default to 0]
**parentId** | **number** | 父分类ID | [optional] [default to undefined]
**link** | **string** | 自定义链接 | [optional] [default to undefined]
**avatar** | **string** | 分类头像 | [optional] [default to undefined]
**background** | **string** | 分类背景 | [optional] [default to undefined]
**cover** | **string** | 分类封面 | [optional] [default to undefined]
**status** | **string** | 分类状态 | [default to 'ENABLED']

## Example

```typescript
import { CreateCategoryDto } from './api';

const instance: CreateCategoryDto = {
    name,
    description,
    sort,
    parentId,
    link,
    avatar,
    background,
    cover,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

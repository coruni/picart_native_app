# UploadEmojiDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 表情名称 | [default to undefined]
**code** | **string** | 表情代码 | [optional] [default to undefined]
**category** | **string** | 分类 | [optional] [default to undefined]
**tags** | **string** | 标签（逗号分隔） | [optional] [default to undefined]
**isPublic** | **boolean** | 是否公开 | [default to true]

## Example

```typescript
import { UploadEmojiDto } from './api';

const instance: UploadEmojiDto = {
    name,
    code,
    category,
    tags,
    isPublic,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

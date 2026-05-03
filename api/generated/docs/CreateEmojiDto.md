# CreateEmojiDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 表情名称 | [default to undefined]
**url** | **string** | 表情图片URL | [default to undefined]
**code** | **string** | 表情代码 | [optional] [default to undefined]
**type** | **string** | 表情类型 | [default to TypeEnum_User]
**category** | **string** | 分类 | [optional] [default to undefined]
**tags** | **string** | 标签（逗号分隔） | [optional] [default to undefined]
**isPublic** | **boolean** | 是否公开 | [default to true]
**width** | **number** | 宽度 | [optional] [default to undefined]
**height** | **number** | 高度 | [optional] [default to undefined]
**fileSize** | **number** | 文件大小 | [optional] [default to undefined]
**mimeType** | **string** | 文件类型 | [optional] [default to undefined]

## Example

```typescript
import { CreateEmojiDto } from './api';

const instance: CreateEmojiDto = {
    name,
    url,
    code,
    type,
    category,
    tags,
    isPublic,
    width,
    height,
    fileSize,
    mimeType,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

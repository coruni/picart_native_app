# UpdateEmojiDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 表情名称 | [optional] [default to undefined]
**url** | **string** | 表情图片URL | [optional] [default to undefined]
**code** | **string** | 表情代码 | [optional] [default to undefined]
**type** | **string** | 表情类型 | [optional] [default to undefined]
**category** | **string** | 分类 | [optional] [default to undefined]
**tags** | **string** | 标签（逗号分隔） | [optional] [default to undefined]
**isPublic** | **boolean** | 是否公开 | [optional] [default to undefined]
**width** | **number** | 宽度 | [optional] [default to undefined]
**height** | **number** | 高度 | [optional] [default to undefined]
**fileSize** | **number** | 文件大小 | [optional] [default to undefined]
**mimeType** | **string** | 文件类型 | [optional] [default to undefined]
**status** | **string** | 状态 | [optional] [default to undefined]

## Example

```typescript
import { UpdateEmojiDto } from './api';

const instance: UpdateEmojiDto = {
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
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

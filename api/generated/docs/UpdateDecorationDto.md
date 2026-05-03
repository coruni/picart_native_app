# UpdateDecorationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 装饰品名称 | [optional] [default to undefined]
**type** | **string** | 装饰品类型 | [optional] [default to undefined]
**description** | **string** | 装饰品描述 | [optional] [default to undefined]
**imageUrl** | **string** | 装饰品图片URL | [optional] [default to undefined]
**previewUrl** | **string** | 预览图URL | [optional] [default to undefined]
**rarity** | **string** | 稀有度 | [optional] [default to undefined]
**obtainMethod** | **string** | 获取方式 | [optional] [default to undefined]
**isPurchasable** | **boolean** | 是否可购买 | [optional] [default to undefined]
**price** | **number** | 购买价格 | [optional] [default to undefined]
**isPermanent** | **boolean** | 是否永久 | [optional] [default to undefined]
**validDays** | **number** | 有效天数（0或999表示永久） | [optional] [default to undefined]
**sort** | **number** | 排序 | [optional] [default to undefined]
**requiredLikes** | **number** | 所需点赞数 | [optional] [default to undefined]
**requiredComments** | **number** | 所需评论数 | [optional] [default to undefined]

## Example

```typescript
import { UpdateDecorationDto } from './api';

const instance: UpdateDecorationDto = {
    name,
    type,
    description,
    imageUrl,
    previewUrl,
    rarity,
    obtainMethod,
    isPurchasable,
    price,
    isPermanent,
    validDays,
    sort,
    requiredLikes,
    requiredComments,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

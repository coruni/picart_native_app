# DtoAuthorBriefDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**avatar** | **string** |  | [optional] [default to undefined]
**certification** | [**DtoCertificationBriefDto**](DtoCertificationBriefDto.md) | Certification 已通过的认证详情；未认证时不传。 | [optional] [default to undefined]
**equipped_decorations** | [**{ [key: string]: DtoEquippedDecorationDto; }**](DtoEquippedDecorationDto.md) | EquippedDecorations 作者当前佩戴的装饰品，按 type 分组。  空时不传（不是 null、不是空对象）—— 见 docs/21 §一 规则 ③。 对齐原 NestJS processUserDecorations()：Record&lt;decorationType, Decoration&gt;。 | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_followed** | **boolean** |  | [optional] [default to undefined]
**nick_id** | **number** |  | [optional] [default to undefined]
**nick_id_str** | **string** |  | [optional] [default to undefined]
**nickname** | **string** |  | [optional] [default to undefined]
**username** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoAuthorBriefDto } from './api';

const instance: DtoAuthorBriefDto = {
    avatar,
    certification,
    equipped_decorations,
    id,
    is_followed,
    nick_id,
    nick_id_str,
    nickname,
    username,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

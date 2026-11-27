# DtoUserDecorationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activity_id** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**decoration** | [**DtoDecorationDto**](DtoDecorationDto.md) | 嵌套装饰品定义（service 批量补填；补不到时不传） | [optional] [default to undefined]
**decoration_id** | **string** |  | [optional] [default to undefined]
**expires_at** | **string** | 时间：空时整个字段不传（永久持有 / 未领奖时库里是 NULL） | [optional] [default to undefined]
**gift_from_user_id** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_permanent** | **boolean** |  | [optional] [default to undefined]
**is_using** | **boolean** |  | [optional] [default to undefined]
**obtain_method** | **string** |  | [optional] [default to undefined]
**order_id** | **string** |  | [optional] [default to undefined]
**remark** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**user_id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoUserDecorationDto } from './api';

const instance: DtoUserDecorationDto = {
    activity_id,
    created_at,
    decoration,
    decoration_id,
    expires_at,
    gift_from_user_id,
    id,
    is_permanent,
    is_using,
    obtain_method,
    order_id,
    remark,
    updated_at,
    user_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

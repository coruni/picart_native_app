# DtoCreatePaymentRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**order_id** | **string** | OrderID 待支付的订单 ID（必须是本人的、非 PAID 的订单）。 | [default to undefined]
**payment_method** | **string** | PaymentMethod 支付渠道；渠道开关由系统配置表控制，未开启返回「Payment channel disabled」。 | [default to undefined]
**return_url** | **string** | ReturnURL 支付完成后的前端跳转地址（可选；缺省用配置 default_return_url）。 | [optional] [default to undefined]
**type** | **string** | Type 仅 EPAY 生效的子渠道：alipay / wxpay / usdt（缺省 alipay）。 | [optional] [default to undefined]

## Example

```typescript
import { DtoCreatePaymentRequest } from './api';

const instance: DtoCreatePaymentRequest = {
    order_id,
    payment_method,
    return_url,
    type,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

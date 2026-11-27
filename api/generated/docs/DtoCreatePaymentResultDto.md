# DtoCreatePaymentResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**balance** | **number** | Balance 仅余额支付返回：支付后的钱包余额，**单位：元**。 | [optional] [default to undefined]
**code_url** | **string** | CodeURL 二维码内容（微信 Native）。 | [optional] [default to undefined]
**payment_id** | **string** |  | [optional] [default to undefined]
**payment_method** | **string** |  | [optional] [default to undefined]
**payment_url** | **string** | PaymentURL 跳转支付地址（支付宝 / 易支付）。 | [optional] [default to undefined]
**status** | **string** | Status 仅余额支付返回，固定 \&quot;SUCCESS\&quot;。 | [optional] [default to undefined]

## Example

```typescript
import { DtoCreatePaymentResultDto } from './api';

const instance: DtoCreatePaymentResultDto = {
    balance,
    code_url,
    payment_id,
    payment_method,
    payment_url,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

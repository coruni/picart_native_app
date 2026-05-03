# CreatePaymentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**orderId** | **number** | 订单ID | [default to undefined]
**paymentMethod** | **string** | 支付方式 | [default to undefined]
**returnUrl** | **string** | 支付完成后的跳转地址 | [optional] [default to undefined]
**type** | **string** | 支付类型（EPAY支付方式时必传） | [optional] [default to undefined]

## Example

```typescript
import { CreatePaymentDto } from './api';

const instance: CreatePaymentDto = {
    orderId,
    paymentMethod,
    returnUrl,
    type,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

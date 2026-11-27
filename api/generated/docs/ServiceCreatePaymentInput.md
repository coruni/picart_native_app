# ServiceCreatePaymentInput


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**orderId** | **string** |  | [default to undefined]
**paymentMethod** | **string** |  | [default to undefined]
**returnUrl** | **string** |  | [optional] [default to undefined]
**type** | **string** | epay 子类型：alipay/wxpay/usdt | [optional] [default to undefined]

## Example

```typescript
import { ServiceCreatePaymentInput } from './api';

const instance: ServiceCreatePaymentInput = {
    orderId,
    paymentMethod,
    returnUrl,
    type,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

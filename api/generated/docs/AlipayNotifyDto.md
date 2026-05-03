# AlipayNotifyDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**trade_no** | **string** | 支付宝交易号 | [default to undefined]
**out_trade_no** | **string** | 商户订单号 | [default to undefined]
**trade_status** | **string** | 交易状态 | [default to undefined]
**total_amount** | **string** | 交易金额 | [default to undefined]
**buyer_id** | **string** | 买家支付宝用户号 | [default to undefined]
**sign** | **string** | 签名 | [default to undefined]
**sign_type** | **string** | 签名类型 | [default to undefined]

## Example

```typescript
import { AlipayNotifyDto } from './api';

const instance: AlipayNotifyDto = {
    trade_no,
    out_trade_no,
    trade_status,
    total_amount,
    buyer_id,
    sign,
    sign_type,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

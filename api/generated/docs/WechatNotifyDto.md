# WechatNotifyDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**transaction_id** | **string** | 微信支付订单号 | [default to undefined]
**out_trade_no** | **string** | 商户订单号 | [default to undefined]
**trade_state** | **string** | 交易状态 | [default to undefined]
**amount** | **string** | 交易金额 | [default to undefined]
**openid** | **string** | 用户标识 | [default to undefined]
**sign** | **string** | 签名 | [default to undefined]

## Example

```typescript
import { WechatNotifyDto } from './api';

const instance: WechatNotifyDto = {
    transaction_id,
    out_trade_no,
    trade_state,
    amount,
    openid,
    sign,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

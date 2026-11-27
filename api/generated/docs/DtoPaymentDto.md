# DtoPaymentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** | Amount 支付金额，**单位：元**（decimal(10,2) / float64，精度语义保持原样）。 | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**details** | **{ [key: string]: any; }** | Details 支付详情（jsonb 透传）。按渠道不同含 alipayUrl / wechatCodeUrl / epayUrl / prepayId / orderNo / amount / previousBalance / currentBalance 等键； 余额支付含 balancePayment 标记。空时不传该字段（不是 null）。 | [optional] [default to undefined]
**error_message** | **string** | ErrorMessage 落账失败原因（英文，仅内部诊断用）；正常时为空串。 | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**order_id** | **string** |  | [optional] [default to undefined]
**paid_at** | **string** | PaidAt 支付成功时间；未成功时不传该字段（不是 null）。 | [optional] [default to undefined]
**payment_method** | **string** | PaymentMethod 支付渠道。 | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**third_party_order_no** | **string** | ThirdPartyOrderNo 第三方支付订单号；未回调时为空串（不是 null）。 | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**user_id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoPaymentDto } from './api';

const instance: DtoPaymentDto = {
    amount,
    created_at,
    details,
    error_message,
    id,
    order_id,
    paid_at,
    payment_method,
    status,
    third_party_order_no,
    updated_at,
    user_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

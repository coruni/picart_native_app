# DtoOrderWalletDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user_id** | **string** |  | [optional] [default to undefined]
**wallet** | **number** | Wallet 钱包余额，**单位：元**（model.UserPaymentView.Wallet 是 decimal(10,2)）。 | [optional] [default to undefined]

## Example

```typescript
import { DtoOrderWalletDto } from './api';

const instance: DtoOrderWalletDto = {
    user_id,
    wallet,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# DtoPointsChangeResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** | Amount 本次变动数量（发放为正、消费为负）。 | [optional] [default to undefined]
**current_points** | **number** | CurrentPoints 变动后的余额。 | [optional] [default to undefined]
**transaction** | [**DtoPointsTransactionDto**](DtoPointsTransactionDto.md) | Transaction 本次对应的流水；无流水时不传该字段（不是 null）。 | [optional] [default to undefined]

## Example

```typescript
import { DtoPointsChangeResultDto } from './api';

const instance: DtoPointsChangeResultDto = {
    amount,
    current_points,
    transaction,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

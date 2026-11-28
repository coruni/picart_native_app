# DtoQqbotApproveResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**application** | [**DtoQqbotApplicationDto**](DtoQqbotApplicationDto.md) |  | [optional] [default to undefined]
**outbox_id** | **string** | OutboxID 本次建出来的池任务 ID（审批只建任务不直接发，投递由池子完成）。 | [optional] [default to undefined]

## Example

```typescript
import { DtoQqbotApproveResultDto } from './api';

const instance: DtoQqbotApproveResultDto = {
    application,
    outbox_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

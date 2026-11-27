# DtoReportStatisticsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**by_category** | [**Array&lt;DtoGroupCountDto&gt;**](DtoGroupCountDto.md) |  | [optional] [default to undefined]
**by_status** | **{ [key: string]: number; }** |  | [optional] [default to undefined]
**by_type** | [**Array&lt;DtoGroupCountDto&gt;**](DtoGroupCountDto.md) |  | [optional] [default to undefined]
**total** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoReportStatisticsDto } from './api';

const instance: DtoReportStatisticsDto = {
    by_category,
    by_status,
    by_type,
    total,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

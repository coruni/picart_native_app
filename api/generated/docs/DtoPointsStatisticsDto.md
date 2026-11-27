# DtoPointsStatisticsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activities** | [**DtoPointsStatsActivitiesDto**](DtoPointsStatsActivitiesDto.md) |  | [optional] [default to undefined]
**by_source** | [**Array&lt;DtoPointsSourceStatDto&gt;**](DtoPointsSourceStatDto.md) | BySource 按来源统计的获取明细；空时输出 []（不是 null）。 | [optional] [default to undefined]
**points** | [**DtoPointsStatsPointsDto**](DtoPointsStatsPointsDto.md) |  | [optional] [default to undefined]
**tasks** | [**DtoPointsStatsTasksDto**](DtoPointsStatsTasksDto.md) |  | [optional] [default to undefined]
**transactions** | [**DtoPointsStatsTransactionsDto**](DtoPointsStatsTransactionsDto.md) |  | [optional] [default to undefined]
**users** | [**DtoPointsStatsUsersDto**](DtoPointsStatsUsersDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { DtoPointsStatisticsDto } from './api';

const instance: DtoPointsStatisticsDto = {
    activities,
    by_source,
    points,
    tasks,
    transactions,
    users,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

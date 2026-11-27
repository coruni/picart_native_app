# QqOAuthControllerWebRedirect200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**data** | **object** | Business data; omitted entirely when empty | [optional] [default to undefined]
**message** | **string** | English message from i18n catalog | [optional] [default to undefined]
**status_code** | **number** | Business status code; 0&#x3D;success, 5-6 digits for errors | [optional] [default to undefined]
**trace_id** | **string** | Trace ID (UUID) for log correlation | [optional] [default to undefined]
**timestamp** | **number** | Server timestamp in milliseconds | [optional] [default to undefined]

## Example

```typescript
import { QqOAuthControllerWebRedirect200Response } from './api';

const instance: QqOAuthControllerWebRedirect200Response = {
    data,
    message,
    status_code,
    trace_id,
    timestamp,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

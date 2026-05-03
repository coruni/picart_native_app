# AppApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**appControllerGetHello**](#appcontrollergethello) | **GET** / | AppController_getHello|

# **appControllerGetHello**
> appControllerGetHello()



### Example

```typescript
import {
    AppApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.appControllerGetHello(
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


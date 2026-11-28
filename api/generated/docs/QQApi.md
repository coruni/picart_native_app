# QQApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**qqbotControllerApproveApplication**](#qqbotcontrollerapproveapplication) | **POST** /qqbot/applications/{id}/approve | 同意申请（分配邀请码并进入发件池）|
|[**qqbotControllerBatchApprove**](#qqbotcontrollerbatchapprove) | **POST** /qqbot/applications/batch-approve | 批量同意（部分失败也返回 200，逐条看 results）|
|[**qqbotControllerGetApplication**](#qqbotcontrollergetapplication) | **GET** /qqbot/applications/{id} | 申请详情（含该用户聊天流水与相关池任务）|
|[**qqbotControllerListApplications**](#qqbotcontrollerlistapplications) | **GET** /qqbot/applications | 邀请码申请名单|
|[**qqbotControllerListConversations**](#qqbotcontrollerlistconversations) | **GET** /qqbot/conversations | 会话列表（按 openid 聚合：最后消息 + 未读 + 待发）|
|[**qqbotControllerListMessages**](#qqbotcontrollerlistmessages) | **GET** /qqbot/conversations/{openid}/messages | 某用户的聊天记录|
|[**qqbotControllerListOutbox**](#qqbotcontrollerlistoutbox) | **GET** /qqbot/outbox | 发件池列表（含 DEFERRED 积压与 FAILED 死信）|
|[**qqbotControllerRejectApplication**](#qqbotcontrollerrejectapplication) | **POST** /qqbot/applications/{id}/reject | 拒绝申请（给用户发拒绝通知）|
|[**qqbotControllerRetryOutbox**](#qqbotcontrollerretryoutbox) | **POST** /qqbot/outbox/{id}/retry | 人工重试一条池任务（FAILED/DEFERRED → PENDING 并立即投递）|
|[**qqbotControllerSendMessage**](#qqbotcontrollersendmessage) | **POST** /qqbot/messages/send | 后台给某用户发消息（走发件池）|
|[**qqbotControllerStatus**](#qqbotcontrollerstatus) | **GET** /qqbot/status | 机器人健康检查（配置齐否 + token 可用否 + 池子积压）|
|[**qqbotControllerWebhook**](#qqbotcontrollerwebhook) | **POST** /qqbot/webhook | QQ 机器人回调（平台调用，NoAuth）|

# **qqbotControllerApproveApplication**
> QqbotControllerApproveApplication200Response qqbotControllerApproveApplication()



### Example

```typescript
import {
    QQApi,
    Configuration,
    DtoQqbotApproveRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let id: string; //申请单 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let dtoQqbotApproveRequest: DtoQqbotApproveRequest; // (optional)

const { status, data } = await apiInstance.qqbotControllerApproveApplication(
    id,
    authorization,
    deviceId,
    deviceName,
    deviceType,
    dtoQqbotApproveRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoQqbotApproveRequest** | **DtoQqbotApproveRequest**|  | |
| **id** | [**string**] | 申请单 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerApproveApplication200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | 申请单不存在 |  -  |
|**409** | 该申请已审批过 |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerBatchApprove**
> QqbotControllerBatchApprove200Response qqbotControllerBatchApprove(dtoQqbotBatchApproveRequest)



### Example

```typescript
import {
    QQApi,
    Configuration,
    DtoQqbotBatchApproveRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let dtoQqbotBatchApproveRequest: DtoQqbotBatchApproveRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerBatchApprove(
    dtoQqbotBatchApproveRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoQqbotBatchApproveRequest** | **DtoQqbotBatchApproveRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerBatchApprove200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerGetApplication**
> QqbotControllerGetApplication200Response qqbotControllerGetApplication()



### Example

```typescript
import {
    QQApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let id: string; //申请单 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerGetApplication(
    id,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | 申请单 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerGetApplication200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | 申请单不存在 |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerListApplications**
> QqbotControllerListApplications200Response qqbotControllerListApplications()



### Example

```typescript
import {
    QQApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let page: string; //页码 (optional) (default to undefined)
let limit: string; //每页条数 (optional) (default to undefined)
let status: string; //状态：PENDING/APPROVED/REJECTED/CANCELLED (optional) (default to undefined)
let keyword: string; //关键字：open_id/昵称/内容/邀请码 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerListApplications(
    page,
    limit,
    status,
    keyword,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**string**] | 页码 | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 | (optional) defaults to undefined|
| **status** | [**string**] | 状态：PENDING/APPROVED/REJECTED/CANCELLED | (optional) defaults to undefined|
| **keyword** | [**string**] | 关键字：open_id/昵称/内容/邀请码 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerListApplications200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerListConversations**
> QqbotControllerListConversations200Response qqbotControllerListConversations()



### Example

```typescript
import {
    QQApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let page: string; //页码 (optional) (default to undefined)
let limit: string; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerListConversations(
    page,
    limit,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**string**] | 页码 | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerListConversations200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerListMessages**
> QqbotControllerListMessages200Response qqbotControllerListMessages()



### Example

```typescript
import {
    QQApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let openid: string; //用户 openid（机器人维度唯一） (default to undefined)
let page: string; //页码 (optional) (default to undefined)
let limit: string; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerListMessages(
    openid,
    page,
    limit,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **openid** | [**string**] | 用户 openid（机器人维度唯一） | defaults to undefined|
| **page** | [**string**] | 页码 | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerListMessages200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerListOutbox**
> QqbotControllerListOutbox200Response qqbotControllerListOutbox()



### Example

```typescript
import {
    QQApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let page: string; //页码 (optional) (default to undefined)
let limit: string; //每页条数 (optional) (default to undefined)
let status: string; //状态：PENDING/SENDING/DEFERRED/SENT/FAILED (optional) (default to undefined)
let kind: string; //类型：INVITE_CODE/REJECT/CHAT/AUTO_REPLY (optional) (default to undefined)
let openId: string; //按收件人过滤 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerListOutbox(
    page,
    limit,
    status,
    kind,
    openId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**string**] | 页码 | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 | (optional) defaults to undefined|
| **status** | [**string**] | 状态：PENDING/SENDING/DEFERRED/SENT/FAILED | (optional) defaults to undefined|
| **kind** | [**string**] | 类型：INVITE_CODE/REJECT/CHAT/AUTO_REPLY | (optional) defaults to undefined|
| **openId** | [**string**] | 按收件人过滤 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerListOutbox200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerRejectApplication**
> QqbotControllerApproveApplication200Response qqbotControllerRejectApplication()



### Example

```typescript
import {
    QQApi,
    Configuration,
    DtoQqbotRejectRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let id: string; //申请单 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let dtoQqbotRejectRequest: DtoQqbotRejectRequest; // (optional)

const { status, data } = await apiInstance.qqbotControllerRejectApplication(
    id,
    authorization,
    deviceId,
    deviceName,
    deviceType,
    dtoQqbotRejectRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoQqbotRejectRequest** | **DtoQqbotRejectRequest**|  | |
| **id** | [**string**] | 申请单 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerApproveApplication200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | 申请单不存在 |  -  |
|**409** | 该申请已审批过 |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerRetryOutbox**
> QqbotControllerSendMessage200Response qqbotControllerRetryOutbox()



### Example

```typescript
import {
    QQApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let id: string; //池任务 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerRetryOutbox(
    id,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | 池任务 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerSendMessage200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | 池任务不存在 |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerSendMessage**
> QqbotControllerSendMessage200Response qqbotControllerSendMessage(dtoQqbotSendMessageRequest)



### Example

```typescript
import {
    QQApi,
    Configuration,
    DtoQqbotSendMessageRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let dtoQqbotSendMessageRequest: DtoQqbotSendMessageRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerSendMessage(
    dtoQqbotSendMessageRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoQqbotSendMessageRequest** | **DtoQqbotSendMessageRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqbotControllerSendMessage200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerStatus**
> QqbotControllerStatus200Response qqbotControllerStatus()



### Example

```typescript
import {
    QQApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerStatus(
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

**QqbotControllerStatus200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqbotControllerWebhook**
> DtoQqbotWebhookValidationDto qqbotControllerWebhook(body)



### Example

```typescript
import {
    QQApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QQApi(configuration);

let body: object; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqbotControllerWebhook(
    body,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DtoQqbotWebhookValidationDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | op&#x3D;13 时返回 plain_token+signature；op&#x3D;0 时返回空对象 |  -  |
|**400** | 事件体结构非法 |  -  |
|**401** | 签名校验失败 |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |
|**503** | 未配置 bot_secret 或总开关关闭 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


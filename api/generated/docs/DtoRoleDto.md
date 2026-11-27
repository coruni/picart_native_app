# DtoRoleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**display_name** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_active** | **boolean** |  | [optional] [default to undefined]
**is_system** | **boolean** | IsSystem 系统内置角色不可删除（DeleteRole 会拒绝）。 | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**permissions** | [**Array&lt;DtoPermissionDto&gt;**](DtoPermissionDto.md) |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoRoleDto } from './api';

const instance: DtoRoleDto = {
    created_at,
    description,
    display_name,
    id,
    is_active,
    is_system,
    name,
    permissions,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

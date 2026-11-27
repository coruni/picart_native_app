# DtoRoleDetailDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**display_name** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**is_active** | **boolean** |  | [optional] [default to undefined]
**is_system** | **boolean** | IsSystem 系统内置角色不可删除（DeleteRole 会拒绝）。 | [optional] [default to undefined]
**menus** | **Array&lt;string&gt;** | Menus 该角色已分配的菜单键（对齐 role_menus.menu_key；全集见 DefaultMenuKeys）。 | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**permissions** | [**Array&lt;DtoPermissionDto&gt;**](DtoPermissionDto.md) |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { DtoRoleDetailDto } from './api';

const instance: DtoRoleDetailDto = {
    created_at,
    description,
    display_name,
    id,
    is_active,
    is_system,
    menus,
    name,
    permissions,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

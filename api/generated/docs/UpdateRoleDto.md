# UpdateRoleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 角色名称 | [optional] [default to undefined]
**displayName** | **string** | 角色显示名称 | [optional] [default to undefined]
**description** | **string** | 角色描述 | [optional] [default to undefined]
**permissionIds** | **Array&lt;number&gt;** | 权限ID列表 | [optional] [default to undefined]
**isActive** | **boolean** | 角色状态 | [optional] [default to undefined]
**isSystem** | **boolean** | 是否为系统角色 | [optional] [default to undefined]

## Example

```typescript
import { UpdateRoleDto } from './api';

const instance: UpdateRoleDto = {
    name,
    displayName,
    description,
    permissionIds,
    isActive,
    isSystem,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

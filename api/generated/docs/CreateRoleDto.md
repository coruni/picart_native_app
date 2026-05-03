# CreateRoleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 角色名称 | [default to undefined]
**displayName** | **string** | 角色显示名称 | [optional] [default to undefined]
**description** | **string** | 角色描述 | [default to undefined]
**permissionIds** | **Array&lt;string&gt;** | 权限ID列表 | [optional] [default to undefined]
**isActive** | **boolean** | 角色状态 | [optional] [default to true]
**isSystem** | **boolean** | 是否为系统角色 | [optional] [default to false]

## Example

```typescript
import { CreateRoleDto } from './api';

const instance: CreateRoleDto = {
    name,
    displayName,
    description,
    permissionIds,
    isActive,
    isSystem,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

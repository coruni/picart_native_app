# UpdateArticleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | 文章标题 | [optional] [default to undefined]
**content** | **string** | 文章内容 | [optional] [default to undefined]
**summary** | **string** | 文章摘要 | [optional] [default to undefined]
**images** | [**CreateArticleDtoImages**](CreateArticleDtoImages.md) |  | [optional] [default to undefined]
**cover** | **string** | 封面图片 | [optional] [default to undefined]
**sort** | **number** | 排序 | [optional] [default to 0]
**categoryId** | **number** | 分类ID | [optional] [default to undefined]
**tagNames** | **Array&lt;string&gt;** | 标签名称数组（不存在的标签会自动创建） | [optional] [default to undefined]
**tagIds** | **Array&lt;string&gt;** | 标签ID数组（与tagNames二选一） | [optional] [default to undefined]
**status** | **string** | 文章状态 | [optional] [default to StatusEnum_Draft]
**requireLogin** | **boolean** | 是否需要登录后才能查看 | [optional] [default to false]
**requireFollow** | **boolean** | 是否仅关注后可查看 | [optional] [default to false]
**requirePayment** | **boolean** | 是否需要支付后才能查看 | [optional] [default to false]
**requireMembership** | **boolean** | 是否需要会员才能查看 | [optional] [default to false]
**listRequireLogin** | **boolean** | 仅登录后才在列表显示 | [optional] [default to false]
**viewPrice** | **number** | 查看所需支付金额 | [optional] [default to 0]
**type** | **string** | 文章类型 | [optional] [default to TypeEnum_Mixed]
**activityId** | **number** | 关联活动ID | [optional] [default to undefined]
**downloads** | [**Array&lt;DownloadDto&gt;**](DownloadDto.md) | 下载资源列表 | [optional] [default to undefined]
**isFeatured** | **boolean** | 是否设为精华，仅管理员可设置 | [optional] [default to false]
**isPinnedOnProfile** | **boolean** | 是否在个人主页置顶，作者或管理员可设置 | [optional] [default to false]

## Example

```typescript
import { UpdateArticleDto } from './api';

const instance: UpdateArticleDto = {
    title,
    content,
    summary,
    images,
    cover,
    sort,
    categoryId,
    tagNames,
    tagIds,
    status,
    requireLogin,
    requireFollow,
    requirePayment,
    requireMembership,
    listRequireLogin,
    viewPrice,
    type,
    activityId,
    downloads,
    isFeatured,
    isPinnedOnProfile,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

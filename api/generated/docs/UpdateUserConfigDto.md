# UpdateUserConfigDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**articleCommissionRate** | **number** | 文章抽成比例，0-1 之间 | [optional] [default to undefined]
**membershipCommissionRate** | **number** | 会员抽成比例，0-1 之间 | [optional] [default to undefined]
**productCommissionRate** | **number** | 商品抽成比例，0-1 之间 | [optional] [default to undefined]
**serviceCommissionRate** | **number** | 服务抽成比例，0-1 之间 | [optional] [default to undefined]
**enableCustomCommission** | **boolean** | 是否启用自定义抽成 | [optional] [default to undefined]
**enableSystemNotification** | **boolean** | 是否接收系统通知 | [optional] [default to undefined]
**enableCommentNotification** | **boolean** | 是否接收评论通知 | [optional] [default to undefined]
**enableLikeNotification** | **boolean** | 是否接收点赞通知 | [optional] [default to undefined]
**enableFollowNotification** | **boolean** | 是否接收关注通知 | [optional] [default to undefined]
**enableMessageNotification** | **boolean** | 是否接收私信通知 | [optional] [default to undefined]
**enableOrderNotification** | **boolean** | 是否接收订单通知 | [optional] [default to undefined]
**enablePaymentNotification** | **boolean** | 是否接收支付通知 | [optional] [default to undefined]
**enableInviteNotification** | **boolean** | 是否接收邀请通知 | [optional] [default to undefined]
**enableEmailNotification** | **boolean** | 是否接收邮件通知 | [optional] [default to undefined]
**enableSmsNotification** | **boolean** | 是否接收短信通知 | [optional] [default to undefined]
**enablePushNotification** | **boolean** | 是否接收推送通知 | [optional] [default to undefined]
**hideFavorites** | **boolean** | 是否隐藏收藏夹 | [optional] [default to undefined]
**hideComments** | **boolean** | 是否隐藏评论列表 | [optional] [default to undefined]
**hideCollections** | **boolean** | 是否隐藏收藏夹列表 | [optional] [default to undefined]
**hideFollowers** | **boolean** | 是否隐藏粉丝列表 | [optional] [default to undefined]
**hideFollowings** | **boolean** | 是否隐藏关注列表 | [optional] [default to undefined]
**hideTags** | **boolean** | 是否隐藏标签列表 | [optional] [default to undefined]
**remark** | **string** | 备注 | [optional] [default to undefined]

## Example

```typescript
import { UpdateUserConfigDto } from './api';

const instance: UpdateUserConfigDto = {
    articleCommissionRate,
    membershipCommissionRate,
    productCommissionRate,
    serviceCommissionRate,
    enableCustomCommission,
    enableSystemNotification,
    enableCommentNotification,
    enableLikeNotification,
    enableFollowNotification,
    enableMessageNotification,
    enableOrderNotification,
    enablePaymentNotification,
    enableInviteNotification,
    enableEmailNotification,
    enableSmsNotification,
    enablePushNotification,
    hideFavorites,
    hideComments,
    hideCollections,
    hideFollowers,
    hideFollowings,
    hideTags,
    remark,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

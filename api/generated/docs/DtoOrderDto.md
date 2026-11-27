# DtoOrderDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** | Amount 订单金额，**单位：元**。模型侧是 decimal(10,2)，Go 侧 float64， dto 保持 float64 不改精度语义（改整数分会让前端所有金额计算失真）。 | [optional] [default to undefined]
**article_id** | **string** | ArticleID 文章 ID（仅 type&#x3D;ARTICLE 的订单有值）。 | [optional] [default to undefined]
**author_id** | **string** | AuthorID 卖家用户 ID。  ⚠️ 会员订单（type&#x3D;MEMBERSHIP）这里是**平台单哨兵值字面量 \&quot;1\&quot;**， 不是真实用户 ID（对齐原仓库 authorId&#x3D;1 的约定，见 order_service.go 的 CreateMembershipOrder）。前端若用它反查用户会 404，需按 type 分支处理。 已知问题 P3，本轮保持不动。 | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**details** | **{ [key: string]: any; }** | Details 订单详情（jsonb 透传）。内容随 type 变化： 文章单含 articleId/articleTitle/remark，会员单含 plan/duration/basePrice/ membershipLevel/membershipName/isLifetime/totalAmount，退款后多 refund 子对象。 空时不传该字段（不是 null）；因为是动态结构，不具名成固定 DTO。 | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**order_no** | **string** | OrderNo 订单号：ORDER + 毫秒时间戳 + 3 位随机（共 21 字符）。 | [optional] [default to undefined]
**paid_at** | **string** | PaidAt 支付时间；未支付时不传该字段（不是 null）。 | [optional] [default to undefined]
**payment_method** | **string** | PaymentMethod 支付方式；未支付时为空串（不是 null）。 | [optional] [default to undefined]
**payment_order_no** | **string** | PaymentOrderNo 第三方支付订单号；未支付时为空串。 | [optional] [default to undefined]
**remark** | **string** | Remark 备注（中文业务数据，不翻译）；无备注时为空串。 | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**title** | **string** | Title 订单标题。**中文业务数据（data 内容不是 message），不要翻译** （AGENTS「响应契约与 i18n」第 8 条）。 | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**user_id** | **string** | UserID 买家用户 ID。 | [optional] [default to undefined]

## Example

```typescript
import { DtoOrderDto } from './api';

const instance: DtoOrderDto = {
    amount,
    article_id,
    author_id,
    created_at,
    details,
    id,
    order_no,
    paid_at,
    payment_method,
    payment_order_no,
    remark,
    status,
    title,
    type,
    updated_at,
    user_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

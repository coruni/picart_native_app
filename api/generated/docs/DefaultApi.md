# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**achievementControllerClaimAllRewards**](#achievementcontrollerclaimallrewards) | **POST** /achievement/claim-all | 一键领取全部可领成就|
|[**achievementControllerClaimReward**](#achievementcontrollerclaimreward) | **POST** /achievement/{id}/claim | 领取成就奖励|
|[**achievementControllerCreate**](#achievementcontrollercreate) | **POST** /achievement | 创建成就定义|
|[**achievementControllerFindAll**](#achievementcontrollerfindall) | **GET** /achievement | 成就列表|
|[**achievementControllerFindOne**](#achievementcontrollerfindone) | **GET** /achievement/{id} | 成就详情|
|[**achievementControllerGetUserStats**](#achievementcontrollergetuserstats) | **GET** /achievement/stats | 我的成就进度统计|
|[**achievementControllerRemove**](#achievementcontrollerremove) | **DELETE** /achievement/{id} | 删除成就定义|
|[**achievementControllerUpdate**](#achievementcontrollerupdate) | **PATCH** /achievement/{id} | 更新成就定义|
|[**articleControllerBatchDeleteBrowseHistory**](#articlecontrollerbatchdeletebrowsehistory) | **POST** /article/browse/batch-delete | 批量删除浏览记录|
|[**articleControllerCancelDislikeArticle**](#articlecontrollercanceldislikearticle) | **DELETE** /article/{id}/dislike | 取消点踩|
|[**articleControllerCheckFavoriteStatus**](#articlecontrollercheckfavoritestatus) | **GET** /article/{id}/favorite/status | 收藏状态|
|[**articleControllerClearBrowseHistory**](#articlecontrollerclearbrowsehistory) | **DELETE** /article/browse | 清空浏览历史|
|[**articleControllerCreate**](#articlecontrollercreate) | **POST** /article | 创建文章|
|[**articleControllerDeleteBrowseHistory**](#articlecontrollerdeletebrowsehistory) | **DELETE** /article/browse/{article_id} | 删除浏览记录|
|[**articleControllerDislikeArticle**](#articlecontrollerdislikearticle) | **POST** /article/{id}/dislike | 点踩文章|
|[**articleControllerFavoriteArticle**](#articlecontrollerfavoritearticle) | **POST** /article/{id}/favorite | 收藏文章|
|[**articleControllerFindAll**](#articlecontrollerfindall) | **GET** /article | 文章列表|
|[**articleControllerFindByAuthor**](#articlecontrollerfindbyauthor) | **GET** /article/author/{id} | 作者主页文章|
|[**articleControllerFindOne**](#articlecontrollerfindone) | **GET** /article/{id} | 文章详情|
|[**articleControllerFindRecommendations**](#articlecontrollerfindrecommendations) | **GET** /article/recommend/{id} | 相关文章推荐|
|[**articleControllerGetBrowseHistory**](#articlecontrollergetbrowsehistory) | **GET** /article/browse/{article_id} | 单条浏览记录|
|[**articleControllerGetBrowseStats**](#articlecontrollergetbrowsestats) | **GET** /article/browse/stats | 浏览统计|
|[**articleControllerGetDislikeStatus**](#articlecontrollergetdislikestatus) | **GET** /article/{id}/dislike/status | 点踩状态|
|[**articleControllerGetDislikedArticles**](#articlecontrollergetdislikedarticles) | **GET** /article/disliked/list | 我点踩的文章|
|[**articleControllerGetDrafts**](#articlecontrollergetdrafts) | **GET** /article/drafts | 我的草稿箱|
|[**articleControllerGetFavoritedArticles**](#articlecontrollergetfavoritedarticles) | **GET** /article/favorited/list | 我收藏的文章|
|[**articleControllerGetHotSearches**](#articlecontrollergethotsearches) | **GET** /article/hot-search | 热搜词|
|[**articleControllerGetLikeCount**](#articlecontrollergetlikecount) | **GET** /article/{id}/like/count | 点赞数|
|[**articleControllerGetLikeStatus**](#articlecontrollergetlikestatus) | **GET** /article/{id}/like/status | 点赞状态|
|[**articleControllerGetLikedArticles**](#articlecontrollergetlikedarticles) | **GET** /article/liked | 我赞过的文章|
|[**articleControllerGetPublishedArticleIds**](#articlecontrollergetpublishedarticleids) | **GET** /article/published/ids | 已发布文章 ID 列表|
|[**articleControllerGetRecentBrowsedArticles**](#articlecontrollergetrecentbrowsedarticles) | **GET** /article/browse/recent | 最近浏览|
|[**articleControllerGetUserBrowseHistory**](#articlecontrollergetuserbrowsehistory) | **GET** /article/browse/history | 浏览历史|
|[**articleControllerLike**](#articlecontrollerlike) | **POST** /article/{id}/like | 点赞文章|
|[**articleControllerRemove**](#articlecontrollerremove) | **DELETE** /article/{id} | 删除文章|
|[**articleControllerSearch**](#articlecontrollersearch) | **GET** /article/search | 文章搜索（ES 优先，ES 不可用时回落 DB）|
|[**articleControllerSetFeatured**](#articlecontrollersetfeatured) | **PATCH** /article/{id}/featured | 设置/取消精华|
|[**articleControllerSetProfilePin**](#articlecontrollersetprofilepin) | **PATCH** /article/{id}/profile-pin | 设置/取消主页置顶|
|[**articleControllerShare**](#articlecontrollershare) | **POST** /article/{id}/share | 分享文章|
|[**articleControllerUnfavoriteArticle**](#articlecontrollerunfavoritearticle) | **DELETE** /article/{id}/favorite | 取消收藏|
|[**articleControllerUpdate**](#articlecontrollerupdate) | **PATCH** /article/{id} | 更新文章|
|[**articleControllerUpdateBrowseProgress**](#articlecontrollerupdatebrowseprogress) | **POST** /article/{id}/browse/progress | 上报阅读进度|
|[**authControllerLogoutAll**](#authcontrollerlogoutall) | **POST** /user/logout-all | 全端退出登录|
|[**authControllerSendSmsCode**](#authcontrollersendsmscode) | **POST** /auth/sms/send | 发送短信验证码|
|[**authControllerSmsLogin**](#authcontrollersmslogin) | **POST** /auth/sms/login | 手机验证码登录|
|[**bannerControllerCreate**](#bannercontrollercreate) | **POST** /banners | 创建轮播位|
|[**bannerControllerFindActive**](#bannercontrollerfindactive) | **GET** /banners/active | 当前生效轮播|
|[**bannerControllerFindAll**](#bannercontrollerfindall) | **GET** /banners | 轮播位列表（管理端）|
|[**bannerControllerFindOne**](#bannercontrollerfindone) | **GET** /banners/{id} | 轮播位详情|
|[**bannerControllerRemove**](#bannercontrollerremove) | **DELETE** /banners/{id} | 删除轮播位|
|[**bannerControllerUpdate**](#bannercontrollerupdate) | **PATCH** /banners/{id} | 更新轮播位|
|[**categoryControllerCreate**](#categorycontrollercreate) | **POST** /category | 创建分类|
|[**categoryControllerFindAll**](#categorycontrollerfindall) | **GET** /category | 分类列表|
|[**categoryControllerFindOne**](#categorycontrollerfindone) | **GET** /category/{id} | 分类详情|
|[**categoryControllerRemove**](#categorycontrollerremove) | **DELETE** /category/{id} | 删除分类|
|[**categoryControllerUpdate**](#categorycontrollerupdate) | **PATCH** /category/{id} | 更新分类|
|[**collectionControllerAddArticle**](#collectioncontrolleraddarticle) | **POST** /collection/{id}/article/{article_id} | 添加文章到合集|
|[**collectionControllerArticleCollectionInfo**](#collectioncontrollerarticlecollectioninfo) | **GET** /collection/article/{article_id}/info | 文章合集信息|
|[**collectionControllerCheckArticle**](#collectioncontrollercheckarticle) | **GET** /collection/check/{article_id} | 文章所在合集检查|
|[**collectionControllerCreate**](#collectioncontrollercreate) | **POST** /collection | 创建合集|
|[**collectionControllerFindAll**](#collectioncontrollerfindall) | **GET** /collection | 合集列表|
|[**collectionControllerFindItems**](#collectioncontrollerfinditems) | **GET** /collection/{id}/items | 合集内文章列表|
|[**collectionControllerFindOne**](#collectioncontrollerfindone) | **GET** /collection/{id} | 合集详情|
|[**collectionControllerRemove**](#collectioncontrollerremove) | **DELETE** /collection/{id} | 删除合集|
|[**collectionControllerRemoveArticle**](#collectioncontrollerremovearticle) | **DELETE** /collection/{id}/article/{article_id} | 从合集移除文章|
|[**collectionControllerReorderItems**](#collectioncontrollerreorderitems) | **PUT** /collection/{id}/items/order | 调整合集内文章顺序|
|[**collectionControllerUpdate**](#collectioncontrollerupdate) | **PATCH** /collection/{id} | 更新合集|
|[**commentControllerCreate**](#commentcontrollercreate) | **POST** /comment | 创建评论|
|[**commentControllerFindAll**](#commentcontrollerfindall) | **GET** /comment/article/{id} | 文章评论列表|
|[**commentControllerFindAllComments**](#commentcontrollerfindallcomments) | **GET** /comment | 全部评论（管理端）|
|[**commentControllerFindOne**](#commentcontrollerfindone) | **GET** /comment/{id} | 评论详情|
|[**commentControllerGetCommentCount**](#commentcontrollergetcommentcount) | **GET** /comment/article/{id}/count | 文章评论数|
|[**commentControllerGetUserComments**](#commentcontrollergetusercomments) | **GET** /comment/user/{user_id} | 用户评论列表|
|[**commentControllerLike**](#commentcontrollerlike) | **POST** /comment/{id}/like | 点赞评论|
|[**commentControllerRemove**](#commentcontrollerremove) | **DELETE** /comment/{id} | 删除评论|
|[**commentControllerSetPin**](#commentcontrollersetpin) | **PATCH** /comment/{id}/pin | 设置/取消评论置顶|
|[**commentControllerUpdate**](#commentcontrollerupdate) | **PATCH** /comment/{id} | 更新评论|
|[**configControllerBatchCreateSensitiveWords**](#configcontrollerbatchcreatesensitivewords) | **POST** /config/sensitive-words/batch | 批量导入敏感词|
|[**configControllerBatchRemoveSensitiveWords**](#configcontrollerbatchremovesensitivewords) | **DELETE** /config/sensitive-words/batch | 批量删除敏感词|
|[**configControllerClearSensitiveWordsCache**](#configcontrollerclearsensitivewordscache) | **POST** /config/sensitive-words/clear-cache | 清空敏感词缓存|
|[**configControllerCreate**](#configcontrollercreate) | **POST** /config | 创建配置项|
|[**configControllerCreateSensitiveWord**](#configcontrollercreatesensitiveword) | **POST** /config/sensitive-words | 新增敏感词|
|[**configControllerFindAll**](#configcontrollerfindall) | **GET** /config | 配置列表（管理端）|
|[**configControllerFindAllSensitiveWords**](#configcontrollerfindallsensitivewords) | **GET** /config/sensitive-words | 敏感词列表|
|[**configControllerFindByGroup**](#configcontrollerfindbygroup) | **GET** /config/group/{group} | 按分组读配置|
|[**configControllerFindByKey**](#configcontrollerfindbykey) | **GET** /config/key/{key} | 按键读配置|
|[**configControllerFindOne**](#configcontrollerfindone) | **GET** /config/{id} | 配置项详情|
|[**configControllerGetAdvertisementConfig**](#configcontrollergetadvertisementconfig) | **GET** /config/advertisement | 广告位配置|
|[**configControllerGetPublicConfigs**](#configcontrollergetpublicconfigs) | **GET** /config/public | 公开配置|
|[**configControllerRemove**](#configcontrollerremove) | **DELETE** /config/{id} | 删除配置项|
|[**configControllerRemoveSensitiveWord**](#configcontrollerremovesensitiveword) | **DELETE** /config/sensitive-words | 删除敏感词|
|[**configControllerUpdate**](#configcontrollerupdate) | **PATCH** /config/{id} | 按 ID 更新配置项|
|[**configControllerUpdateAll**](#configcontrollerupdateall) | **PATCH** /config | 批量更新配置|
|[**configControllerUpdateGroup**](#configcontrollerupdategroup) | **PATCH** /config/group/{group} | 按分组更新配置|
|[**contentAuditControllerAuditImage**](#contentauditcontrollerauditimage) | **POST** /content-audit/image | 图片送审（调试）|
|[**contentAuditControllerAuditText**](#contentauditcontrolleraudittext) | **POST** /content-audit/text | 文本送审（调试）|
|[**contentAuditControllerGetConfig**](#contentauditcontrollergetconfig) | **GET** /content-audit/config | 审核配置|
|[**contentAuditControllerGetPendingArticles**](#contentauditcontrollergetpendingarticles) | **GET** /content-audit/pending-articles | 待人工复审文章|
|[**contentAuditControllerReloadConfig**](#contentauditcontrollerreloadconfig) | **POST** /content-audit/config/reload | 重载审核配置|
|[**contentAuditControllerReviewArticle**](#contentauditcontrollerreviewarticle) | **POST** /content-audit/articles/{id}/review | 人工复审文章|
|[**decorationControllerClaimActivityReward**](#decorationcontrollerclaimactivityreward) | **POST** /decoration/activity/claim/{activity_id} | 领取活动奖励|
|[**decorationControllerCleanExpired**](#decorationcontrollercleanexpired) | **POST** /decoration/clean-expired | 清理过期装饰品（管理触发）|
|[**decorationControllerCreate**](#decorationcontrollercreate) | **POST** /decoration | 创建装饰品|
|[**decorationControllerCreateActivity**](#decorationcontrollercreateactivity) | **POST** /decoration/activity | 创建装饰品限时活动|
|[**decorationControllerFindAll**](#decorationcontrollerfindall) | **GET** /decoration | 装饰品商城列表|
|[**decorationControllerFindAllActivities**](#decorationcontrollerfindallactivities) | **GET** /decoration/activity | 装饰品活动列表|
|[**decorationControllerFindOne**](#decorationcontrollerfindone) | **GET** /decoration/{id} | 装饰品详情|
|[**decorationControllerFindOneActivity**](#decorationcontrollerfindoneactivity) | **GET** /decoration/activity/{id} | 活动详情|
|[**decorationControllerGetCurrentDecorations**](#decorationcontrollergetcurrentdecorations) | **GET** /decoration/user/current/decorations | 我当前佩戴的装饰品|
|[**decorationControllerGetMyAchievementBadges**](#decorationcontrollergetmyachievementbadges) | **GET** /decoration/achievement-badges/my | 我的成就徽章|
|[**decorationControllerGetMyActivityProgress**](#decorationcontrollergetmyactivityprogress) | **GET** /decoration/activity/progress/my | 我的活动进度|
|[**decorationControllerGetMyDecorations**](#decorationcontrollergetmydecorations) | **GET** /decoration/user/my | 我的装饰品|
|[**decorationControllerGetUserDecorations**](#decorationcontrollergetuserdecorations) | **GET** /decoration/user/{user_id} | 指定用户装饰品|
|[**decorationControllerGift**](#decorationcontrollergift) | **POST** /decoration/gift | 赠送装饰品|
|[**decorationControllerPurchase**](#decorationcontrollerpurchase) | **POST** /decoration/purchase | 购买装饰品|
|[**decorationControllerRemove**](#decorationcontrollerremove) | **DELETE** /decoration/{id} | 删除装饰品|
|[**decorationControllerRemoveActivity**](#decorationcontrollerremoveactivity) | **DELETE** /decoration/activity/{id} | 删除装饰品活动|
|[**decorationControllerUnuseDecoration**](#decorationcontrollerunusedecoration) | **POST** /decoration/unuse/{decoration_id} | 卸下装饰品|
|[**decorationControllerUpdate**](#decorationcontrollerupdate) | **PATCH** /decoration/{id} | 更新装饰品|
|[**decorationControllerUpdateActivity**](#decorationcontrollerupdateactivity) | **PATCH** /decoration/activity/{id} | 更新装饰品活动|
|[**decorationControllerUseDecoration**](#decorationcontrollerusedecoration) | **POST** /decoration/use/{decoration_id} | 佩戴装饰品|
|[**emojiControllerAddToFavorites**](#emojicontrolleraddtofavorites) | **POST** /emoji/{id}/favorite | 收藏表情|
|[**emojiControllerCreate**](#emojicontrollercreate) | **POST** /emoji | 创建表情|
|[**emojiControllerFindAll**](#emojicontrollerfindall) | **GET** /emoji | 表情列表|
|[**emojiControllerFindOne**](#emojicontrollerfindone) | **GET** /emoji/{id} | 表情详情|
|[**emojiControllerGetCategories**](#emojicontrollergetcategories) | **GET** /emoji/categories/list | 表情分类|
|[**emojiControllerGetFavorites**](#emojicontrollergetfavorites) | **GET** /emoji/favorites/list | 我收藏的表情|
|[**emojiControllerGetPopular**](#emojicontrollergetpopular) | **GET** /emoji/popular/list | 热门表情|
|[**emojiControllerGetRecent**](#emojicontrollergetrecent) | **GET** /emoji/recent/list | 我最近使用的表情|
|[**emojiControllerIncrementUseCount**](#emojicontrollerincrementusecount) | **POST** /emoji/{id}/use | 记录表情使用|
|[**emojiControllerRemove**](#emojicontrollerremove) | **DELETE** /emoji/{id} | 删除表情|
|[**emojiControllerRemoveFromFavorites**](#emojicontrollerremovefromfavorites) | **DELETE** /emoji/{id}/favorite | 取消收藏表情|
|[**emojiControllerUpdate**](#emojicontrollerupdate) | **PATCH** /emoji/{id} | 更新表情|
|[**emojiControllerUpload**](#emojicontrollerupload) | **POST** /emoji/upload | 上传表情（走图片审核队列）|
|[**emojiPackControllerAddEmoji**](#emojipackcontrolleraddemoji) | **POST** /emoji/packs/{id}/emojis | 向表情包添加表情|
|[**emojiPackControllerCreate**](#emojipackcontrollercreate) | **POST** /emoji/packs | 创建表情包|
|[**emojiPackControllerFindAll**](#emojipackcontrollerfindall) | **GET** /emoji/packs | 表情包列表|
|[**emojiPackControllerFindOne**](#emojipackcontrollerfindone) | **GET** /emoji/packs/{id} | 表情包详情|
|[**emojiPackControllerRemove**](#emojipackcontrollerremove) | **DELETE** /emoji/packs/{id} | 删除表情包|
|[**emojiPackControllerRemoveEmoji**](#emojipackcontrollerremoveemoji) | **DELETE** /emoji/packs/{id}/emojis/{emoji_id} | 从表情包移除表情|
|[**emojiPackControllerUpdate**](#emojipackcontrollerupdate) | **PATCH** /emoji/packs/{id} | 更新表情包|
|[**emojiPackControllerUpdateEmojiSort**](#emojipackcontrollerupdateemojisort) | **PATCH** /emoji/packs/{id}/emojis/{emoji_id} | 更新包内表情|
|[**inviteControllerCreateInvite**](#invitecontrollercreateinvite) | **POST** /invite | 生成邀请码|
|[**inviteControllerGetInviteDetail**](#invitecontrollergetinvitedetail) | **GET** /invite/{id} | 邀请码详情|
|[**inviteControllerGetInviteStats**](#invitecontrollergetinvitestats) | **GET** /invite/stats | 我的邀请统计|
|[**inviteControllerGetMyInviteEarnings**](#invitecontrollergetmyinviteearnings) | **GET** /invite/earnings | 我的邀请收益|
|[**inviteControllerGetMyInvites**](#invitecontrollergetmyinvites) | **GET** /invite/my | 我的邀请码列表|
|[**inviteControllerUseInvite**](#invitecontrolleruseinvite) | **POST** /invite/use | 绑定邀请人|
|[**messageControllerBatchOperation**](#messagecontrollerbatchoperation) | **POST** /message/batch | 批量操作（已读/删除）|
|[**messageControllerBlockPrivateUser**](#messagecontrollerblockprivateuser) | **POST** /message/private/block/{user_id} | 拉黑用户|
|[**messageControllerCreate**](#messagecontrollercreate) | **POST** /message | 创建站内消息|
|[**messageControllerFindAll**](#messagecontrollerfindall) | **GET** /message | 我的消息列表|
|[**messageControllerFindOne**](#messagecontrollerfindone) | **GET** /message/{id} | 消息详情|
|[**messageControllerGetBlockedUsers**](#messagecontrollergetblockedusers) | **GET** /message/private/blocks | 我的拉黑列表|
|[**messageControllerGetPrivateConversation**](#messagecontrollergetprivateconversation) | **GET** /message/private/conversations/{user_id}/messages | 私信历史|
|[**messageControllerGetPrivateConversations**](#messagecontrollergetprivateconversations) | **GET** /message/private/conversations | 私信会话列表|
|[**messageControllerGetUnreadCount**](#messagecontrollergetunreadcount) | **GET** /message/unread/count | 未读计数|
|[**messageControllerMarkAllAsRead**](#messagecontrollermarkallasread) | **POST** /message/read-all | 全部已读|
|[**messageControllerMarkAsRead**](#messagecontrollermarkasread) | **POST** /message/{id}/read | 单条已读|
|[**messageControllerMarkPrivateConversationRead**](#messagecontrollermarkprivateconversationread) | **POST** /message/private/conversations/{user_id}/read | 整会话已读|
|[**messageControllerMarkPrivateMessagesRead**](#messagecontrollermarkprivatemessagesread) | **POST** /message/private/read-batch | 批量私信已读|
|[**messageControllerRecallPrivateMessage**](#messagecontrollerrecallprivatemessage) | **POST** /message/private/recall/{id} | 撤回私信|
|[**messageControllerRemove**](#messagecontrollerremove) | **DELETE** /message/{id} | 删除消息|
|[**messageControllerSearch**](#messagecontrollersearch) | **GET** /message/search | 消息高级查询|
|[**messageControllerSendPrivateMessage**](#messagecontrollersendprivatemessage) | **POST** /message/private/{user_id} | 发送私信|
|[**messageControllerUnblockPrivateUser**](#messagecontrollerunblockprivateuser) | **DELETE** /message/private/block/{user_id} | 取消拉黑|
|[**messageControllerUpdate**](#messagecontrollerupdate) | **PATCH** /message/{id} | 更新消息|
|[**oAuthBindingControllerLink**](#oauthbindingcontrollerlink) | **POST** /user/oauth/bindings/link | 绑定第三方账号到当前用户|
|[**oAuthBindingControllerListBindings**](#oauthbindingcontrollerlistbindings) | **GET** /user/oauth/bindings | 我的第三方绑定列表|
|[**oAuthBindingControllerUnbind**](#oauthbindingcontrollerunbind) | **DELETE** /user/oauth/bindings/{provider}/{channel} | 解绑第三方账号|
|[**orderControllerCancelOrder**](#ordercontrollercancelorder) | **PUT** /order/{id}/cancel | 取消订单|
|[**orderControllerCreateArticleOrder**](#ordercontrollercreatearticleorder) | **POST** /order/article | 创建文章购买订单|
|[**orderControllerCreateMembershipOrder**](#ordercontrollercreatemembershiporder) | **POST** /order/membership | 创建会员订单|
|[**orderControllerFindByOrderNo**](#ordercontrollerfindbyorderno) | **GET** /order/no/{order_no} | 按订单号查询|
|[**orderControllerFindOne**](#ordercontrollerfindone) | **GET** /order/{id} | 订单详情|
|[**orderControllerGetAllOrders**](#ordercontrollergetallorders) | **GET** /order | 全部订单（管理端）|
|[**orderControllerGetPendingOrders**](#ordercontrollergetpendingorders) | **GET** /order/pending | 我的待支付订单|
|[**orderControllerGetUserOrders**](#ordercontrollergetuserorders) | **GET** /order/user | 我的订单|
|[**orderControllerGetWalletBalance**](#ordercontrollergetwalletbalance) | **GET** /order/wallet/balance | 钱包余额|
|[**orderControllerRequestRefund**](#ordercontrollerrequestrefund) | **POST** /order/{id}/refund | 申请退款|
|[**paymentControllerAlipayNotify**](#paymentcontrolleralipaynotify) | **POST** /payment/notify/alipay | 支付宝异步回调|
|[**paymentControllerCreatePayment**](#paymentcontrollercreatepayment) | **POST** /payment/create | 发起支付|
|[**paymentControllerEpayNotify**](#paymentcontrollerepaynotify) | **GET** /payment/notify/epay | 易支付异步回调|
|[**paymentControllerEpaySignature**](#paymentcontrollerepaysignature) | **POST** /payment/test/epay-signature | 易支付签名调试|
|[**paymentControllerFindPaymentByOrderId**](#paymentcontrollerfindpaymentbyorderid) | **GET** /payment/order/{order_id} | 按订单查支付记录|
|[**paymentControllerFindPaymentRecord**](#paymentcontrollerfindpaymentrecord) | **GET** /payment/record/{id} | 支付记录详情|
|[**paymentControllerFindUserPayments**](#paymentcontrollerfinduserpayments) | **GET** /payment/user | 我的支付记录|
|[**paymentControllerWechatNotify**](#paymentcontrollerwechatnotify) | **POST** /payment/notify/wechat | 微信支付异步回调|
|[**permissionControllerCreate**](#permissioncontrollercreate) | **POST** /permission | 创建权限点|
|[**permissionControllerFindAll**](#permissioncontrollerfindall) | **GET** /permission | 权限点列表|
|[**permissionControllerFindOne**](#permissioncontrollerfindone) | **GET** /permission/{id} | 权限点详情|
|[**permissionControllerGetTree**](#permissioncontrollergettree) | **GET** /permission/tree | 权限树|
|[**permissionControllerRemove**](#permissioncontrollerremove) | **DELETE** /permission/{id} | 删除权限点|
|[**permissionControllerUpdate**](#permissioncontrollerupdate) | **PATCH** /permission/{id} | 更新权限点|
|[**pointsControllerAddPoints**](#pointscontrolleraddpoints) | **POST** /points/add | 加积分|
|[**pointsControllerClaimTaskReward**](#pointscontrollerclaimtaskreward) | **POST** /points/activities/{id}/claim | 领取积分活动奖励|
|[**pointsControllerCreateActivity**](#pointscontrollercreateactivity) | **POST** /points/activities | 创建积分活动|
|[**pointsControllerFindAllActivities**](#pointscontrollerfindallactivities) | **GET** /points/activities | 积分活动列表|
|[**pointsControllerFindOneActivity**](#pointscontrollerfindoneactivity) | **GET** /points/activities/{id} | 积分活动详情|
|[**pointsControllerGetAllTransactions**](#pointscontrollergetalltransactions) | **GET** /points/transactions/all | 全部积分流水（管理端）|
|[**pointsControllerGetBalance**](#pointscontrollergetbalance) | **GET** /points/balance | 我的积分余额|
|[**pointsControllerGetMyTaskProgress**](#pointscontrollergetmytaskprogress) | **GET** /points/tasks/my/{activity_id} | 我的任务进度|
|[**pointsControllerGetMyTasks**](#pointscontrollergetmytasks) | **GET** /points/tasks/my | 我的积分任务|
|[**pointsControllerGetStatistics**](#pointscontrollergetstatistics) | **GET** /points/statistics | 积分统计|
|[**pointsControllerGetTransactions**](#pointscontrollergettransactions) | **GET** /points/transactions | 我的积分流水|
|[**pointsControllerGetUserBalance**](#pointscontrollergetuserbalance) | **GET** /points/users/{user_id}/balance | 指定用户积分余额|
|[**pointsControllerGetUserTransactions**](#pointscontrollergetusertransactions) | **GET** /points/users/{user_id}/transactions | 指定用户积分流水|
|[**pointsControllerRemoveActivity**](#pointscontrollerremoveactivity) | **DELETE** /points/activities/{id} | 删除积分活动|
|[**pointsControllerSpendPoints**](#pointscontrollerspendpoints) | **POST** /points/spend | 花积分|
|[**pointsControllerUpdateActivity**](#pointscontrollerupdateactivity) | **PATCH** /points/activities/{id} | 更新积分活动|
|[**qqAppLoginControllerLogin**](#qqapplogincontrollerlogin) | **POST** /user/oauth/qq/app/login | QQ App 登录（客户端交 access_token）|
|[**qqOAuthControllerWebCallback**](#qqoauthcontrollerwebcallback) | **POST** /user/oauth/qq/web/callback | QQ 网页回调（SPA 模式换本站 token）|
|[**qqOAuthControllerWebRedirect**](#qqoauthcontrollerwebredirect) | **GET** /user/oauth/qq/web/callback | [已删除 2026-11-28] QQ 网页回调（重定向模式，302 回前端带 token）|
|[**qqOAuthControllerWebURL**](#qqoauthcontrollerweburl) | **GET** /user/oauth/qq/web/url | QQ 网页登录（取授权链接）|
|[**reportControllerCreate**](#reportcontrollercreate) | **POST** /report | 提交举报|
|[**reportControllerFindAll**](#reportcontrollerfindall) | **GET** /report | 举报列表（管理端）|
|[**reportControllerFindOne**](#reportcontrollerfindone) | **GET** /report/{id} | 举报详情|
|[**reportControllerGetStatistics**](#reportcontrollergetstatistics) | **GET** /report/statistics | 举报统计|
|[**reportControllerRemove**](#reportcontrollerremove) | **DELETE** /report/{id} | 删除举报|
|[**reportControllerUpdate**](#reportcontrollerupdate) | **PATCH** /report/{id} | 处理举报|
|[**roleControllerAssignPermissions**](#rolecontrollerassignpermissions) | **POST** /role/{id}/permissions | 绑定角色权限|
|[**roleControllerBindMenus**](#rolecontrollerbindmenus) | **PUT** /role/{id}/menus | 绑定角色菜单|
|[**roleControllerCopyRole**](#rolecontrollercopyrole) | **POST** /role/{id}/copy | 复制角色|
|[**roleControllerCreate**](#rolecontrollercreate) | **POST** /role | 创建角色|
|[**roleControllerFindAll**](#rolecontrollerfindall) | **GET** /role | 角色列表（全量）|
|[**roleControllerFindOne**](#rolecontrollerfindone) | **GET** /role/{id} | 角色详情|
|[**roleControllerFindWithPagination**](#rolecontrollerfindwithpagination) | **GET** /role/list | 角色分页列表|
|[**roleControllerGetActiveRoles**](#rolecontrollergetactiveroles) | **GET** /role/active | 启用中的角色|
|[**roleControllerGetMenus**](#rolecontrollergetmenus) | **GET** /role/{id}/menus | 角色菜单|
|[**roleControllerRemove**](#rolecontrollerremove) | **DELETE** /role/{id} | 删除角色|
|[**roleControllerToggleStatus**](#rolecontrollertogglestatus) | **PATCH** /role/{id}/status | 启用/禁用角色|
|[**roleControllerUpdate**](#rolecontrollerupdate) | **PATCH** /role/{id} | 更新角色|
|[**searchControllerClearArticles**](#searchcontrollercleararticles) | **POST** /search/clear/articles | 清空文章索引|
|[**searchControllerGetHotKeywords**](#searchcontrollergethotkeywords) | **GET** /search/hot | 热搜词|
|[**searchControllerGetStatus**](#searchcontrollergetstatus) | **GET** /search/status | 搜索索引状态|
|[**searchControllerSearchArticles**](#searchcontrollersearcharticles) | **GET** /search | 搜索文章|
|[**searchControllerSearchTags**](#searchcontrollersearchtags) | **GET** /search/tags | 搜索标签|
|[**searchControllerSearchUsers**](#searchcontrollersearchusers) | **GET** /search/users | 搜索用户|
|[**searchControllerSyncArticles**](#searchcontrollersyncarticles) | **POST** /search/sync/articles | 全量同步文章到 ES|
|[**statisticsControllerGetOverview**](#statisticscontrollergetoverview) | **GET** /statistics/overview | 站点总览统计|
|[**statisticsControllerGetTrends**](#statisticscontrollergettrends) | **GET** /statistics/trends | 站点趋势统计|
|[**tagControllerCreate**](#tagcontrollercreate) | **POST** /tag | 创建标签|
|[**tagControllerFindAll**](#tagcontrollerfindall) | **GET** /tag | 标签列表|
|[**tagControllerFindOne**](#tagcontrollerfindone) | **GET** /tag/{id} | 标签详情|
|[**tagControllerFollow**](#tagcontrollerfollow) | **POST** /tag/{id}/follow | 关注标签|
|[**tagControllerGetFollowedTags**](#tagcontrollergetfollowedtags) | **GET** /tag/followed/list | 我关注的标签|
|[**tagControllerGetHotTags**](#tagcontrollergethottags) | **GET** /tag/hot | 热门标签|
|[**tagControllerGetRecommendedTags**](#tagcontrollergetrecommendedtags) | **GET** /tag/recommended | 推荐标签|
|[**tagControllerRemove**](#tagcontrollerremove) | **DELETE** /tag/{id} | 删除标签|
|[**tagControllerUnfollow**](#tagcontrollerunfollow) | **DELETE** /tag/{id}/follow | 取消关注标签|
|[**tagControllerUpdate**](#tagcontrollerupdate) | **PATCH** /tag/{id} | 更新标签|
|[**uploadControllerConfirmUpload**](#uploadcontrollerconfirmupload) | **POST** /upload/confirm | 确认直传完成入库|
|[**uploadControllerFillMissingMetadata**](#uploadcontrollerfillmissingmetadata) | **POST** /upload/migration/metadata | 回填元数据|
|[**uploadControllerFindAll**](#uploadcontrollerfindall) | **GET** /upload | 上传记录列表|
|[**uploadControllerGeneratePresignedUrl**](#uploadcontrollergeneratepresignedurl) | **POST** /upload/presign | S3 预签名直传|
|[**uploadControllerGetFileInfo**](#uploadcontrollergetfileinfo) | **GET** /upload/info/{id} | 上传记录详情|
|[**uploadControllerGetMigrationStats**](#uploadcontrollergetmigrationstats) | **GET** /upload/migration/stats | 迁移统计|
|[**uploadControllerGetUploadConfig**](#uploadcontrollergetuploadconfig) | **GET** /upload/config | 上传限制配置|
|[**uploadControllerProcessUncompressedImages**](#uploadcontrollerprocessuncompressedimages) | **POST** /upload/migration/process | 执行本地→S3 迁移|
|[**uploadControllerRemove**](#uploadcontrollerremove) | **DELETE** /upload/{id} | 删除上传记录|
|[**uploadControllerUploadAvatar**](#uploadcontrolleruploadavatar) | **POST** /upload/avatar | 上传头像（走图片审核）|
|[**uploadControllerUploadFile**](#uploadcontrolleruploadfile) | **POST** /upload/file | 上传文件|
|[**userCertificationControllerFindMine**](#usercertificationcontrollerfindmine) | **GET** /user/certification/me | 我的认证记录|
|[**userControllerApply**](#usercontrollerapply) | **POST** /user/certification/apply | 提交认证申请|
|[**userControllerAudit**](#usercontrolleraudit) | **PATCH** /user/certification/admin/applications/{id}/audit | 认证审核|
|[**userControllerBatchCheckMembershipStatus**](#usercontrollerbatchcheckmembershipstatus) | **POST** /user/membership/batch-check | 批量会员状态检查|
|[**userControllerCalculateCommission**](#usercontrollercalculatecommission) | **POST** /user/commission/calculate | 佣金试算|
|[**userControllerCancelAccountDeletion**](#usercontrollercancelaccountdeletion) | **POST** /user/account/deletion/cancel | 取消注销申请|
|[**userControllerChangePassword**](#usercontrollerchangepassword) | **POST** /user/password/change | 修改密码|
|[**userControllerCheckMembershipStatus**](#usercontrollercheckmembershipstatus) | **GET** /user/{id}/membership/check | 会员状态检查|
|[**userControllerCreate**](#usercontrollercreate) | **POST** /user | 管理员创建用户|
|[**userControllerFindAll**](#usercontrollerfindall) | **GET** /user | 用户列表|
|[**userControllerFindApplications**](#usercontrollerfindapplications) | **GET** /user/certification/admin/applications | 认证申请列表（管理端）|
|[**userControllerFindOne**](#usercontrollerfindone) | **GET** /user/{id} | 用户详情|
|[**userControllerFollow**](#usercontrollerfollow) | **POST** /user/{id}/follow | 关注用户|
|[**userControllerGetDeletionStatus**](#usercontrollergetdeletionstatus) | **GET** /user/account/status | 注销申请状态|
|[**userControllerGetFollowerCount**](#usercontrollergetfollowercount) | **GET** /user/{id}/followers/count | 粉丝数|
|[**userControllerGetFollowers**](#usercontrollergetfollowers) | **GET** /user/{id}/followers | 粉丝列表|
|[**userControllerGetFollowingCount**](#usercontrollergetfollowingcount) | **GET** /user/{id}/followings/count | 关注数|
|[**userControllerGetFollowings**](#usercontrollergetfollowings) | **GET** /user/{id}/followings | 关注列表|
|[**userControllerGetGithubOAuthUrl**](#usercontrollergetgithuboauthurl) | **GET** /user/oauth/github/url | GitHub 授权链接|
|[**userControllerGetIdentityByUserId**](#usercontrollergetidentitybyuserid) | **GET** /user/certification/identity/{user_id} | 指定用户身份标识|
|[**userControllerGetMenus**](#usercontrollergetmenus) | **GET** /profile/menus | 我的菜单树|
|[**userControllerGetMyCertification**](#usercontrollergetmycertification) | **GET** /user/certification/status | 我的认证状态|
|[**userControllerGetMyIdentity**](#usercontrollergetmyidentity) | **GET** /user/certification/identity | 我的身份标识|
|[**userControllerGetProfile**](#usercontrollergetprofile) | **GET** /user/profile | 当前用户资料|
|[**userControllerGetSignInRecords**](#usercontrollergetsigninrecords) | **GET** /user/sign-in/records | 签到记录|
|[**userControllerGetSignInStats**](#usercontrollergetsigninstats) | **GET** /user/sign-in/stats | 签到统计|
|[**userControllerGetUserCommissionConfig**](#usercontrollergetusercommissionconfig) | **GET** /user/commission/config | 读取佣金配置|
|[**userControllerGetUserConfig**](#usercontrollergetuserconfig) | **GET** /user/config | 我的用户配置|
|[**userControllerGetWalletBalance**](#usercontrollergetwalletbalance) | **GET** /user/wallet/balance | 钱包余额|
|[**userControllerGetWalletStatistics**](#usercontrollergetwalletstatistics) | **GET** /user/wallet/statistics | 钱包统计|
|[**userControllerGetWalletTransactions**](#usercontrollergetwallettransactions) | **GET** /user/wallet/transactions | 钱包流水|
|[**userControllerGithubOAuthCallback**](#usercontrollergithuboauthcallback) | **POST** /user/oauth/github/callback | GitHub 回调（SPA 模式换本站 token）|
|[**userControllerGithubOAuthRedirectCallback**](#usercontrollergithuboauthredirectcallback) | **GET** /user/oauth/github/callback | [已删除 2026-11-28] GitHub 回调（重定向模式）|
|[**userControllerLogin**](#usercontrollerlogin) | **POST** /user/login | 用户登录|
|[**userControllerLogout**](#usercontrollerlogout) | **POST** /user/logout | 退出登录|
|[**userControllerRefreshToken**](#usercontrollerrefreshtoken) | **POST** /user/refresh-token | 刷新 access token|
|[**userControllerRegisterUser**](#usercontrollerregisteruser) | **POST** /user/register | 用户注册|
|[**userControllerRemove**](#usercontrollerremove) | **DELETE** /user/{id} | 删除用户|
|[**userControllerRequestAccountDeletion**](#usercontrollerrequestaccountdeletion) | **POST** /user/account/deletion | 申请注销账号|
|[**userControllerResetPassword**](#usercontrollerresetpassword) | **POST** /user/password/reset | 邮箱验证码重置密码|
|[**userControllerRevoke**](#usercontrollerrevoke) | **POST** /user/certification/admin/applications/{id}/revoke | 撤销认证|
|[**userControllerSendVerificationCode**](#usercontrollersendverificationcode) | **POST** /user/email/verification | 发送邮箱验证码|
|[**userControllerSetUserCommissionConfig**](#usercontrollersetusercommissionconfig) | **POST** /user/commission/config | 设置佣金配置|
|[**userControllerSignIn**](#usercontrollersignin) | **POST** /user/sign-in | 每日签到|
|[**userControllerUnfollow**](#usercontrollerunfollow) | **POST** /user/{id}/unfollow | 取消关注|
|[**userControllerUpdate**](#usercontrollerupdate) | **PATCH** /user/{id} | 更新用户（管理端）|
|[**userControllerUpdateCommissionSettings**](#usercontrollerupdatecommissionsettings) | **PATCH** /user/config/commission | 更新全局佣金配置|
|[**userControllerUpdateContact**](#usercontrollerupdatecontact) | **PATCH** /user/profile/contact | 修改联系方式（需验证码）|
|[**userControllerUpdateNotificationSettings**](#usercontrollerupdatenotificationsettings) | **PATCH** /user/config/notifications | 更新通知偏好|
|[**userControllerUpdateProfile**](#usercontrollerupdateprofile) | **PATCH** /user/profile | 更新当前用户资料|
|[**userControllerUpdateUserConfig**](#usercontrollerupdateuserconfig) | **PATCH** /user/config | 更新用户配置|
|[**userControllerWithdrawWallet**](#usercontrollerwithdrawwallet) | **POST** /user/wallet/withdraw | 钱包提现|
|[**userProfileControllerBindPhone**](#userprofilecontrollerbindphone) | **POST** /user/profile/phone | 绑定手机号|
|[**userProfileControllerFindFavoriteDetail**](#userprofilecontrollerfindfavoritedetail) | **GET** /user/profile/favorites/{product_id} | 收藏项详情|
|[**userProfileControllerFindFavorites**](#userprofilecontrollerfindfavorites) | **GET** /user/profile/favorites | 我的收藏夹|
|[**userProfileControllerSendBindPhoneCode**](#userprofilecontrollersendbindphonecode) | **POST** /user/profile/phone/code | 发送绑定手机验证码|
|[**wechatOAuthControllerAppLogin**](#wechatoauthcontrollerapplogin) | **POST** /user/oauth/wechat/app/login | 微信 App 登录（客户端交 code）|
|[**wechatOAuthControllerWebCallback**](#wechatoauthcontrollerwebcallback) | **POST** /user/oauth/wechat/web/callback | 微信扫码回调（SPA 模式换本站 token）|
|[**wechatOAuthControllerWebRedirect**](#wechatoauthcontrollerwebredirect) | **GET** /user/oauth/wechat/web/callback | [已删除 2026-11-28] 微信扫码回调（重定向模式，302 回前端带 token）|
|[**wechatOAuthControllerWebURL**](#wechatoauthcontrollerweburl) | **GET** /user/oauth/wechat/web/url | 微信扫码登录（取授权链接）|

# **achievementControllerClaimAllRewards**
> AchievementControllerClaimAllRewards200Response achievementControllerClaimAllRewards()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerClaimAllRewards(
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

**AchievementControllerClaimAllRewards200Response**

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

# **achievementControllerClaimReward**
> AchievementControllerClaimReward200Response achievementControllerClaimReward()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //成就 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerClaimReward(
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
| **id** | [**string**] | 成就 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerClaimReward200Response**

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

# **achievementControllerCreate**
> AchievementControllerCreate200Response achievementControllerCreate(dtoCreateAchievementRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateAchievementRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateAchievementRequest: DtoCreateAchievementRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerCreate(
    dtoCreateAchievementRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateAchievementRequest** | **DtoCreateAchievementRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerCreate200Response**

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

# **achievementControllerFindAll**
> AchievementControllerFindAll200Response achievementControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerFindAll(
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

**AchievementControllerFindAll200Response**

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

# **achievementControllerFindOne**
> AchievementControllerCreate200Response achievementControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //成就 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerFindOne(
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
| **id** | [**string**] | 成就 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerCreate200Response**

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

# **achievementControllerGetUserStats**
> AchievementControllerGetUserStats200Response achievementControllerGetUserStats()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerGetUserStats(
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

**AchievementControllerGetUserStats200Response**

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

# **achievementControllerRemove**
> AchievementControllerRemove200Response achievementControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerRemove(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerRemove200Response**

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

# **achievementControllerUpdate**
> AchievementControllerCreate200Response achievementControllerUpdate(dtoUpdateAchievementRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateAchievementRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoUpdateAchievementRequest: DtoUpdateAchievementRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerUpdate(
    id,
    dtoUpdateAchievementRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateAchievementRequest** | **DtoUpdateAchievementRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerCreate200Response**

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

# **articleControllerBatchDeleteBrowseHistory**
> ArticleControllerBatchDeleteBrowseHistory200Response articleControllerBatchDeleteBrowseHistory()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerBatchDeleteBrowseHistory(
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

**ArticleControllerBatchDeleteBrowseHistory200Response**

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

# **articleControllerCancelDislikeArticle**
> ArticleControllerGetDislikeStatus200Response articleControllerCancelDislikeArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerCancelDislikeArticle(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetDislikeStatus200Response**

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

# **articleControllerCheckFavoriteStatus**
> ArticleControllerCheckFavoriteStatus200Response articleControllerCheckFavoriteStatus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerCheckFavoriteStatus(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerCheckFavoriteStatus200Response**

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

# **articleControllerClearBrowseHistory**
> ArticleControllerClearBrowseHistory200Response articleControllerClearBrowseHistory()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerClearBrowseHistory(
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

**ArticleControllerClearBrowseHistory200Response**

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

# **articleControllerCreate**
> ArticleControllerCreate200Response articleControllerCreate(dtoCreateArticleRequest)

提交文章（图片/混合/视频），入内容审核流程

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateArticleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateArticleRequest: DtoCreateArticleRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerCreate(
    dtoCreateArticleRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateArticleRequest** | **DtoCreateArticleRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerCreate200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Forbidden |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerDeleteBrowseHistory**
> ConfigControllerRemove200Response articleControllerDeleteBrowseHistory()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let articleId: string; //articleId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerDeleteBrowseHistory(
    articleId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **articleId** | [**string**] | articleId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ConfigControllerRemove200Response**

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

# **articleControllerDislikeArticle**
> ArticleControllerGetDislikeStatus200Response articleControllerDislikeArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerDislikeArticle(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetDislikeStatus200Response**

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

# **articleControllerFavoriteArticle**
> ArticleControllerFavoriteArticle200Response articleControllerFavoriteArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerFavoriteArticle(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFavoriteArticle200Response**

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

# **articleControllerFindAll**
> ArticleControllerFindAll200Response articleControllerFindAll()

分页浏览文章，支持标题/分类/标签/类型/状态筛选；携带 token 时返回当前用户互动状态

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码，默认 1 (optional) (default to undefined)
let limit: number; //每页条数，默认 10 (optional) (default to undefined)
let title: string; //标题关键字 (optional) (default to undefined)
let categoryId: string; //分类 ID (optional) (default to undefined)
let tagId: string; //标签 ID (optional) (default to undefined)
let type: string; //image/mixed/video，默认 all (optional) (default to undefined)
let sort: string; //排序方式（缺省按 type 的默认排序）example(latest) (optional) (default to undefined)
let status: string; //状态筛选，逗号分隔 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerFindAll(
    page,
    limit,
    title,
    categoryId,
    tagId,
    type,
    sort,
    status,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码，默认 1 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数，默认 10 | (optional) defaults to undefined|
| **title** | [**string**] | 标题关键字 | (optional) defaults to undefined|
| **categoryId** | [**string**] | 分类 ID | (optional) defaults to undefined|
| **tagId** | [**string**] | 标签 ID | (optional) defaults to undefined|
| **type** | [**string**] | image/mixed/video，默认 all | (optional) defaults to undefined|
| **sort** | [**string**] | 排序方式（缺省按 type 的默认排序）example(latest) | (optional) defaults to undefined|
| **status** | [**string**] | 状态筛选，逗号分隔 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

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

# **articleControllerFindByAuthor**
> ArticleControllerFindAll200Response articleControllerFindByAuthor()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerFindByAuthor(
    id,
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
| **id** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

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

# **articleControllerFindOne**
> ArticleControllerCreate200Response articleControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //文章 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerFindOne(
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
| **id** | [**string**] | 文章 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerCreate200Response**

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
|**404** | Not Found |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerFindRecommendations**
> ArticleControllerGetRecentBrowsedArticles200Response articleControllerFindRecommendations()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerFindRecommendations(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetRecentBrowsedArticles200Response**

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

# **articleControllerGetBrowseHistory**
> ArticleControllerGetBrowseHistory200Response articleControllerGetBrowseHistory()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let articleId: string; //articleId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetBrowseHistory(
    articleId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **articleId** | [**string**] | articleId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetBrowseHistory200Response**

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

# **articleControllerGetBrowseStats**
> ArticleControllerGetBrowseStats200Response articleControllerGetBrowseStats()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetBrowseStats(
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

**ArticleControllerGetBrowseStats200Response**

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

# **articleControllerGetDislikeStatus**
> ArticleControllerGetDislikeStatus200Response articleControllerGetDislikeStatus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetDislikeStatus(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetDislikeStatus200Response**

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

# **articleControllerGetDislikedArticles**
> ArticleControllerFindAll200Response articleControllerGetDislikedArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetDislikedArticles(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

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

# **articleControllerGetDrafts**
> ArticleControllerFindAll200Response articleControllerGetDrafts()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetDrafts(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

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

# **articleControllerGetFavoritedArticles**
> ArticleControllerFindAll200Response articleControllerGetFavoritedArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetFavoritedArticles(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

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

# **articleControllerGetHotSearches**
> ArticleControllerGetHotSearches200Response articleControllerGetHotSearches()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetHotSearches(
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

**ArticleControllerGetHotSearches200Response**

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

# **articleControllerGetLikeCount**
> ArticleControllerGetLikeCount200Response articleControllerGetLikeCount()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetLikeCount(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetLikeCount200Response**

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

# **articleControllerGetLikeStatus**
> ArticleControllerGetLikeStatus200Response articleControllerGetLikeStatus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetLikeStatus(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetLikeStatus200Response**

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

# **articleControllerGetLikedArticles**
> ArticleControllerFindAll200Response articleControllerGetLikedArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetLikedArticles(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

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

# **articleControllerGetPublishedArticleIds**
> ArticleControllerGetPublishedArticleIds200Response articleControllerGetPublishedArticleIds()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetPublishedArticleIds(
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

**ArticleControllerGetPublishedArticleIds200Response**

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

# **articleControllerGetRecentBrowsedArticles**
> ArticleControllerGetRecentBrowsedArticles200Response articleControllerGetRecentBrowsedArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetRecentBrowsedArticles(
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

**ArticleControllerGetRecentBrowsedArticles200Response**

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

# **articleControllerGetUserBrowseHistory**
> ArticleControllerGetUserBrowseHistory200Response articleControllerGetUserBrowseHistory()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let order: string; //排序方向（默认 newest）example(newest) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetUserBrowseHistory(
    page,
    limit,
    order,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **order** | [**string**] | 排序方向（默认 newest）example(newest) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetUserBrowseHistory200Response**

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

# **articleControllerLike**
> ArticleControllerLike200Response articleControllerLike()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerLike(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerLike200Response**

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

# **articleControllerRemove**
> AchievementControllerRemove200Response articleControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //文章 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerRemove(
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
| **id** | [**string**] | 文章 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerRemove200Response**

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
|**403** | Forbidden |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerSearch**
> ArticleControllerFindAll200Response articleControllerSearch()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let keyword: string; //搜索关键字 example(风景) (optional) (default to undefined)
let categoryId: string; //分类 ID example(2b3c4d5e-0000-4f60-9bac-000000000002) (optional) (default to undefined)
let sortBy: string; //排序方式（默认 relevance）example(relevance) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerSearch(
    page,
    limit,
    keyword,
    categoryId,
    sortBy,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **keyword** | [**string**] | 搜索关键字 example(风景) | (optional) defaults to undefined|
| **categoryId** | [**string**] | 分类 ID example(2b3c4d5e-0000-4f60-9bac-000000000002) | (optional) defaults to undefined|
| **sortBy** | [**string**] | 排序方式（默认 relevance）example(relevance) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

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

# **articleControllerSetFeatured**
> ArticleControllerSetFeatured200Response articleControllerSetFeatured(dtoSetFeaturedRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoSetFeaturedRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoSetFeaturedRequest: DtoSetFeaturedRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerSetFeatured(
    id,
    dtoSetFeaturedRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoSetFeaturedRequest** | **DtoSetFeaturedRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerSetFeatured200Response**

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

# **articleControllerSetProfilePin**
> ArticleControllerSetProfilePin200Response articleControllerSetProfilePin(dtoSetProfilePinRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoSetProfilePinRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoSetProfilePinRequest: DtoSetProfilePinRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerSetProfilePin(
    id,
    dtoSetProfilePinRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoSetProfilePinRequest** | **DtoSetProfilePinRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerSetProfilePin200Response**

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

# **articleControllerShare**
> ArticleControllerShare200Response articleControllerShare()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerShare(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerShare200Response**

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

# **articleControllerUnfavoriteArticle**
> ArticleControllerFavoriteArticle200Response articleControllerUnfavoriteArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerUnfavoriteArticle(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFavoriteArticle200Response**

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

# **articleControllerUpdate**
> ArticleControllerCreate200Response articleControllerUpdate(dtoUpdateArticleRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateArticleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //文章 ID (default to undefined)
let dtoUpdateArticleRequest: DtoUpdateArticleRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerUpdate(
    id,
    dtoUpdateArticleRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateArticleRequest** | **DtoUpdateArticleRequest**|  | |
| **id** | [**string**] | 文章 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerCreate200Response**

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
|**403** | Forbidden |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerUpdateBrowseProgress**
> ArticleControllerUpdateBrowseProgress200Response articleControllerUpdateBrowseProgress()



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoBrowseProgressRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let dtoBrowseProgressRequest: DtoBrowseProgressRequest; // (optional)

const { status, data } = await apiInstance.articleControllerUpdateBrowseProgress(
    id,
    authorization,
    deviceId,
    deviceName,
    deviceType,
    dtoBrowseProgressRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoBrowseProgressRequest** | **DtoBrowseProgressRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerUpdateBrowseProgress200Response**

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

# **authControllerLogoutAll**
> AuthControllerSendSmsCode200Response authControllerLogoutAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.authControllerLogoutAll(
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

**AuthControllerSendSmsCode200Response**

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

# **authControllerSendSmsCode**
> AuthControllerSendSmsCode200Response authControllerSendSmsCode()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.authControllerSendSmsCode(
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

**AuthControllerSendSmsCode200Response**

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

# **authControllerSmsLogin**
> QqOAuthControllerWebCallback200Response authControllerSmsLogin()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.authControllerSmsLogin(
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

**QqOAuthControllerWebCallback200Response**

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

# **bannerControllerCreate**
> BannerControllerCreate200Response bannerControllerCreate(dtoCreateBannerRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateBannerRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateBannerRequest: DtoCreateBannerRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.bannerControllerCreate(
    dtoCreateBannerRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateBannerRequest** | **DtoCreateBannerRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**BannerControllerCreate200Response**

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

# **bannerControllerFindActive**
> BannerControllerCreate200Response bannerControllerFindActive()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.bannerControllerFindActive(
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

**BannerControllerCreate200Response**

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

# **bannerControllerFindAll**
> BannerControllerFindAll200Response bannerControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.bannerControllerFindAll(
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

**BannerControllerFindAll200Response**

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

# **bannerControllerFindOne**
> BannerControllerCreate200Response bannerControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //轮播 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.bannerControllerFindOne(
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
| **id** | [**string**] | 轮播 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**BannerControllerCreate200Response**

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

# **bannerControllerRemove**
> AchievementControllerRemove200Response bannerControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //轮播 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.bannerControllerRemove(
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
| **id** | [**string**] | 轮播 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerRemove200Response**

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

# **bannerControllerUpdate**
> BannerControllerCreate200Response bannerControllerUpdate(dtoUpdateBannerRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateBannerRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //轮播 ID (default to undefined)
let dtoUpdateBannerRequest: DtoUpdateBannerRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.bannerControllerUpdate(
    id,
    dtoUpdateBannerRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateBannerRequest** | **DtoUpdateBannerRequest**|  | |
| **id** | [**string**] | 轮播 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**BannerControllerCreate200Response**

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

# **categoryControllerCreate**
> CategoryControllerCreate200Response categoryControllerCreate(dtoCreateCategoryRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateCategoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateCategoryRequest: DtoCreateCategoryRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.categoryControllerCreate(
    dtoCreateCategoryRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateCategoryRequest** | **DtoCreateCategoryRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CategoryControllerCreate200Response**

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

# **categoryControllerFindAll**
> CategoryControllerFindAll200Response categoryControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.categoryControllerFindAll(
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

**CategoryControllerFindAll200Response**

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

# **categoryControllerFindOne**
> CategoryControllerCreate200Response categoryControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //分类 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.categoryControllerFindOne(
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
| **id** | [**string**] | 分类 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CategoryControllerCreate200Response**

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

# **categoryControllerRemove**
> AchievementControllerRemove200Response categoryControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //分类 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.categoryControllerRemove(
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
| **id** | [**string**] | 分类 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerRemove200Response**

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

# **categoryControllerUpdate**
> CategoryControllerCreate200Response categoryControllerUpdate(dtoUpdateCategoryRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateCategoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //分类 ID (default to undefined)
let dtoUpdateCategoryRequest: DtoUpdateCategoryRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.categoryControllerUpdate(
    id,
    dtoUpdateCategoryRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateCategoryRequest** | **DtoUpdateCategoryRequest**|  | |
| **id** | [**string**] | 分类 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CategoryControllerCreate200Response**

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

# **collectionControllerAddArticle**
> CollectionControllerAddArticle200Response collectionControllerAddArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //合集 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let articleId: string; //文章 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerAddArticle(
    id,
    articleId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | 合集 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **articleId** | [**string**] | 文章 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerAddArticle200Response**

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

# **collectionControllerArticleCollectionInfo**
> CollectionControllerArticleCollectionInfo200Response collectionControllerArticleCollectionInfo()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let articleId: string; //articleId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerArticleCollectionInfo(
    articleId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **articleId** | [**string**] | articleId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerArticleCollectionInfo200Response**

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

# **collectionControllerCheckArticle**
> CollectionControllerCheckArticle200Response collectionControllerCheckArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let articleId: string; //articleId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerCheckArticle(
    articleId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **articleId** | [**string**] | articleId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerCheckArticle200Response**

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

# **collectionControllerCreate**
> CollectionControllerCreate200Response collectionControllerCreate(dtoCreateCollectionRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateCollectionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateCollectionRequest: DtoCreateCollectionRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerCreate(
    dtoCreateCollectionRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateCollectionRequest** | **DtoCreateCollectionRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerCreate200Response**

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

# **collectionControllerFindAll**
> CollectionControllerFindAll200Response collectionControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //按作者过滤 (optional) (default to undefined)
let keyword: string; //按名称搜索 (optional) (default to undefined)
let sortBy: string; //排序字段 (optional) (default to undefined)
let sortOrder: string; //排序方向 ASC / DESC（默认 DESC） (optional) (default to undefined)
let page: string; //页码 (optional) (default to undefined)
let limit: string; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerFindAll(
    userId,
    keyword,
    sortBy,
    sortOrder,
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
| **userId** | [**string**] | 按作者过滤 | (optional) defaults to undefined|
| **keyword** | [**string**] | 按名称搜索 | (optional) defaults to undefined|
| **sortBy** | [**string**] | 排序字段 | (optional) defaults to undefined|
| **sortOrder** | [**string**] | 排序方向 ASC / DESC（默认 DESC） | (optional) defaults to undefined|
| **page** | [**string**] | 页码 | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerFindAll200Response**

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

# **collectionControllerFindItems**
> CollectionControllerFindItems200Response collectionControllerFindItems()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //合集 ID (default to undefined)
let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerFindItems(
    id,
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
| **id** | [**string**] | 合集 ID | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerFindItems200Response**

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

# **collectionControllerFindOne**
> CollectionControllerFindOne200Response collectionControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //合集 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerFindOne(
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
| **id** | [**string**] | 合集 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerFindOne200Response**

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

# **collectionControllerRemove**
> AchievementControllerRemove200Response collectionControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //合集 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerRemove(
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
| **id** | [**string**] | 合集 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerRemove200Response**

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

# **collectionControllerRemoveArticle**
> CollectionControllerRemoveArticle200Response collectionControllerRemoveArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //合集 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let articleId: string; //文章 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerRemoveArticle(
    id,
    articleId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | 合集 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **articleId** | [**string**] | 文章 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerRemoveArticle200Response**

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

# **collectionControllerReorderItems**
> CollectionControllerReorderItems200Response collectionControllerReorderItems(dtoReorderCollectionItemsRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoReorderCollectionItemsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoReorderCollectionItemsRequest: DtoReorderCollectionItemsRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerReorderItems(
    id,
    dtoReorderCollectionItemsRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoReorderCollectionItemsRequest** | **DtoReorderCollectionItemsRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerReorderItems200Response**

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

# **collectionControllerUpdate**
> CollectionControllerCreate200Response collectionControllerUpdate(dtoUpdateCollectionRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateCollectionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //合集 ID (default to undefined)
let dtoUpdateCollectionRequest: DtoUpdateCollectionRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerUpdate(
    id,
    dtoUpdateCollectionRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateCollectionRequest** | **DtoUpdateCollectionRequest**|  | |
| **id** | [**string**] | 合集 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerCreate200Response**

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

# **commentControllerCreate**
> CommentControllerCreate200Response commentControllerCreate(dtoCreateCommentRequest)

对文章发表评论，入 text-audit 队列异步审核

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateCommentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateCommentRequest: DtoCreateCommentRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerCreate(
    dtoCreateCommentRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateCommentRequest** | **DtoCreateCommentRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerCreate200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerFindAll**
> CommentControllerFindAllComments200Response commentControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //文章 ID (default to undefined)
let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let onlyAuthor: string; //只看帖主（文章作者）的评论 example(false) (optional) (default to undefined)
let sortBy: string; //排序方式（置顶恒在最前，仅影响非置顶部分） (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerFindAll(
    id,
    page,
    limit,
    onlyAuthor,
    sortBy,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | 文章 ID | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **onlyAuthor** | [**string**] | 只看帖主（文章作者）的评论 example(false) | (optional) defaults to undefined|
| **sortBy** | [**string**] | 排序方式（置顶恒在最前，仅影响非置顶部分） | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerFindAllComments200Response**

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

# **commentControllerFindAllComments**
> CommentControllerFindAllComments200Response commentControllerFindAllComments()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let onlyAuthor: string; //只看帖主（文章作者）的评论 example(false) (optional) (default to undefined)
let sortBy: string; //排序方式（置顶恒在最前） (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerFindAllComments(
    page,
    limit,
    onlyAuthor,
    sortBy,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **onlyAuthor** | [**string**] | 只看帖主（文章作者）的评论 example(false) | (optional) defaults to undefined|
| **sortBy** | [**string**] | 排序方式（置顶恒在最前） | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerFindAllComments200Response**

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

# **commentControllerFindOne**
> CommentControllerCreate200Response commentControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let page: string; //回复页码 example(1) (optional) (default to undefined)
let limit: string; //回复每页条数 example(10) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerFindOne(
    id,
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
| **id** | [**string**] | id | defaults to undefined|
| **page** | [**string**] | 回复页码 example(1) | (optional) defaults to undefined|
| **limit** | [**string**] | 回复每页条数 example(10) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerCreate200Response**

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

# **commentControllerGetCommentCount**
> ArticleControllerGetLikeCount200Response commentControllerGetCommentCount()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerGetCommentCount(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetLikeCount200Response**

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

# **commentControllerGetUserComments**
> CommentControllerFindAllComments200Response commentControllerGetUserComments()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; // (default to undefined)
let page: string; //页码 example(1) (optional) (default to undefined)
let limit: string; //每页条数 example(10) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerGetUserComments(
    userId,
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
| **userId** | [**string**] |  | defaults to undefined|
| **page** | [**string**] | 页码 example(1) | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 example(10) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerFindAllComments200Response**

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

# **commentControllerLike**
> CommentControllerLike200Response commentControllerLike()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerLike(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerLike200Response**

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

# **commentControllerRemove**
> AchievementControllerRemove200Response commentControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //评论 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerRemove(
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
| **id** | [**string**] | 评论 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerRemove200Response**

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
|**403** | Forbidden |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerSetPin**
> CommentControllerSetPin200Response commentControllerSetPin(dtoSetCommentPinRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoSetCommentPinRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoSetCommentPinRequest: DtoSetCommentPinRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerSetPin(
    id,
    dtoSetCommentPinRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoSetCommentPinRequest** | **DtoSetCommentPinRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerSetPin200Response**

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

# **commentControllerUpdate**
> CommentControllerCreate200Response commentControllerUpdate(dtoUpdateCommentRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateCommentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoUpdateCommentRequest: DtoUpdateCommentRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerUpdate(
    id,
    dtoUpdateCommentRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateCommentRequest** | **DtoUpdateCommentRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerCreate200Response**

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

# **configControllerBatchCreateSensitiveWords**
> ConfigControllerBatchCreateSensitiveWords200Response configControllerBatchCreateSensitiveWords()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerBatchCreateSensitiveWords(
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

**ConfigControllerBatchCreateSensitiveWords200Response**

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

# **configControllerBatchRemoveSensitiveWords**
> ConfigControllerBatchCreateSensitiveWords200Response configControllerBatchRemoveSensitiveWords()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerBatchRemoveSensitiveWords(
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

**ConfigControllerBatchCreateSensitiveWords200Response**

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

# **configControllerClearSensitiveWordsCache**
> ConfigControllerClearSensitiveWordsCache200Response configControllerClearSensitiveWordsCache()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerClearSensitiveWordsCache(
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

**ConfigControllerClearSensitiveWordsCache200Response**

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

# **configControllerCreate**
> ConfigControllerCreate200Response configControllerCreate(dtoConfigRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoConfigRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoConfigRequest: DtoConfigRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerCreate(
    dtoConfigRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoConfigRequest** | **DtoConfigRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ConfigControllerCreate200Response**

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

# **configControllerCreateSensitiveWord**
> ConfigControllerCreateSensitiveWord200Response configControllerCreateSensitiveWord()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerCreateSensitiveWord(
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

**ConfigControllerCreateSensitiveWord200Response**

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

# **configControllerFindAll**
> ConfigControllerFindAll200Response configControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerFindAll(
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

**ConfigControllerFindAll200Response**

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

# **configControllerFindAllSensitiveWords**
> ConfigControllerFindAllSensitiveWords200Response configControllerFindAllSensitiveWords()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerFindAllSensitiveWords(
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

**ConfigControllerFindAllSensitiveWords200Response**

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

# **configControllerFindByGroup**
> ConfigControllerFindAll200Response configControllerFindByGroup()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let group: string; //分组名 (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerFindByGroup(
    group,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **group** | [**string**] | 分组名 | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ConfigControllerFindAll200Response**

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

# **configControllerFindByKey**
> ConfigControllerCreate200Response configControllerFindByKey()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let key: string; //配置键 (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerFindByKey(
    key,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **key** | [**string**] | 配置键 | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ConfigControllerCreate200Response**

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

# **configControllerFindOne**
> ConfigControllerCreate200Response configControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //配置 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerFindOne(
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
| **id** | [**string**] | 配置 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ConfigControllerCreate200Response**

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

# **configControllerGetAdvertisementConfig**
> ConfigControllerGetAdvertisementConfig200Response configControllerGetAdvertisementConfig()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerGetAdvertisementConfig(
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

**ConfigControllerGetAdvertisementConfig200Response**

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

# **configControllerGetPublicConfigs**
> ConfigControllerGetPublicConfigs200Response configControllerGetPublicConfigs()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerGetPublicConfigs(
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

**ConfigControllerGetPublicConfigs200Response**

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

# **configControllerRemove**
> ConfigControllerRemove200Response configControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //配置 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerRemove(
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
| **id** | [**string**] | 配置 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ConfigControllerRemove200Response**

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

# **configControllerRemoveSensitiveWord**
> ConfigControllerCreateSensitiveWord200Response configControllerRemoveSensitiveWord()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerRemoveSensitiveWord(
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

**ConfigControllerCreateSensitiveWord200Response**

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

# **configControllerUpdate**
> ConfigControllerCreate200Response configControllerUpdate(dtoConfigRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoConfigRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoConfigRequest: DtoConfigRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerUpdate(
    id,
    dtoConfigRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoConfigRequest** | **DtoConfigRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ConfigControllerCreate200Response**

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

# **configControllerUpdateAll**
> ConfigControllerUpdateAll200Response configControllerUpdateAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerUpdateAll(
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

**ConfigControllerUpdateAll200Response**

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

# **configControllerUpdateGroup**
> ConfigControllerUpdateAll200Response configControllerUpdateGroup(dtoConfigRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let group: string; //分组名 (default to undefined)
let dtoConfigRequest: Array<DtoConfigRequest>; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerUpdateGroup(
    group,
    dtoConfigRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoConfigRequest** | **Array<DtoConfigRequest>**|  | |
| **group** | [**string**] | 分组名 | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ConfigControllerUpdateAll200Response**

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

# **contentAuditControllerAuditImage**
> ContentAuditControllerAuditImage200Response contentAuditControllerAuditImage(dtoAuditImageRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoAuditImageRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoAuditImageRequest: DtoAuditImageRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.contentAuditControllerAuditImage(
    dtoAuditImageRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoAuditImageRequest** | **DtoAuditImageRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ContentAuditControllerAuditImage200Response**

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

# **contentAuditControllerAuditText**
> ContentAuditControllerAuditImage200Response contentAuditControllerAuditText(dtoAuditTextRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoAuditTextRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoAuditTextRequest: DtoAuditTextRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.contentAuditControllerAuditText(
    dtoAuditTextRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoAuditTextRequest** | **DtoAuditTextRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ContentAuditControllerAuditImage200Response**

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

# **contentAuditControllerGetConfig**
> ContentAuditControllerGetConfig200Response contentAuditControllerGetConfig()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.contentAuditControllerGetConfig(
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

**ContentAuditControllerGetConfig200Response**

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

# **contentAuditControllerGetPendingArticles**
> ContentAuditControllerGetPendingArticles200Response contentAuditControllerGetPendingArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.contentAuditControllerGetPendingArticles(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ContentAuditControllerGetPendingArticles200Response**

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

# **contentAuditControllerReloadConfig**
> ContentAuditControllerReloadConfig200Response contentAuditControllerReloadConfig()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.contentAuditControllerReloadConfig(
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

**ContentAuditControllerReloadConfig200Response**

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

# **contentAuditControllerReviewArticle**
> ContentAuditControllerReviewArticle200Response contentAuditControllerReviewArticle(dtoReviewArticleRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoReviewArticleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //文章 ID (default to undefined)
let dtoReviewArticleRequest: DtoReviewArticleRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.contentAuditControllerReviewArticle(
    id,
    dtoReviewArticleRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoReviewArticleRequest** | **DtoReviewArticleRequest**|  | |
| **id** | [**string**] | 文章 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ContentAuditControllerReviewArticle200Response**

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

# **decorationControllerClaimActivityReward**
> DecorationControllerClaimActivityReward200Response decorationControllerClaimActivityReward()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let activityId: string; //activityId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerClaimActivityReward(
    activityId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **activityId** | [**string**] | activityId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerClaimActivityReward200Response**

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

# **decorationControllerCleanExpired**
> DecorationControllerCleanExpired200Response decorationControllerCleanExpired()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerCleanExpired(
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

**DecorationControllerCleanExpired200Response**

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

# **decorationControllerCreate**
> DecorationControllerCreate200Response decorationControllerCreate(dtoDecorationInputRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoDecorationInputRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoDecorationInputRequest: DtoDecorationInputRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerCreate(
    dtoDecorationInputRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoDecorationInputRequest** | **DtoDecorationInputRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerCreate200Response**

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

# **decorationControllerCreateActivity**
> DecorationControllerCreateActivity200Response decorationControllerCreateActivity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerCreateActivity(
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

**DecorationControllerCreateActivity200Response**

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

# **decorationControllerFindAll**
> DecorationControllerFindAll200Response decorationControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerFindAll(
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

**DecorationControllerFindAll200Response**

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

# **decorationControllerFindAllActivities**
> DecorationControllerFindAllActivities200Response decorationControllerFindAllActivities()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerFindAllActivities(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerFindAllActivities200Response**

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

# **decorationControllerFindOne**
> DecorationControllerCreate200Response decorationControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //装饰品 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerFindOne(
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
| **id** | [**string**] | 装饰品 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerCreate200Response**

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

# **decorationControllerFindOneActivity**
> DecorationControllerCreateActivity200Response decorationControllerFindOneActivity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerFindOneActivity(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerCreateActivity200Response**

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

# **decorationControllerGetCurrentDecorations**
> DecorationControllerGetCurrentDecorations200Response decorationControllerGetCurrentDecorations()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGetCurrentDecorations(
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

**DecorationControllerGetCurrentDecorations200Response**

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

# **decorationControllerGetMyAchievementBadges**
> DecorationControllerGetMyAchievementBadges200Response decorationControllerGetMyAchievementBadges()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGetMyAchievementBadges(
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

**DecorationControllerGetMyAchievementBadges200Response**

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

# **decorationControllerGetMyActivityProgress**
> DecorationControllerGetMyActivityProgress200Response decorationControllerGetMyActivityProgress()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGetMyActivityProgress(
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

**DecorationControllerGetMyActivityProgress200Response**

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

# **decorationControllerGetMyDecorations**
> DecorationControllerGetMyAchievementBadges200Response decorationControllerGetMyDecorations()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGetMyDecorations(
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

**DecorationControllerGetMyAchievementBadges200Response**

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

# **decorationControllerGetUserDecorations**
> DecorationControllerGetMyAchievementBadges200Response decorationControllerGetUserDecorations()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //userId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGetUserDecorations(
    userId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | userId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerGetMyAchievementBadges200Response**

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

# **decorationControllerGift**
> DecorationControllerClaimActivityReward200Response decorationControllerGift()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGift(
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

**DecorationControllerClaimActivityReward200Response**

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

# **decorationControllerPurchase**
> DecorationControllerClaimActivityReward200Response decorationControllerPurchase(dtoPurchaseDecorationRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoPurchaseDecorationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoPurchaseDecorationRequest: DtoPurchaseDecorationRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerPurchase(
    dtoPurchaseDecorationRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoPurchaseDecorationRequest** | **DtoPurchaseDecorationRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerClaimActivityReward200Response**

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

# **decorationControllerRemove**
> DecorationControllerRemoveActivity200Response decorationControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //装饰品 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerRemove(
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
| **id** | [**string**] | 装饰品 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerRemoveActivity200Response**

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

# **decorationControllerRemoveActivity**
> DecorationControllerRemoveActivity200Response decorationControllerRemoveActivity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerRemoveActivity(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerRemoveActivity200Response**

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

# **decorationControllerUnuseDecoration**
> DecorationControllerClaimActivityReward200Response decorationControllerUnuseDecoration()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let decorationId: string; //decorationId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerUnuseDecoration(
    decorationId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **decorationId** | [**string**] | decorationId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerClaimActivityReward200Response**

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

# **decorationControllerUpdate**
> DecorationControllerCreate200Response decorationControllerUpdate(dtoDecorationInputRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoDecorationInputRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoDecorationInputRequest: DtoDecorationInputRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerUpdate(
    id,
    dtoDecorationInputRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoDecorationInputRequest** | **DtoDecorationInputRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerCreate200Response**

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

# **decorationControllerUpdateActivity**
> DecorationControllerCreateActivity200Response decorationControllerUpdateActivity(dtoDecorationActivityInputRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoDecorationActivityInputRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoDecorationActivityInputRequest: DtoDecorationActivityInputRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerUpdateActivity(
    id,
    dtoDecorationActivityInputRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoDecorationActivityInputRequest** | **DtoDecorationActivityInputRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerCreateActivity200Response**

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

# **decorationControllerUseDecoration**
> DecorationControllerClaimActivityReward200Response decorationControllerUseDecoration()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let decorationId: string; //装饰品 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerUseDecoration(
    decorationId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **decorationId** | [**string**] | 装饰品 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerClaimActivityReward200Response**

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

# **emojiControllerAddToFavorites**
> EmojiControllerAddToFavorites200Response emojiControllerAddToFavorites()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //表情 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerAddToFavorites(
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
| **id** | [**string**] | 表情 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiControllerAddToFavorites200Response**

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

# **emojiControllerCreate**
> EmojiControllerCreate200Response emojiControllerCreate(dtoEmojiInputRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoEmojiInputRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoEmojiInputRequest: DtoEmojiInputRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerCreate(
    dtoEmojiInputRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoEmojiInputRequest** | **DtoEmojiInputRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiControllerCreate200Response**

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

# **emojiControllerFindAll**
> EmojiControllerFindAll200Response emojiControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerFindAll(
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

**EmojiControllerFindAll200Response**

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

# **emojiControllerFindOne**
> EmojiControllerCreate200Response emojiControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //表情 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerFindOne(
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
| **id** | [**string**] | 表情 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiControllerCreate200Response**

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

# **emojiControllerGetCategories**
> ArticleControllerGetPublishedArticleIds200Response emojiControllerGetCategories()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerGetCategories(
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

**ArticleControllerGetPublishedArticleIds200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 分类名数组（空时 []） |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerGetFavorites**
> EmojiControllerFindAll200Response emojiControllerGetFavorites()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerGetFavorites(
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

**EmojiControllerFindAll200Response**

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

# **emojiControllerGetPopular**
> EmojiControllerGetPopular200Response emojiControllerGetPopular()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerGetPopular(
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

**EmojiControllerGetPopular200Response**

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

# **emojiControllerGetRecent**
> EmojiControllerGetPopular200Response emojiControllerGetRecent()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerGetRecent(
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

**EmojiControllerGetPopular200Response**

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

# **emojiControllerIncrementUseCount**
> EmojiControllerIncrementUseCount200Response emojiControllerIncrementUseCount()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerIncrementUseCount(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiControllerIncrementUseCount200Response**

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

# **emojiControllerRemove**
> DecorationControllerRemoveActivity200Response emojiControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerRemove(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerRemoveActivity200Response**

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

# **emojiControllerRemoveFromFavorites**
> EmojiControllerAddToFavorites200Response emojiControllerRemoveFromFavorites()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerRemoveFromFavorites(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiControllerAddToFavorites200Response**

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

# **emojiControllerUpdate**
> EmojiControllerCreate200Response emojiControllerUpdate(dtoEmojiInputRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoEmojiInputRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoEmojiInputRequest: DtoEmojiInputRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerUpdate(
    id,
    dtoEmojiInputRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoEmojiInputRequest** | **DtoEmojiInputRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiControllerCreate200Response**

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

# **emojiControllerUpload**
> EmojiControllerCreate200Response emojiControllerUpload()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerUpload(
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

**EmojiControllerCreate200Response**

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

# **emojiPackControllerAddEmoji**
> EmojiPackControllerAddEmoji200Response emojiPackControllerAddEmoji(dtoEmojiPackAddEmojiRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoEmojiPackAddEmojiRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoEmojiPackAddEmojiRequest: DtoEmojiPackAddEmojiRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiPackControllerAddEmoji(
    id,
    dtoEmojiPackAddEmojiRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoEmojiPackAddEmojiRequest** | **DtoEmojiPackAddEmojiRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiPackControllerAddEmoji200Response**

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

# **emojiPackControllerCreate**
> EmojiPackControllerCreate200Response emojiPackControllerCreate(dtoEmojiPackInputRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoEmojiPackInputRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoEmojiPackInputRequest: DtoEmojiPackInputRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiPackControllerCreate(
    dtoEmojiPackInputRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoEmojiPackInputRequest** | **DtoEmojiPackInputRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiPackControllerCreate200Response**

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

# **emojiPackControllerFindAll**
> EmojiPackControllerFindAll200Response emojiPackControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiPackControllerFindAll(
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

**EmojiPackControllerFindAll200Response**

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

# **emojiPackControllerFindOne**
> EmojiPackControllerFindOne200Response emojiPackControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //表情包 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiPackControllerFindOne(
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
| **id** | [**string**] | 表情包 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiPackControllerFindOne200Response**

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

# **emojiPackControllerRemove**
> DecorationControllerRemoveActivity200Response emojiPackControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiPackControllerRemove(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerRemoveActivity200Response**

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

# **emojiPackControllerRemoveEmoji**
> EmojiPackControllerRemoveEmoji200Response emojiPackControllerRemoveEmoji()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let emojiId: string; //emojiId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiPackControllerRemoveEmoji(
    id,
    emojiId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | id example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **emojiId** | [**string**] | emojiId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiPackControllerRemoveEmoji200Response**

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

# **emojiPackControllerUpdate**
> EmojiPackControllerCreate200Response emojiPackControllerUpdate(dtoEmojiPackInputRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoEmojiPackInputRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoEmojiPackInputRequest: DtoEmojiPackInputRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiPackControllerUpdate(
    id,
    dtoEmojiPackInputRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoEmojiPackInputRequest** | **DtoEmojiPackInputRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiPackControllerCreate200Response**

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

# **emojiPackControllerUpdateEmojiSort**
> EmojiPackControllerAddEmoji200Response emojiPackControllerUpdateEmojiSort(dtoEmojiPackUpdateEmojiRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoEmojiPackUpdateEmojiRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let emojiId: string; //emojiId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let dtoEmojiPackUpdateEmojiRequest: DtoEmojiPackUpdateEmojiRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiPackControllerUpdateEmojiSort(
    id,
    emojiId,
    dtoEmojiPackUpdateEmojiRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoEmojiPackUpdateEmojiRequest** | **DtoEmojiPackUpdateEmojiRequest**|  | |
| **id** | [**string**] | id example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **emojiId** | [**string**] | emojiId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiPackControllerAddEmoji200Response**

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

# **inviteControllerCreateInvite**
> InviteControllerCreateInvite200Response inviteControllerCreateInvite()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerCreateInvite(
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

**InviteControllerCreateInvite200Response**

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

# **inviteControllerGetInviteDetail**
> InviteControllerCreateInvite200Response inviteControllerGetInviteDetail()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //邀请码 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerGetInviteDetail(
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
| **id** | [**string**] | 邀请码 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**InviteControllerCreateInvite200Response**

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

# **inviteControllerGetInviteStats**
> InviteControllerGetMyInviteEarnings200Response inviteControllerGetInviteStats()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerGetInviteStats(
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

**InviteControllerGetMyInviteEarnings200Response**

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

# **inviteControllerGetMyInviteEarnings**
> InviteControllerGetMyInviteEarnings200Response inviteControllerGetMyInviteEarnings()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerGetMyInviteEarnings(
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

**InviteControllerGetMyInviteEarnings200Response**

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

# **inviteControllerGetMyInvites**
> InviteControllerGetMyInvites200Response inviteControllerGetMyInvites()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerGetMyInvites(
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

**InviteControllerGetMyInvites200Response**

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

# **inviteControllerUseInvite**
> InviteControllerCreateInvite200Response inviteControllerUseInvite(dtoUseInviteRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUseInviteRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoUseInviteRequest: DtoUseInviteRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerUseInvite(
    dtoUseInviteRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUseInviteRequest** | **DtoUseInviteRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**InviteControllerCreateInvite200Response**

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

# **messageControllerBatchOperation**
> MessageControllerCreate200Response messageControllerBatchOperation()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerBatchOperation(
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

**MessageControllerCreate200Response**

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

# **messageControllerBlockPrivateUser**
> MessageControllerBlockPrivateUser200Response messageControllerBlockPrivateUser()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //userId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerBlockPrivateUser(
    userId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | userId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerBlockPrivateUser200Response**

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

# **messageControllerCreate**
> MessageControllerCreate200Response messageControllerCreate(dtoCreateMessageRequest)

创建全员/部分/个人通知；管理员（message:manage）可指定接收范围

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateMessageRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateMessageRequest: DtoCreateMessageRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerCreate(
    dtoCreateMessageRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateMessageRequest** | **DtoCreateMessageRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerCreate200Response**

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
|**403** | Forbidden |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerFindAll**
> MessageControllerFindAll200Response messageControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let type: string; //消息类型，缺省=全部 (optional) (default to undefined)
let isRead: string; //是否已读，缺省=不筛选 example(false) (optional) (default to undefined)
let isBroadcast: string; //是否全员广播，缺省=不筛选 example(false) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerFindAll(
    page,
    limit,
    type,
    isRead,
    isBroadcast,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **type** | [**string**] | 消息类型，缺省&#x3D;全部 | (optional) defaults to undefined|
| **isRead** | [**string**] | 是否已读，缺省&#x3D;不筛选 example(false) | (optional) defaults to undefined|
| **isBroadcast** | [**string**] | 是否全员广播，缺省&#x3D;不筛选 example(false) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerFindAll200Response**

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

# **messageControllerFindOne**
> MessageControllerFindOne200Response messageControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerFindOne(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerFindOne200Response**

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

# **messageControllerGetBlockedUsers**
> MessageControllerGetBlockedUsers200Response messageControllerGetBlockedUsers()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerGetBlockedUsers(
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

**MessageControllerGetBlockedUsers200Response**

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

# **messageControllerGetPrivateConversation**
> MessageControllerGetPrivateConversation200Response messageControllerGetPrivateConversation()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //userId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let cursor: string; //游标（上一页最后一条的 cursor） example(eyJpZCI6IjlmMWQyZTM0In0) (optional) (default to undefined)
let limit: string; //每页条数，默认 20 example(20) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerGetPrivateConversation(
    userId,
    cursor,
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
| **userId** | [**string**] | userId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **cursor** | [**string**] | 游标（上一页最后一条的 cursor） example(eyJpZCI6IjlmMWQyZTM0In0) | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数，默认 20 example(20) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerGetPrivateConversation200Response**

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

# **messageControllerGetPrivateConversations**
> MessageControllerGetPrivateConversations200Response messageControllerGetPrivateConversations()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let cursor: string; //游标（上一页最后一条的 cursor） (optional) (default to undefined)
let limit: number; //每页条数，默认 20 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerGetPrivateConversations(
    cursor,
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
| **cursor** | [**string**] | 游标（上一页最后一条的 cursor） | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数，默认 20 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerGetPrivateConversations200Response**

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

# **messageControllerGetUnreadCount**
> MessageControllerGetUnreadCount200Response messageControllerGetUnreadCount()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerGetUnreadCount(
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

**MessageControllerGetUnreadCount200Response**

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

# **messageControllerMarkAllAsRead**
> MessageControllerCreate200Response messageControllerMarkAllAsRead()



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoMarkAllReadRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let type: string; //只标记该类型的消息，缺省=全部类型 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let dtoMarkAllReadRequest: DtoMarkAllReadRequest; // (optional)

const { status, data } = await apiInstance.messageControllerMarkAllAsRead(
    type,
    authorization,
    deviceId,
    deviceName,
    deviceType,
    dtoMarkAllReadRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoMarkAllReadRequest** | **DtoMarkAllReadRequest**|  | |
| **type** | [**string**] | 只标记该类型的消息，缺省&#x3D;全部类型 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerCreate200Response**

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

# **messageControllerMarkAsRead**
> AuthControllerSendSmsCode200Response messageControllerMarkAsRead()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerMarkAsRead(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AuthControllerSendSmsCode200Response**

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

# **messageControllerMarkPrivateConversationRead**
> MessageControllerMarkPrivateConversationRead200Response messageControllerMarkPrivateConversationRead()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //userId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerMarkPrivateConversationRead(
    userId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | userId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerMarkPrivateConversationRead200Response**

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

# **messageControllerMarkPrivateMessagesRead**
> MessageControllerMarkPrivateMessagesRead200Response messageControllerMarkPrivateMessagesRead()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerMarkPrivateMessagesRead(
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

**MessageControllerMarkPrivateMessagesRead200Response**

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

# **messageControllerRecallPrivateMessage**
> MessageControllerRecallPrivateMessage200Response messageControllerRecallPrivateMessage()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerRecallPrivateMessage(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerRecallPrivateMessage200Response**

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

# **messageControllerRemove**
> AuthControllerSendSmsCode200Response messageControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerRemove(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AuthControllerSendSmsCode200Response**

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

# **messageControllerSearch**
> MessageControllerFindAll200Response messageControllerSearch()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let type: string; //消息类型 (optional) (default to undefined)
let isRead: string; //是否已读 (optional) (default to undefined)
let isBroadcast: string; //是否全员广播 (optional) (default to undefined)
let keyword: string; //关键词（匹配正文/标题） example(活动) (optional) (default to undefined)
let senderId: string; //发送者用户 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) (optional) (default to undefined)
let receiverId: string; //接收者用户 ID example(1a2b3c4d-5678-4abc-9def-0123456789ab) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerSearch(
    page,
    limit,
    type,
    isRead,
    isBroadcast,
    keyword,
    senderId,
    receiverId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **type** | [**string**] | 消息类型 | (optional) defaults to undefined|
| **isRead** | [**string**] | 是否已读 | (optional) defaults to undefined|
| **isBroadcast** | [**string**] | 是否全员广播 | (optional) defaults to undefined|
| **keyword** | [**string**] | 关键词（匹配正文/标题） example(活动) | (optional) defaults to undefined|
| **senderId** | [**string**] | 发送者用户 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) | (optional) defaults to undefined|
| **receiverId** | [**string**] | 接收者用户 ID example(1a2b3c4d-5678-4abc-9def-0123456789ab) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerFindAll200Response**

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

# **messageControllerSendPrivateMessage**
> MessageControllerRecallPrivateMessage200Response messageControllerSendPrivateMessage(dtoSendPrivateRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoSendPrivateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //接收者用户 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let dtoSendPrivateRequest: DtoSendPrivateRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerSendPrivateMessage(
    userId,
    dtoSendPrivateRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoSendPrivateRequest** | **DtoSendPrivateRequest**|  | |
| **userId** | [**string**] | 接收者用户 ID example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerRecallPrivateMessage200Response**

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
|**403** | Forbidden |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerUnblockPrivateUser**
> MessageControllerBlockPrivateUser200Response messageControllerUnblockPrivateUser()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //userId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerUnblockPrivateUser(
    userId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | userId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerBlockPrivateUser200Response**

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

# **messageControllerUpdate**
> MessageControllerFindOne200Response messageControllerUpdate(dtoUpdateMessageRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateMessageRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoUpdateMessageRequest: DtoUpdateMessageRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerUpdate(
    id,
    dtoUpdateMessageRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateMessageRequest** | **DtoUpdateMessageRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerFindOne200Response**

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

# **oAuthBindingControllerLink**
> OAuthBindingControllerListBindings200Response oAuthBindingControllerLink(dtoOAuthLinkRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoOAuthLinkRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoOAuthLinkRequest: DtoOAuthLinkRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.oAuthBindingControllerLink(
    dtoOAuthLinkRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoOAuthLinkRequest** | **DtoOAuthLinkRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OAuthBindingControllerListBindings200Response**

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

# **oAuthBindingControllerListBindings**
> OAuthBindingControllerListBindings200Response oAuthBindingControllerListBindings()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.oAuthBindingControllerListBindings(
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

**OAuthBindingControllerListBindings200Response**

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

# **oAuthBindingControllerUnbind**
> OAuthBindingControllerListBindings200Response oAuthBindingControllerUnbind()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let provider: string; //平台 wechat / qq / github (default to undefined)
let channel: string; //渠道 web / app (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.oAuthBindingControllerUnbind(
    provider,
    channel,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **provider** | [**string**] | 平台 wechat / qq / github | defaults to undefined|
| **channel** | [**string**] | 渠道 web / app | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OAuthBindingControllerListBindings200Response**

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

# **orderControllerCancelOrder**
> OrderControllerFindByOrderNo200Response orderControllerCancelOrder()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerCancelOrder(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerFindByOrderNo200Response**

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

# **orderControllerCreateArticleOrder**
> OrderControllerFindByOrderNo200Response orderControllerCreateArticleOrder(dtoCreateArticleOrderRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateArticleOrderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateArticleOrderRequest: DtoCreateArticleOrderRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerCreateArticleOrder(
    dtoCreateArticleOrderRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateArticleOrderRequest** | **DtoCreateArticleOrderRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerFindByOrderNo200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerCreateMembershipOrder**
> OrderControllerFindByOrderNo200Response orderControllerCreateMembershipOrder(dtoCreateMembershipOrderRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateMembershipOrderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateMembershipOrderRequest: DtoCreateMembershipOrderRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerCreateMembershipOrder(
    dtoCreateMembershipOrderRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateMembershipOrderRequest** | **DtoCreateMembershipOrderRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerFindByOrderNo200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerFindByOrderNo**
> OrderControllerFindByOrderNo200Response orderControllerFindByOrderNo()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let orderNo: string; //orderNo example(PA20261127000001) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerFindByOrderNo(
    orderNo,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderNo** | [**string**] | orderNo example(PA20261127000001) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerFindByOrderNo200Response**

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

# **orderControllerFindOne**
> OrderControllerFindByOrderNo200Response orderControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //订单 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerFindOne(
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
| **id** | [**string**] | 订单 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerFindByOrderNo200Response**

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
|**404** | Not Found |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerGetAllOrders**
> OrderControllerGetAllOrders200Response orderControllerGetAllOrders()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let status: string; //订单状态 PENDING/PAID/CANCELLED/REFUNDED (optional) (default to undefined)
let type: string; //订单类型 MEMBERSHIP/PRODUCT/SERVICE/ARTICLE (optional) (default to undefined)
let userId: string; //买家用户 ID (optional) (default to undefined)
let keyword: string; //订单号模糊搜索 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerGetAllOrders(
    page,
    limit,
    status,
    type,
    userId,
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **status** | [**string**] | 订单状态 PENDING/PAID/CANCELLED/REFUNDED | (optional) defaults to undefined|
| **type** | [**string**] | 订单类型 MEMBERSHIP/PRODUCT/SERVICE/ARTICLE | (optional) defaults to undefined|
| **userId** | [**string**] | 买家用户 ID | (optional) defaults to undefined|
| **keyword** | [**string**] | 订单号模糊搜索 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerGetAllOrders200Response**

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

# **orderControllerGetPendingOrders**
> OrderControllerGetPendingOrders200Response orderControllerGetPendingOrders()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerGetPendingOrders(
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

**OrderControllerGetPendingOrders200Response**

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

# **orderControllerGetUserOrders**
> OrderControllerGetAllOrders200Response orderControllerGetUserOrders()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let status: string; //订单状态 PENDING/PAID/CANCELLED/REFUNDED (optional) (default to undefined)
let type: string; //订单类型 MEMBERSHIP/PRODUCT/SERVICE/ARTICLE (optional) (default to undefined)
let keyword: string; //订单号模糊搜索 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerGetUserOrders(
    page,
    limit,
    status,
    type,
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **status** | [**string**] | 订单状态 PENDING/PAID/CANCELLED/REFUNDED | (optional) defaults to undefined|
| **type** | [**string**] | 订单类型 MEMBERSHIP/PRODUCT/SERVICE/ARTICLE | (optional) defaults to undefined|
| **keyword** | [**string**] | 订单号模糊搜索 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerGetAllOrders200Response**

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

# **orderControllerGetWalletBalance**
> OrderControllerGetWalletBalance200Response orderControllerGetWalletBalance()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerGetWalletBalance(
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

**OrderControllerGetWalletBalance200Response**

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

# **orderControllerRequestRefund**
> OrderControllerFindByOrderNo200Response orderControllerRequestRefund()

余额支付原路退余额；第三方支付提交原路退款申请（均落 payment 记录）

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoOrderRefundRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //订单 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let dtoOrderRefundRequest: DtoOrderRefundRequest; // (optional)

const { status, data } = await apiInstance.orderControllerRequestRefund(
    id,
    authorization,
    deviceId,
    deviceName,
    deviceType,
    dtoOrderRefundRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoOrderRefundRequest** | **DtoOrderRefundRequest**|  | |
| **id** | [**string**] | 订单 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerFindByOrderNo200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerAlipayNotify**
> string paymentControllerAlipayNotify()

验签通过并完成订单状态机后返回文本 \"success\"，否则返回 \"failure: 原因\"

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerAlipayNotify(
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

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | success |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerCreatePayment**
> PaymentControllerCreatePayment200Response paymentControllerCreatePayment(dtoCreatePaymentRequest)

按渠道（alipay/wechat/epay/balance）生成支付参数；渠道开关与密钥来自系统配置表

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreatePaymentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreatePaymentRequest: DtoCreatePaymentRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerCreatePayment(
    dtoCreatePaymentRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreatePaymentRequest** | **DtoCreatePaymentRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PaymentControllerCreatePayment200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerEpayNotify**
> string paymentControllerEpayNotify()

MD5 排序验签（排除 sign/sign_type）后返回文本 \"success\"，否则 \"fail: 原因\"

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerEpayNotify(
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

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | success |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerEpaySignature**
> PaymentControllerEpaySignature200Response paymentControllerEpaySignature(dtoEpaySignatureRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoEpaySignatureRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoEpaySignatureRequest: DtoEpaySignatureRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerEpaySignature(
    dtoEpaySignatureRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoEpaySignatureRequest** | **DtoEpaySignatureRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PaymentControllerEpaySignature200Response**

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

# **paymentControllerFindPaymentByOrderId**
> PaymentControllerFindPaymentByOrderId200Response paymentControllerFindPaymentByOrderId()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let orderId: string; //orderId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerFindPaymentByOrderId(
    orderId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] | orderId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PaymentControllerFindPaymentByOrderId200Response**

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

# **paymentControllerFindPaymentRecord**
> PaymentControllerFindPaymentByOrderId200Response paymentControllerFindPaymentRecord()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerFindPaymentRecord(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PaymentControllerFindPaymentByOrderId200Response**

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

# **paymentControllerFindUserPayments**
> PaymentControllerFindUserPayments200Response paymentControllerFindUserPayments()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerFindUserPayments(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PaymentControllerFindUserPayments200Response**

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

# **paymentControllerWechatNotify**
> { [key: string]: string; } paymentControllerWechatNotify()

验签 + 解密后按微信 v3 规范返回 {\"code\":\"SUCCESS\"}；失败返 500 + {\"code\":\"FAIL\"}

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerWechatNotify(
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

**{ [key: string]: string; }**

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

# **permissionControllerCreate**
> PermissionControllerCreate200Response permissionControllerCreate(dtoPermissionRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoPermissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoPermissionRequest: DtoPermissionRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.permissionControllerCreate(
    dtoPermissionRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoPermissionRequest** | **DtoPermissionRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PermissionControllerCreate200Response**

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

# **permissionControllerFindAll**
> PermissionControllerFindAll200Response permissionControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.permissionControllerFindAll(
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

**PermissionControllerFindAll200Response**

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

# **permissionControllerFindOne**
> PermissionControllerCreate200Response permissionControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //权限 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.permissionControllerFindOne(
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
| **id** | [**string**] | 权限 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PermissionControllerCreate200Response**

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

# **permissionControllerGetTree**
> PermissionControllerGetTree200Response permissionControllerGetTree()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.permissionControllerGetTree(
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

**PermissionControllerGetTree200Response**

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

# **permissionControllerRemove**
> AuthControllerSendSmsCode200Response permissionControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //权限 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.permissionControllerRemove(
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
| **id** | [**string**] | 权限 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AuthControllerSendSmsCode200Response**

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

# **permissionControllerUpdate**
> PermissionControllerCreate200Response permissionControllerUpdate(dtoPermissionRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoPermissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //权限 ID (default to undefined)
let dtoPermissionRequest: DtoPermissionRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.permissionControllerUpdate(
    id,
    dtoPermissionRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoPermissionRequest** | **DtoPermissionRequest**|  | |
| **id** | [**string**] | 权限 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PermissionControllerCreate200Response**

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

# **pointsControllerAddPoints**
> PointsControllerSpendPoints200Response pointsControllerAddPoints(dtoAddPointsRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoAddPointsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoAddPointsRequest: DtoAddPointsRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerAddPoints(
    dtoAddPointsRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoAddPointsRequest** | **DtoAddPointsRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerSpendPoints200Response**

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

# **pointsControllerClaimTaskReward**
> PointsControllerClaimTaskReward200Response pointsControllerClaimTaskReward()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //活动 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerClaimTaskReward(
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
| **id** | [**string**] | 活动 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerClaimTaskReward200Response**

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

# **pointsControllerCreateActivity**
> PointsControllerCreateActivity200Response pointsControllerCreateActivity(dtoCreatePointsActivityRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreatePointsActivityRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreatePointsActivityRequest: DtoCreatePointsActivityRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerCreateActivity(
    dtoCreatePointsActivityRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreatePointsActivityRequest** | **DtoCreatePointsActivityRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerCreateActivity200Response**

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

# **pointsControllerFindAllActivities**
> PointsControllerFindAllActivities200Response pointsControllerFindAllActivities()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let type: string; //活动类型 INSTANT/DAILY/WEEKLY/MONTHLY/ONCE (optional) (default to undefined)
let keyword: string; //名称关键字 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerFindAllActivities(
    type,
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
| **type** | [**string**] | 活动类型 INSTANT/DAILY/WEEKLY/MONTHLY/ONCE | (optional) defaults to undefined|
| **keyword** | [**string**] | 名称关键字 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerFindAllActivities200Response**

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

# **pointsControllerFindOneActivity**
> PointsControllerCreateActivity200Response pointsControllerFindOneActivity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //活动 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerFindOneActivity(
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
| **id** | [**string**] | 活动 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerCreateActivity200Response**

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

# **pointsControllerGetAllTransactions**
> PointsControllerGetTransactions200Response pointsControllerGetAllTransactions()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetAllTransactions(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerGetTransactions200Response**

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

# **pointsControllerGetBalance**
> PointsControllerGetBalance200Response pointsControllerGetBalance()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetBalance(
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

**PointsControllerGetBalance200Response**

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

# **pointsControllerGetMyTaskProgress**
> PointsControllerGetMyTaskProgress200Response pointsControllerGetMyTaskProgress()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let activityId: string; //activityId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetMyTaskProgress(
    activityId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **activityId** | [**string**] | activityId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerGetMyTaskProgress200Response**

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

# **pointsControllerGetMyTasks**
> PointsControllerGetMyTasks200Response pointsControllerGetMyTasks()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetMyTasks(
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

**PointsControllerGetMyTasks200Response**

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

# **pointsControllerGetStatistics**
> PointsControllerGetStatistics200Response pointsControllerGetStatistics()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetStatistics(
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

**PointsControllerGetStatistics200Response**

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

# **pointsControllerGetTransactions**
> PointsControllerGetTransactions200Response pointsControllerGetTransactions()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetTransactions(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerGetTransactions200Response**

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

# **pointsControllerGetUserBalance**
> PointsControllerGetBalance200Response pointsControllerGetUserBalance()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //userId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetUserBalance(
    userId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | userId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerGetBalance200Response**

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

# **pointsControllerGetUserTransactions**
> PointsControllerGetTransactions200Response pointsControllerGetUserTransactions()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //userId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let page: string; //页码 example(1) (optional) (default to undefined)
let limit: string; //每页条数 example(10) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetUserTransactions(
    userId,
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
| **userId** | [**string**] | userId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **page** | [**string**] | 页码 example(1) | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 example(10) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerGetTransactions200Response**

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

# **pointsControllerRemoveActivity**
> PointsControllerRemoveActivity200Response pointsControllerRemoveActivity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerRemoveActivity(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerRemoveActivity200Response**

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

# **pointsControllerSpendPoints**
> PointsControllerSpendPoints200Response pointsControllerSpendPoints(dtoSpendPointsRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoSpendPointsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoSpendPointsRequest: DtoSpendPointsRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerSpendPoints(
    dtoSpendPointsRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoSpendPointsRequest** | **DtoSpendPointsRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerSpendPoints200Response**

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

# **pointsControllerUpdateActivity**
> PointsControllerCreateActivity200Response pointsControllerUpdateActivity(dtoUpdatePointsActivityRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdatePointsActivityRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoUpdatePointsActivityRequest: DtoUpdatePointsActivityRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerUpdateActivity(
    id,
    dtoUpdatePointsActivityRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdatePointsActivityRequest** | **DtoUpdatePointsActivityRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerCreateActivity200Response**

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

# **qqAppLoginControllerLogin**
> QqOAuthControllerWebCallback200Response qqAppLoginControllerLogin(dtoQqAppLoginRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoQqAppLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoQqAppLoginRequest: DtoQqAppLoginRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqAppLoginControllerLogin(
    dtoQqAppLoginRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoQqAppLoginRequest** | **DtoQqAppLoginRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqOAuthControllerWebCallback200Response**

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

# **qqOAuthControllerWebCallback**
> QqOAuthControllerWebCallback200Response qqOAuthControllerWebCallback(dtoOAuthCallbackRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoOAuthCallbackRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoOAuthCallbackRequest: DtoOAuthCallbackRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqOAuthControllerWebCallback(
    dtoOAuthCallbackRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoOAuthCallbackRequest** | **DtoOAuthCallbackRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqOAuthControllerWebCallback200Response**

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

# **qqOAuthControllerWebRedirect**
> QqOAuthControllerWebRedirect200Response qqOAuthControllerWebRedirect()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqOAuthControllerWebRedirect(
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

**QqOAuthControllerWebRedirect200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**302** | 重定向到前端，token 由 Location 的 query 携带（响应体为空，不是 JSON） |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qqOAuthControllerWebURL**
> UserControllerGetGithubOAuthUrl200Response qqOAuthControllerWebURL()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let did: string; //设备标识（可选；回调时用它签发 token —— OAuth 回调是浏览器 302，前端加不了 header，故必须从 query 或 state 传） (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.qqOAuthControllerWebURL(
    did,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **did** | [**string**] | 设备标识（可选；回调时用它签发 token —— OAuth 回调是浏览器 302，前端加不了 header，故必须从 query 或 state 传） | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetGithubOAuthUrl200Response**

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

# **reportControllerCreate**
> ReportControllerCreate200Response reportControllerCreate(dtoCreateReportRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateReportRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateReportRequest: DtoCreateReportRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.reportControllerCreate(
    dtoCreateReportRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateReportRequest** | **DtoCreateReportRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ReportControllerCreate200Response**

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

# **reportControllerFindAll**
> ReportControllerFindAll200Response reportControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.reportControllerFindAll(
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

**ReportControllerFindAll200Response**

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

# **reportControllerFindOne**
> ReportControllerCreate200Response reportControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //举报 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.reportControllerFindOne(
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
| **id** | [**string**] | 举报 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ReportControllerCreate200Response**

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

# **reportControllerGetStatistics**
> ReportControllerGetStatistics200Response reportControllerGetStatistics()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.reportControllerGetStatistics(
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

**ReportControllerGetStatistics200Response**

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

# **reportControllerRemove**
> AchievementControllerRemove200Response reportControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //举报 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.reportControllerRemove(
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
| **id** | [**string**] | 举报 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerRemove200Response**

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

# **reportControllerUpdate**
> ReportControllerCreate200Response reportControllerUpdate(dtoUpdateReportRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateReportRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //举报 ID (default to undefined)
let dtoUpdateReportRequest: DtoUpdateReportRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.reportControllerUpdate(
    id,
    dtoUpdateReportRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateReportRequest** | **DtoUpdateReportRequest**|  | |
| **id** | [**string**] | 举报 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ReportControllerCreate200Response**

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

# **roleControllerAssignPermissions**
> RoleControllerAssignPermissions200Response roleControllerAssignPermissions(dtoAssignPermissionsRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoAssignPermissionsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //角色 ID (default to undefined)
let dtoAssignPermissionsRequest: DtoAssignPermissionsRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerAssignPermissions(
    id,
    dtoAssignPermissionsRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoAssignPermissionsRequest** | **DtoAssignPermissionsRequest**|  | |
| **id** | [**string**] | 角色 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerAssignPermissions200Response**

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

# **roleControllerBindMenus**
> RoleControllerBindMenus200Response roleControllerBindMenus(dtoAssignMenusRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoAssignMenusRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //角色 ID (default to undefined)
let dtoAssignMenusRequest: DtoAssignMenusRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerBindMenus(
    id,
    dtoAssignMenusRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoAssignMenusRequest** | **DtoAssignMenusRequest**|  | |
| **id** | [**string**] | 角色 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerBindMenus200Response**

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

# **roleControllerCopyRole**
> RoleControllerCreate200Response roleControllerCopyRole()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //源角色 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerCopyRole(
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
| **id** | [**string**] | 源角色 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerCreate200Response**

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

# **roleControllerCreate**
> RoleControllerCreate200Response roleControllerCreate(dtoCreateRoleRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateRoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateRoleRequest: DtoCreateRoleRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerCreate(
    dtoCreateRoleRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateRoleRequest** | **DtoCreateRoleRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerCreate200Response**

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

# **roleControllerFindAll**
> RoleControllerFindAll200Response roleControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerFindAll(
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

**RoleControllerFindAll200Response**

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

# **roleControllerFindOne**
> RoleControllerFindOne200Response roleControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //角色 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerFindOne(
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
| **id** | [**string**] | 角色 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerFindOne200Response**

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

# **roleControllerFindWithPagination**
> RoleControllerFindWithPagination200Response roleControllerFindWithPagination()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let name: string; //角色名过滤 example(管理员) (optional) (default to undefined)
let isActive: string; //是否启用过滤（不传=不过滤） example(true) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerFindWithPagination(
    page,
    limit,
    name,
    isActive,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **name** | [**string**] | 角色名过滤 example(管理员) | (optional) defaults to undefined|
| **isActive** | [**string**] | 是否启用过滤（不传&#x3D;不过滤） example(true) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerFindWithPagination200Response**

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

# **roleControllerGetActiveRoles**
> RoleControllerFindAll200Response roleControllerGetActiveRoles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerGetActiveRoles(
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

**RoleControllerFindAll200Response**

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

# **roleControllerGetMenus**
> RoleControllerGetMenus200Response roleControllerGetMenus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //角色 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerGetMenus(
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
| **id** | [**string**] | 角色 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerGetMenus200Response**

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

# **roleControllerRemove**
> AuthControllerSendSmsCode200Response roleControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //角色 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerRemove(
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
| **id** | [**string**] | 角色 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AuthControllerSendSmsCode200Response**

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

# **roleControllerToggleStatus**
> RoleControllerToggleStatus200Response roleControllerToggleStatus(dtoToggleRoleStatusRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoToggleRoleStatusRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //角色 ID (default to undefined)
let dtoToggleRoleStatusRequest: DtoToggleRoleStatusRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerToggleStatus(
    id,
    dtoToggleRoleStatusRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoToggleRoleStatusRequest** | **DtoToggleRoleStatusRequest**|  | |
| **id** | [**string**] | 角色 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerToggleStatus200Response**

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

# **roleControllerUpdate**
> RoleControllerCreate200Response roleControllerUpdate(dtoUpdateRoleRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateRoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //角色 ID (default to undefined)
let dtoUpdateRoleRequest: DtoUpdateRoleRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerUpdate(
    id,
    dtoUpdateRoleRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateRoleRequest** | **DtoUpdateRoleRequest**|  | |
| **id** | [**string**] | 角色 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerCreate200Response**

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

# **searchControllerClearArticles**
> SearchControllerClearArticles200Response searchControllerClearArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.searchControllerClearArticles(
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

**SearchControllerClearArticles200Response**

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

# **searchControllerGetHotKeywords**
> SearchControllerGetHotKeywords200Response searchControllerGetHotKeywords()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.searchControllerGetHotKeywords(
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

**SearchControllerGetHotKeywords200Response**

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

# **searchControllerGetStatus**
> SearchControllerGetStatus200Response searchControllerGetStatus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.searchControllerGetStatus(
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

**SearchControllerGetStatus200Response**

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

# **searchControllerSearchArticles**
> SearchControllerSearchArticles200Response searchControllerSearchArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let keyword: string; //关键字 (optional) (default to undefined)
let categoryId: string; //分类 ID example(2b3c4d5e-0000-4f60-9bac-000000000002) (optional) (default to undefined)
let sortBy: string; //排序方式（默认 relevance）example(relevance) (optional) (default to undefined)
let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.searchControllerSearchArticles(
    keyword,
    categoryId,
    sortBy,
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
| **keyword** | [**string**] | 关键字 | (optional) defaults to undefined|
| **categoryId** | [**string**] | 分类 ID example(2b3c4d5e-0000-4f60-9bac-000000000002) | (optional) defaults to undefined|
| **sortBy** | [**string**] | 排序方式（默认 relevance）example(relevance) | (optional) defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**SearchControllerSearchArticles200Response**

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

# **searchControllerSearchTags**
> SearchControllerSearchTags200Response searchControllerSearchTags()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let keyword: string; //标签名关键字 example(风景) (optional) (default to undefined)
let page: string; //页码 example(1) (optional) (default to undefined)
let limit: string; //每页条数 example(10) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.searchControllerSearchTags(
    keyword,
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
| **keyword** | [**string**] | 标签名关键字 example(风景) | (optional) defaults to undefined|
| **page** | [**string**] | 页码 example(1) | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 example(10) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**SearchControllerSearchTags200Response**

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

# **searchControllerSearchUsers**
> SearchControllerSearchUsers200Response searchControllerSearchUsers()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let keyword: string; //用户名/昵称关键字 example(alice) (optional) (default to undefined)
let page: string; //页码 example(1) (optional) (default to undefined)
let limit: string; //每页条数 example(10) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.searchControllerSearchUsers(
    keyword,
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
| **keyword** | [**string**] | 用户名/昵称关键字 example(alice) | (optional) defaults to undefined|
| **page** | [**string**] | 页码 example(1) | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 example(10) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**SearchControllerSearchUsers200Response**

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

# **searchControllerSyncArticles**
> SearchControllerClearArticles200Response searchControllerSyncArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.searchControllerSyncArticles(
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

**SearchControllerClearArticles200Response**

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

# **statisticsControllerGetOverview**
> StatisticsControllerGetOverview200Response statisticsControllerGetOverview()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.statisticsControllerGetOverview(
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

**StatisticsControllerGetOverview200Response**

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

# **statisticsControllerGetTrends**
> StatisticsControllerGetTrends200Response statisticsControllerGetTrends()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let startDate: string; //起始日期 YYYY-MM-DD (optional) (default to undefined)
let endDate: string; //结束日期 YYYY-MM-DD (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.statisticsControllerGetTrends(
    startDate,
    endDate,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] | 起始日期 YYYY-MM-DD | (optional) defaults to undefined|
| **endDate** | [**string**] | 结束日期 YYYY-MM-DD | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**StatisticsControllerGetTrends200Response**

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

# **tagControllerCreate**
> TagControllerCreate200Response tagControllerCreate(dtoCreateTagRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateTagRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateTagRequest: DtoCreateTagRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerCreate(
    dtoCreateTagRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateTagRequest** | **DtoCreateTagRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**TagControllerCreate200Response**

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

# **tagControllerFindAll**
> SearchControllerSearchTags200Response tagControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: string; //页码 example(1) (optional) (default to undefined)
let limit: string; //每页条数 example(10) (optional) (default to undefined)
let keyword: string; //标签名关键字（推荐）example(风景) (optional) (default to undefined)
let name: string; //标签名关键字（旧名，keyword 为空时兜底）example(风景) (optional) (default to undefined)
let sortBy: string; //排序字段 example(article_count) (optional) (default to undefined)
let sortOrder: string; //排序方向（默认 DESC）example(DESC) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerFindAll(
    page,
    limit,
    keyword,
    name,
    sortBy,
    sortOrder,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**string**] | 页码 example(1) | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 example(10) | (optional) defaults to undefined|
| **keyword** | [**string**] | 标签名关键字（推荐）example(风景) | (optional) defaults to undefined|
| **name** | [**string**] | 标签名关键字（旧名，keyword 为空时兜底）example(风景) | (optional) defaults to undefined|
| **sortBy** | [**string**] | 排序字段 example(article_count) | (optional) defaults to undefined|
| **sortOrder** | [**string**] | 排序方向（默认 DESC）example(DESC) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**SearchControllerSearchTags200Response**

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

# **tagControllerFindOne**
> TagControllerCreate200Response tagControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //标签 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerFindOne(
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
| **id** | [**string**] | 标签 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**TagControllerCreate200Response**

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

# **tagControllerFollow**
> TagControllerFollow200Response tagControllerFollow()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //标签 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerFollow(
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
| **id** | [**string**] | 标签 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**TagControllerFollow200Response**

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

# **tagControllerGetFollowedTags**
> SearchControllerSearchTags200Response tagControllerGetFollowedTags()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: string; //页码 example(1) (optional) (default to undefined)
let limit: string; //每页条数 example(10) (optional) (default to undefined)
let userId: string; //目标用户 ID（缺省看自己）example(64b59ed4-1a2b-4c3d-8e9f-0123456789ab) (optional) (default to undefined)
let keyword: string; //标签名关键字（推荐）example(风景) (optional) (default to undefined)
let name: string; //标签名关键字（旧名，keyword 为空时兜底）example(风景) (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerGetFollowedTags(
    page,
    limit,
    userId,
    keyword,
    name,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**string**] | 页码 example(1) | (optional) defaults to undefined|
| **limit** | [**string**] | 每页条数 example(10) | (optional) defaults to undefined|
| **userId** | [**string**] | 目标用户 ID（缺省看自己）example(64b59ed4-1a2b-4c3d-8e9f-0123456789ab) | (optional) defaults to undefined|
| **keyword** | [**string**] | 标签名关键字（推荐）example(风景) | (optional) defaults to undefined|
| **name** | [**string**] | 标签名关键字（旧名，keyword 为空时兜底）example(风景) | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**SearchControllerSearchTags200Response**

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

# **tagControllerGetHotTags**
> TagControllerCreate200Response tagControllerGetHotTags()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerGetHotTags(
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

**TagControllerCreate200Response**

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

# **tagControllerGetRecommendedTags**
> TagControllerCreate200Response tagControllerGetRecommendedTags()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerGetRecommendedTags(
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

**TagControllerCreate200Response**

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

# **tagControllerRemove**
> AchievementControllerRemove200Response tagControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //标签 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerRemove(
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
| **id** | [**string**] | 标签 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerRemove200Response**

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

# **tagControllerUnfollow**
> TagControllerFollow200Response tagControllerUnfollow()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerUnfollow(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**TagControllerFollow200Response**

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

# **tagControllerUpdate**
> TagControllerCreate200Response tagControllerUpdate(dtoUpdateTagRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateTagRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //标签 ID (default to undefined)
let dtoUpdateTagRequest: DtoUpdateTagRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerUpdate(
    id,
    dtoUpdateTagRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateTagRequest** | **DtoUpdateTagRequest**|  | |
| **id** | [**string**] | 标签 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**TagControllerCreate200Response**

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

# **uploadControllerConfirmUpload**
> UploadControllerGetFileInfo200Response uploadControllerConfirmUpload(dtoConfirmUploadRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoConfirmUploadRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoConfirmUploadRequest: DtoConfirmUploadRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerConfirmUpload(
    dtoConfirmUploadRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoConfirmUploadRequest** | **DtoConfirmUploadRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UploadControllerGetFileInfo200Response**

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

# **uploadControllerFillMissingMetadata**
> UploadControllerFillMissingMetadata200Response uploadControllerFillMissingMetadata()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let limit: number; //单批处理条数，默认 100 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerFillMissingMetadata(
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
| **limit** | [**number**] | 单批处理条数，默认 100 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UploadControllerFillMissingMetadata200Response**

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

# **uploadControllerFindAll**
> UploadControllerFindAll200Response uploadControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerFindAll(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UploadControllerFindAll200Response**

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

# **uploadControllerGeneratePresignedUrl**
> UploadControllerGeneratePresignedUrl200Response uploadControllerGeneratePresignedUrl(dtoPresignRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoPresignRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoPresignRequest: DtoPresignRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerGeneratePresignedUrl(
    dtoPresignRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoPresignRequest** | **DtoPresignRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UploadControllerGeneratePresignedUrl200Response**

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

# **uploadControllerGetFileInfo**
> UploadControllerGetFileInfo200Response uploadControllerGetFileInfo()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //上传记录 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerGetFileInfo(
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
| **id** | [**string**] | 上传记录 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UploadControllerGetFileInfo200Response**

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

# **uploadControllerGetMigrationStats**
> UploadControllerGetMigrationStats200Response uploadControllerGetMigrationStats()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerGetMigrationStats(
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

**UploadControllerGetMigrationStats200Response**

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

# **uploadControllerGetUploadConfig**
> UploadControllerGetUploadConfig200Response uploadControllerGetUploadConfig()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerGetUploadConfig(
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

**UploadControllerGetUploadConfig200Response**

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

# **uploadControllerProcessUncompressedImages**
> UploadControllerProcessUncompressedImages200Response uploadControllerProcessUncompressedImages()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerProcessUncompressedImages(
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

**UploadControllerProcessUncompressedImages200Response**

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

# **uploadControllerRemove**
> DecorationControllerRemoveActivity200Response uploadControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //上传记录 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerRemove(
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
| **id** | [**string**] | 上传记录 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerRemoveActivity200Response**

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

# **uploadControllerUploadAvatar**
> UploadControllerUploadAvatar200Response uploadControllerUploadAvatar()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerUploadAvatar(
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

**UploadControllerUploadAvatar200Response**

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

# **uploadControllerUploadFile**
> UploadControllerUploadAvatar200Response uploadControllerUploadFile()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerUploadFile(
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

**UploadControllerUploadAvatar200Response**

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

# **userCertificationControllerFindMine**
> UserCertificationControllerFindMine200Response userCertificationControllerFindMine()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userCertificationControllerFindMine(
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

**UserCertificationControllerFindMine200Response**

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

# **userControllerApply**
> UserControllerGetMyCertification200Response userControllerApply(dtoApplyCertificationRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoApplyCertificationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoApplyCertificationRequest: DtoApplyCertificationRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerApply(
    dtoApplyCertificationRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoApplyCertificationRequest** | **DtoApplyCertificationRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetMyCertification200Response**

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

# **userControllerAudit**
> UserControllerGetMyCertification200Response userControllerAudit(dtoAuditCertificationRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoAuditCertificationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //申请 ID (default to undefined)
let dtoAuditCertificationRequest: DtoAuditCertificationRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerAudit(
    id,
    dtoAuditCertificationRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoAuditCertificationRequest** | **DtoAuditCertificationRequest**|  | |
| **id** | [**string**] | 申请 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetMyCertification200Response**

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

# **userControllerBatchCheckMembershipStatus**
> UserControllerBatchCheckMembershipStatus200Response userControllerBatchCheckMembershipStatus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerBatchCheckMembershipStatus(
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

**UserControllerBatchCheckMembershipStatus200Response**

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

# **userControllerCalculateCommission**
> UserControllerCalculateCommission200Response userControllerCalculateCommission()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerCalculateCommission(
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

**UserControllerCalculateCommission200Response**

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

# **userControllerCancelAccountDeletion**
> UserControllerGetDeletionStatus200Response userControllerCancelAccountDeletion()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerCancelAccountDeletion(
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

**UserControllerGetDeletionStatus200Response**

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

# **userControllerChangePassword**
> AuthControllerSendSmsCode200Response userControllerChangePassword()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerChangePassword(
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

**AuthControllerSendSmsCode200Response**

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

# **userControllerCheckMembershipStatus**
> UserControllerCheckMembershipStatus200Response userControllerCheckMembershipStatus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerCheckMembershipStatus(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCheckMembershipStatus200Response**

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

# **userControllerCreate**
> UserControllerCreate200Response userControllerCreate(dtoCreateUserRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoCreateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoCreateUserRequest: DtoCreateUserRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerCreate(
    dtoCreateUserRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoCreateUserRequest** | **DtoCreateUserRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCreate200Response**

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
|**403** | Forbidden |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindAll**
> UserControllerFindAll200Response userControllerFindAll()

分页查询用户，支持 keyword（或 username）模糊搜索

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码，默认 1 (optional) (default to undefined)
let limit: number; //每页条数，默认 10 (optional) (default to undefined)
let keyword: string; //用户名关键字 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerFindAll(
    page,
    limit,
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
| **page** | [**number**] | 页码，默认 1 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数，默认 10 | (optional) defaults to undefined|
| **keyword** | [**string**] | 用户名关键字 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerFindAll200Response**

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

# **userControllerFindApplications**
> UserControllerFindApplications200Response userControllerFindApplications()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let status: string; //申请状态 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerFindApplications(
    page,
    limit,
    status,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **status** | [**string**] | 申请状态 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerFindApplications200Response**

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

# **userControllerFindOne**
> UserControllerCreate200Response userControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //用户 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerFindOne(
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
| **id** | [**string**] | 用户 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCreate200Response**

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
|**404** | Not Found |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFollow**
> UserControllerFollow200Response userControllerFollow()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerFollow(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerFollow200Response**

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

# **userControllerGetDeletionStatus**
> UserControllerGetDeletionStatus200Response userControllerGetDeletionStatus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetDeletionStatus(
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

**UserControllerGetDeletionStatus200Response**

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

# **userControllerGetFollowerCount**
> UserControllerGetFollowerCount200Response userControllerGetFollowerCount()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetFollowerCount(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetFollowerCount200Response**

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

# **userControllerGetFollowers**
> UserControllerFindAll200Response userControllerGetFollowers()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetFollowers(
    id,
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
| **id** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerFindAll200Response**

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

# **userControllerGetFollowingCount**
> UserControllerGetFollowerCount200Response userControllerGetFollowingCount()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetFollowingCount(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetFollowerCount200Response**

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

# **userControllerGetFollowings**
> UserControllerFindAll200Response userControllerGetFollowings()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetFollowings(
    id,
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
| **id** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerFindAll200Response**

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

# **userControllerGetGithubOAuthUrl**
> UserControllerGetGithubOAuthUrl200Response userControllerGetGithubOAuthUrl()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let did: string; //设备标识（可选；回调时用它签发 token —— OAuth 回调是浏览器 302，前端加不了 header，故必须从 query 或 state 传） (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetGithubOAuthUrl(
    did,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **did** | [**string**] | 设备标识（可选；回调时用它签发 token —— OAuth 回调是浏览器 302，前端加不了 header，故必须从 query 或 state 传） | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetGithubOAuthUrl200Response**

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

# **userControllerGetIdentityByUserId**
> UserControllerGetMyIdentity200Response userControllerGetIdentityByUserId()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //userId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetIdentityByUserId(
    userId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | userId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetMyIdentity200Response**

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

# **userControllerGetMenus**
> UserControllerGetMenus200Response userControllerGetMenus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetMenus(
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

**UserControllerGetMenus200Response**

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

# **userControllerGetMyCertification**
> UserControllerGetMyCertification200Response userControllerGetMyCertification()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetMyCertification(
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

**UserControllerGetMyCertification200Response**

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

# **userControllerGetMyIdentity**
> UserControllerGetMyIdentity200Response userControllerGetMyIdentity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetMyIdentity(
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

**UserControllerGetMyIdentity200Response**

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

# **userControllerGetProfile**
> UserControllerGetProfile200Response userControllerGetProfile()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetProfile(
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

**UserControllerGetProfile200Response**

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
|**401** | Unauthorized |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerGetSignInRecords**
> UserControllerGetSignInRecords200Response userControllerGetSignInRecords()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetSignInRecords(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetSignInRecords200Response**

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

# **userControllerGetSignInStats**
> UserControllerGetSignInStats200Response userControllerGetSignInStats()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetSignInStats(
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

**UserControllerGetSignInStats200Response**

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

# **userControllerGetUserCommissionConfig**
> UserControllerGetUserCommissionConfig200Response userControllerGetUserCommissionConfig()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetUserCommissionConfig(
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

**UserControllerGetUserCommissionConfig200Response**

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

# **userControllerGetUserConfig**
> UserControllerGetUserConfig200Response userControllerGetUserConfig()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetUserConfig(
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

**UserControllerGetUserConfig200Response**

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

# **userControllerGetWalletBalance**
> UserControllerGetWalletBalance200Response userControllerGetWalletBalance()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetWalletBalance(
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

**UserControllerGetWalletBalance200Response**

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

# **userControllerGetWalletStatistics**
> UserControllerGetWalletStatistics200Response userControllerGetWalletStatistics()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetWalletStatistics(
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

**UserControllerGetWalletStatistics200Response**

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

# **userControllerGetWalletTransactions**
> UserControllerGetWalletTransactions200Response userControllerGetWalletTransactions()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetWalletTransactions(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetWalletTransactions200Response**

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

# **userControllerGithubOAuthCallback**
> QqOAuthControllerWebCallback200Response userControllerGithubOAuthCallback()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGithubOAuthCallback(
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

**QqOAuthControllerWebCallback200Response**

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

# **userControllerGithubOAuthRedirectCallback**
> QqOAuthControllerWebRedirect200Response userControllerGithubOAuthRedirectCallback()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGithubOAuthRedirectCallback(
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

**QqOAuthControllerWebRedirect200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**302** | 重定向到前端，token 由 Location 的 query 携带（响应体为空，不是 JSON） |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerLogin**
> QqOAuthControllerWebCallback200Response userControllerLogin(dtoLoginRequest)

账号（用户名或邮箱）+ 密码登录；Device-Id 头用于多端会话管理

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoLoginRequest: DtoLoginRequest; //
let deviceId: string; //设备标识，缺省 default (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerLogin(
    dtoLoginRequest,
    deviceId,
    authorization,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoLoginRequest** | **DtoLoginRequest**|  | |
| **deviceId** | [**string**] | 设备标识，缺省 default | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqOAuthControllerWebCallback200Response**

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
|**401** | Unauthorized |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerLogout**
> AuthControllerSendSmsCode200Response userControllerLogout()

删除当前设备会话并把当前 token 加入黑名单

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerLogout(
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

**AuthControllerSendSmsCode200Response**

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
|**401** | Unauthorized |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRefreshToken**
> UserControllerRefreshToken200Response userControllerRefreshToken(dtoRefreshTokenRequest)

用 refreshToken 换取新的 access token；需 Device-Id 头（服务端据此校验设备会话）

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoRefreshTokenRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let deviceId: string; //设备标识 (default to undefined)
let dtoRefreshTokenRequest: DtoRefreshTokenRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerRefreshToken(
    deviceId,
    dtoRefreshTokenRequest,
    authorization,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoRefreshTokenRequest** | **DtoRefreshTokenRequest**|  | |
| **deviceId** | [**string**] | 设备标识 | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerRefreshToken200Response**

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
|**401** | Unauthorized |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRegisterUser**
> QqOAuthControllerWebCallback200Response userControllerRegisterUser(dtoRegisterRequest)

用户名 + 密码注册，可选昵称/邮箱/手机号；返回用户信息

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoRegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let deviceId: string; //设备标识（与登录同口径，缺省 20016） (default to undefined)
let dtoRegisterRequest: DtoRegisterRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId2: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerRegisterUser(
    deviceId,
    dtoRegisterRequest,
    authorization,
    deviceId2,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoRegisterRequest** | **DtoRegisterRequest**|  | |
| **deviceId** | [**string**] | 设备标识（与登录同口径，缺省 20016） | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId2** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqOAuthControllerWebCallback200Response**

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
|**409** | Conflict |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRemove**
> AuthControllerSendSmsCode200Response userControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //用户 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerRemove(
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
| **id** | [**string**] | 用户 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AuthControllerSendSmsCode200Response**

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
|**403** | Forbidden |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRequestAccountDeletion**
> UserControllerRequestAccountDeletion200Response userControllerRequestAccountDeletion()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerRequestAccountDeletion(
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

**UserControllerRequestAccountDeletion200Response**

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

# **userControllerResetPassword**
> AuthControllerSendSmsCode200Response userControllerResetPassword()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerResetPassword(
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

**AuthControllerSendSmsCode200Response**

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

# **userControllerRevoke**
> UserControllerGetMyCertification200Response userControllerRevoke()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //申请 ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerRevoke(
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
| **id** | [**string**] | 申请 ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetMyCertification200Response**

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

# **userControllerSendVerificationCode**
> AuthControllerSendSmsCode200Response userControllerSendVerificationCode()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerSendVerificationCode(
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

**AuthControllerSendSmsCode200Response**

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

# **userControllerSetUserCommissionConfig**
> AuthControllerSendSmsCode200Response userControllerSetUserCommissionConfig()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerSetUserCommissionConfig(
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

**AuthControllerSendSmsCode200Response**

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

# **userControllerSignIn**
> UserControllerSignIn200Response userControllerSignIn()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerSignIn(
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

**UserControllerSignIn200Response**

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

# **userControllerUnfollow**
> UserControllerFollow200Response userControllerUnfollow()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUnfollow(
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
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerFollow200Response**

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

# **userControllerUpdate**
> UserControllerCreate200Response userControllerUpdate(dtoUpdateUserRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //id (default to undefined)
let dtoUpdateUserRequest: DtoUpdateUserRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdate(
    id,
    dtoUpdateUserRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateUserRequest** | **DtoUpdateUserRequest**|  | |
| **id** | [**string**] | id | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCreate200Response**

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

# **userControllerUpdateCommissionSettings**
> AuthControllerSendSmsCode200Response userControllerUpdateCommissionSettings(dtoUpdateUserConfigRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateUserConfigRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoUpdateUserConfigRequest: DtoUpdateUserConfigRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdateCommissionSettings(
    dtoUpdateUserConfigRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateUserConfigRequest** | **DtoUpdateUserConfigRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AuthControllerSendSmsCode200Response**

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

# **userControllerUpdateContact**
> UserControllerCreate200Response userControllerUpdateContact(dtoUpdateContactRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateContactRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoUpdateContactRequest: DtoUpdateContactRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdateContact(
    dtoUpdateContactRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateContactRequest** | **DtoUpdateContactRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCreate200Response**

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

# **userControllerUpdateNotificationSettings**
> AuthControllerSendSmsCode200Response userControllerUpdateNotificationSettings(dtoUpdateNotificationRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateNotificationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoUpdateNotificationRequest: DtoUpdateNotificationRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdateNotificationSettings(
    dtoUpdateNotificationRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateNotificationRequest** | **DtoUpdateNotificationRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AuthControllerSendSmsCode200Response**

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

# **userControllerUpdateProfile**
> UserControllerCreate200Response userControllerUpdateProfile(dtoUpdateProfileRequest)

昵称/头像/背景/简介等字段，请求体见 service.UpdateProfileInput

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateProfileRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoUpdateProfileRequest: DtoUpdateProfileRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdateProfile(
    dtoUpdateProfileRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateProfileRequest** | **DtoUpdateProfileRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCreate200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateUserConfig**
> AuthControllerSendSmsCode200Response userControllerUpdateUserConfig(dtoUpdateUserConfigRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoUpdateUserConfigRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoUpdateUserConfigRequest: DtoUpdateUserConfigRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdateUserConfig(
    dtoUpdateUserConfigRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoUpdateUserConfigRequest** | **DtoUpdateUserConfigRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AuthControllerSendSmsCode200Response**

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

# **userControllerWithdrawWallet**
> UserControllerWithdrawWallet200Response userControllerWithdrawWallet()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerWithdrawWallet(
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

**UserControllerWithdrawWallet200Response**

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

# **userProfileControllerBindPhone**
> UserProfileControllerBindPhone200Response userProfileControllerBindPhone()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userProfileControllerBindPhone(
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

**UserProfileControllerBindPhone200Response**

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

# **userProfileControllerFindFavoriteDetail**
> UserProfileControllerFindFavoriteDetail200Response userProfileControllerFindFavoriteDetail()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let productId: string; //productId example(9f1d2e34-5678-4abc-9def-0123456789ab) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userProfileControllerFindFavoriteDetail(
    productId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**string**] | productId example(9f1d2e34-5678-4abc-9def-0123456789ab) | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserProfileControllerFindFavoriteDetail200Response**

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

# **userProfileControllerFindFavorites**
> UserProfileControllerFindFavorites200Response userProfileControllerFindFavorites()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页条数 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userProfileControllerFindFavorites(
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
| **page** | [**number**] | 页码 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页条数 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserProfileControllerFindFavorites200Response**

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

# **userProfileControllerSendBindPhoneCode**
> AuthControllerSendSmsCode200Response userProfileControllerSendBindPhoneCode()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userProfileControllerSendBindPhoneCode(
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

**AuthControllerSendSmsCode200Response**

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

# **wechatOAuthControllerAppLogin**
> QqOAuthControllerWebCallback200Response wechatOAuthControllerAppLogin(dtoOAuthCodeRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoOAuthCodeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoOAuthCodeRequest: DtoOAuthCodeRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.wechatOAuthControllerAppLogin(
    dtoOAuthCodeRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoOAuthCodeRequest** | **DtoOAuthCodeRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqOAuthControllerWebCallback200Response**

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

# **wechatOAuthControllerWebCallback**
> QqOAuthControllerWebCallback200Response wechatOAuthControllerWebCallback(dtoOAuthCallbackRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DtoOAuthCallbackRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let dtoOAuthCallbackRequest: DtoOAuthCallbackRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.wechatOAuthControllerWebCallback(
    dtoOAuthCallbackRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dtoOAuthCallbackRequest** | **DtoOAuthCallbackRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**QqOAuthControllerWebCallback200Response**

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

# **wechatOAuthControllerWebRedirect**
> QqOAuthControllerWebRedirect200Response wechatOAuthControllerWebRedirect()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.wechatOAuthControllerWebRedirect(
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

**QqOAuthControllerWebRedirect200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**302** | 重定向到前端，token 由 Location 的 query 携带（响应体为空，不是 JSON） |  -  |
|**400** | Invalid request (10001) |  -  |
|**401** | Unauthorized (10002) |  -  |
|**403** | Permission denied (10003) |  -  |
|**404** | Resource not found (10004) |  -  |
|**409** | Resource conflict (10005) |  -  |
|**429** | Too many requests, please try again later (10006) |  -  |
|**500** | Internal server error (10007) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **wechatOAuthControllerWebURL**
> UserControllerGetGithubOAuthUrl200Response wechatOAuthControllerWebURL()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let did: string; //设备标识（可选；回调时用它签发 token —— OAuth 回调是浏览器 302，前端加不了 header，故必须从 query 或 state 传） (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.wechatOAuthControllerWebURL(
    did,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **did** | [**string**] | 设备标识（可选；回调时用它签发 token —— OAuth 回调是浏览器 302，前端加不了 header，故必须从 query 或 state 传） | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetGithubOAuthUrl200Response**

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


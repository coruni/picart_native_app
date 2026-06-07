# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**achievementControllerClaimAllRewards**](#achievementcontrollerclaimallrewards) | **POST** /achievement/claim-all | 一键领取所有成就奖励|
|[**achievementControllerClaimReward**](#achievementcontrollerclaimreward) | **POST** /achievement/{id}/claim | 领取成就奖励|
|[**achievementControllerCreate**](#achievementcontrollercreate) | **POST** /achievement | 创建成就（管理员）|
|[**achievementControllerFindAll**](#achievementcontrollerfindall) | **GET** /achievement | 获取成就列表|
|[**achievementControllerFindOne**](#achievementcontrollerfindone) | **GET** /achievement/{id} | 获取成就详情|
|[**achievementControllerGetUserStats**](#achievementcontrollergetuserstats) | **GET** /achievement/stats | 获取用户成就统计|
|[**achievementControllerRemove**](#achievementcontrollerremove) | **DELETE** /achievement/{id} | 删除成就（管理员）|
|[**achievementControllerUpdate**](#achievementcontrollerupdate) | **PATCH** /achievement/{id} | 更新成就（管理员）|
|[**articleControllerBatchDeleteBrowseHistory**](#articlecontrollerbatchdeletebrowsehistory) | **POST** /article/browse/batch-delete | 批量删除浏览记录|
|[**articleControllerCancelDislikeArticle**](#articlecontrollercanceldislikearticle) | **DELETE** /article/{id}/dislike | 取消不喜欢这类内容|
|[**articleControllerCheckFavoriteStatus**](#articlecontrollercheckfavoritestatus) | **GET** /article/{id}/favorite/status | 检查文章是否已收藏|
|[**articleControllerClearBrowseHistory**](#articlecontrollerclearbrowsehistory) | **DELETE** /article/browse | 清空浏览历史|
|[**articleControllerCreate**](#articlecontrollercreate) | **POST** /article | 创建文章|
|[**articleControllerDeleteBrowseHistory**](#articlecontrollerdeletebrowsehistory) | **DELETE** /article/browse/{articleId} | 删除单条浏览记录|
|[**articleControllerDislikeArticle**](#articlecontrollerdislikearticle) | **POST** /article/{id}/dislike | 标记不喜欢这类内容|
|[**articleControllerFavoriteArticle**](#articlecontrollerfavoritearticle) | **POST** /article/{id}/favorite | 收藏文章（添加到默认收藏夹）|
|[**articleControllerFindAll**](#articlecontrollerfindall) | **GET** /article | 获取文章列表|
|[**articleControllerFindByAuthor**](#articlecontrollerfindbyauthor) | **GET** /article/author/{id} | 根据作者获取文章列表|
|[**articleControllerFindHotSearch**](#articlecontrollerfindhotsearch) | **GET** /article/hot-search | 热门搜索|
|[**articleControllerFindOne**](#articlecontrollerfindone) | **GET** /article/{id} | 获取文章详情|
|[**articleControllerFindRecommendations**](#articlecontrollerfindrecommendations) | **GET** /article/recommend/{id} | 获取相关文章|
|[**articleControllerGetBrowseHistory**](#articlecontrollergetbrowsehistory) | **GET** /article/browse/{articleId} | 获取单条浏览记录|
|[**articleControllerGetBrowseStats**](#articlecontrollergetbrowsestats) | **GET** /article/browse/stats | 获取浏览统计|
|[**articleControllerGetDislikeStatus**](#articlecontrollergetdislikestatus) | **GET** /article/{id}/dislike/status | 获取不喜欢状态|
|[**articleControllerGetDrafts**](#articlecontrollergetdrafts) | **GET** /article/drafts | 获取当前用户的草稿文章列表|
|[**articleControllerGetFavoritedArticles**](#articlecontrollergetfavoritedarticles) | **GET** /article/favorited/list | 获取用户收藏的文章列表|
|[**articleControllerGetLikeCount**](#articlecontrollergetlikecount) | **GET** /article/{id}/like/count | 获取文章点赞数量|
|[**articleControllerGetLikeStatus**](#articlecontrollergetlikestatus) | **GET** /article/{id}/like/status | 获取文章点赞状态|
|[**articleControllerGetLikedArticles**](#articlecontrollergetlikedarticles) | **GET** /article/liked | 获取用户点赞文章列表|
|[**articleControllerGetPublishedArticleIds**](#articlecontrollergetpublishedarticleids) | **GET** /article/published/ids | 获取已发布文章ID列表|
|[**articleControllerGetRecentBrowsedArticles**](#articlecontrollergetrecentbrowsedarticles) | **GET** /article/browse/recent | 获取最近浏览的文章|
|[**articleControllerGetUserBrowseHistory**](#articlecontrollergetuserbrowsehistory) | **GET** /article/browse/history | 获取用户浏览历史列表|
|[**articleControllerLike**](#articlecontrollerlike) | **POST** /article/{id}/like | 点赞/表情回复文章|
|[**articleControllerRemove**](#articlecontrollerremove) | **DELETE** /article/{id} | 删除文章|
|[**articleControllerSearch**](#articlecontrollersearch) | **GET** /article/search | 搜索文章|
|[**articleControllerSetFeatured**](#articlecontrollersetfeatured) | **PATCH** /article/{id}/featured | 设置文章精华状态|
|[**articleControllerSetProfilePin**](#articlecontrollersetprofilepin) | **PATCH** /article/{id}/profile-pin | 设置文章个人主页置顶状态|
|[**articleControllerUnfavoriteArticle**](#articlecontrollerunfavoritearticle) | **DELETE** /article/{id}/favorite | 取消收藏文章|
|[**articleControllerUpdate**](#articlecontrollerupdate) | **PATCH** /article/{id} | 更新文章|
|[**articleControllerUpdateBrowseProgress**](#articlecontrollerupdatebrowseprogress) | **POST** /article/{id}/browse/progress | 更新文章浏览进度|
|[**bannerControllerCreate**](#bannercontrollercreate) | **POST** /banners | 创建轮播|
|[**bannerControllerFindActive**](#bannercontrollerfindactive) | **GET** /banners/active | 获取活动轮播|
|[**bannerControllerFindAll**](#bannercontrollerfindall) | **GET** /banners | 获取所有轮播|
|[**bannerControllerFindOne**](#bannercontrollerfindone) | **GET** /banners/{id} | 获取轮播详情|
|[**bannerControllerRemove**](#bannercontrollerremove) | **DELETE** /banners/{id} | 删除轮播|
|[**bannerControllerUpdate**](#bannercontrollerupdate) | **PATCH** /banners/{id} | 更新轮播|
|[**categoryControllerCreate**](#categorycontrollercreate) | **POST** /category | 创建分类|
|[**categoryControllerFindAll**](#categorycontrollerfindall) | **GET** /category | 获取所有分类|
|[**categoryControllerFindOne**](#categorycontrollerfindone) | **GET** /category/{id} | 获取分类详情|
|[**categoryControllerRemove**](#categorycontrollerremove) | **DELETE** /category/{id} | 删除分类|
|[**categoryControllerUpdate**](#categorycontrollerupdate) | **PATCH** /category/{id} | 更新分类|
|[**collectionControllerAddToCollection**](#collectioncontrolleraddtocollection) | **POST** /collection/{id}/article/{articleId} | 添加文章到合集|
|[**collectionControllerCheckArticleInCollections**](#collectioncontrollercheckarticleincollections) | **GET** /collection/check/{articleId} | 检查文章是否在合集中|
|[**collectionControllerCreate**](#collectioncontrollercreate) | **POST** /collection | 创建合集|
|[**collectionControllerFindAll**](#collectioncontrollerfindall) | **GET** /collection | 获取合集列表|
|[**collectionControllerFindOne**](#collectioncontrollerfindone) | **GET** /collection/{id} | 获取合集详情|
|[**collectionControllerGetArticleCollectionInfo**](#collectioncontrollergetarticlecollectioninfo) | **GET** /collection/article/{articleId}/info | 获取文章所在的合集信息|
|[**collectionControllerGetCollectionItems**](#collectioncontrollergetcollectionitems) | **GET** /collection/{id}/items | 获取合集中的文章列表|
|[**collectionControllerRemove**](#collectioncontrollerremove) | **DELETE** /collection/{id} | 删除合集|
|[**collectionControllerRemoveFromCollection**](#collectioncontrollerremovefromcollection) | **DELETE** /collection/{id}/article/{articleId} | 从合集移除文章|
|[**collectionControllerUpdate**](#collectioncontrollerupdate) | **PATCH** /collection/{id} | 更新合集|
|[**commentControllerCreate**](#commentcontrollercreate) | **POST** /comment | 创建评论|
|[**commentControllerFindAll**](#commentcontrollerfindall) | **GET** /comment/article/{id} | 获取文章评论列表|
|[**commentControllerFindAllComments**](#commentcontrollerfindallcomments) | **GET** /comment | 获取全部评论|
|[**commentControllerFindOne**](#commentcontrollerfindone) | **GET** /comment/{id} | 获取评论详情|
|[**commentControllerGetCommentCount**](#commentcontrollergetcommentcount) | **GET** /comment/article/{id}/count | 获取文章评论数量|
|[**commentControllerGetReplies**](#commentcontrollergetreplies) | **GET** /comment/{id}/replies | 获取评论回复列表（弃用）|
|[**commentControllerGetUserComments**](#commentcontrollergetusercomments) | **GET** /comment/user/{userId} | 获取用户评论列表|
|[**commentControllerLike**](#commentcontrollerlike) | **POST** /comment/{id}/like | 点赞评论|
|[**commentControllerRemove**](#commentcontrollerremove) | **DELETE** /comment/{id} | 删除评论|
|[**commentControllerSetPin**](#commentcontrollersetpin) | **PATCH** /comment/{id}/pin | 设置评论置顶状态|
|[**commentControllerUpdate**](#commentcontrollerupdate) | **PATCH** /comment/{id} | 更新评论|
|[**configControllerCreate**](#configcontrollercreate) | **POST** /config | 创建配置|
|[**configControllerFindAll**](#configcontrollerfindall) | **GET** /config | 获取所有配置|
|[**configControllerFindByGroup**](#configcontrollerfindbygroup) | **GET** /config/group/{group} | 根据分组获取配置|
|[**configControllerGetAdvertisementConfig**](#configcontrollergetadvertisementconfig) | **GET** /config/advertisement | 获取广告配置|
|[**configControllerGetPublicConfigs**](#configcontrollergetpublicconfigs) | **GET** /config/public | 获取所有公共配置|
|[**configControllerRemove**](#configcontrollerremove) | **DELETE** /config/{id} | 删除配置|
|[**configControllerUpdate**](#configcontrollerupdate) | **PATCH** /config/{id} | 更新配置|
|[**configControllerUpdateAll**](#configcontrollerupdateall) | **PATCH** /config | 更新所有配置|
|[**configControllerUpdateByKey**](#configcontrollerupdatebykey) | **PATCH** /config/key/{key} | 根据键更新配置|
|[**configControllerUpdateGroup**](#configcontrollerupdategroup) | **PATCH** /config/group/{group} | 更新分组配置|
|[**contentAuditControllerAuditImage**](#contentauditcontrollerauditimage) | **POST** /content-audit/image | 测试图片审核|
|[**contentAuditControllerAuditText**](#contentauditcontrolleraudittext) | **POST** /content-audit/text | 测试文本审核|
|[**contentAuditControllerGetConfig**](#contentauditcontrollergetconfig) | **GET** /content-audit/config | 获取审核配置|
|[**contentAuditControllerGetPendingArticles**](#contentauditcontrollergetpendingarticles) | **GET** /content-audit/pending-articles | 获取待审核文章列表|
|[**contentAuditControllerReloadConfig**](#contentauditcontrollerreloadconfig) | **POST** /content-audit/config/reload | 重新加载审核配置|
|[**contentAuditControllerReviewArticle**](#contentauditcontrollerreviewarticle) | **POST** /content-audit/articles/{id}/review | 审核文章|
|[**decorationControllerClaimActivityReward**](#decorationcontrollerclaimactivityreward) | **POST** /decoration/activity/claim/{activityId} | 领取活动奖励|
|[**decorationControllerCleanExpired**](#decorationcontrollercleanexpired) | **POST** /decoration/clean-expired | 清理过期装饰品|
|[**decorationControllerCreate**](#decorationcontrollercreate) | **POST** /decoration | 创建装饰品|
|[**decorationControllerCreateActivity**](#decorationcontrollercreateactivity) | **POST** /decoration/activity | 创建活动|
|[**decorationControllerFindAll**](#decorationcontrollerfindall) | **GET** /decoration | 获取装饰品列表|
|[**decorationControllerFindAllActivities**](#decorationcontrollerfindallactivities) | **GET** /decoration/activity | 获取活动列表|
|[**decorationControllerFindOne**](#decorationcontrollerfindone) | **GET** /decoration/{id} | 获取装饰品详情|
|[**decorationControllerFindOneActivity**](#decorationcontrollerfindoneactivity) | **GET** /decoration/activity/{id} | 获取活动详情|
|[**decorationControllerGetCurrentDecorations**](#decorationcontrollergetcurrentdecorations) | **GET** /decoration/user/current/decorations | 获取当前使用的装饰品|
|[**decorationControllerGetMyAchievementBadges**](#decorationcontrollergetmyachievementbadges) | **GET** /decoration/achievement-badges/my | 获取我的成就勋章|
|[**decorationControllerGetMyActivityProgress**](#decorationcontrollergetmyactivityprogress) | **GET** /decoration/activity/progress/my | 获取我的活动进度|
|[**decorationControllerGetMyDecorations**](#decorationcontrollergetmydecorations) | **GET** /decoration/user/my | 获取我的装饰品|
|[**decorationControllerGetUserDecorations**](#decorationcontrollergetuserdecorations) | **GET** /decoration/user/{userId} | 获取用户的装饰品|
|[**decorationControllerGift**](#decorationcontrollergift) | **POST** /decoration/gift | 赠送装饰品|
|[**decorationControllerPurchase**](#decorationcontrollerpurchase) | **POST** /decoration/purchase | 购买装饰品|
|[**decorationControllerRemove**](#decorationcontrollerremove) | **DELETE** /decoration/{id} | 删除装饰品|
|[**decorationControllerRemoveActivity**](#decorationcontrollerremoveactivity) | **DELETE** /decoration/activity/{id} | 删除活动|
|[**decorationControllerUnuseDecoration**](#decorationcontrollerunusedecoration) | **POST** /decoration/unuse/{decorationId} | 取消使用装饰品|
|[**decorationControllerUpdate**](#decorationcontrollerupdate) | **PATCH** /decoration/{id} | 更新装饰品|
|[**decorationControllerUpdateActivity**](#decorationcontrollerupdateactivity) | **PATCH** /decoration/activity/{id} | 更新活动|
|[**decorationControllerUseDecoration**](#decorationcontrollerusedecoration) | **POST** /decoration/use/{decorationId} | 使用装饰品|
|[**emojiControllerAddToFavorites**](#emojicontrolleraddtofavorites) | **POST** /emoji/{id}/favorite | 添加到收藏|
|[**emojiControllerCreate**](#emojicontrollercreate) | **POST** /emoji | 创建表情|
|[**emojiControllerFindAll**](#emojicontrollerfindall) | **GET** /emoji | 获取表情列表|
|[**emojiControllerFindOne**](#emojicontrollerfindone) | **GET** /emoji/{id} | 获取单个表情|
|[**emojiControllerGetCategories**](#emojicontrollergetcategories) | **GET** /emoji/categories/list | 获取表情分类列表|
|[**emojiControllerGetFavorites**](#emojicontrollergetfavorites) | **GET** /emoji/favorites/list | 获取我的收藏|
|[**emojiControllerGetPopular**](#emojicontrollergetpopular) | **GET** /emoji/popular/list | 获取热门表情|
|[**emojiControllerGetRecent**](#emojicontrollergetrecent) | **GET** /emoji/recent/list | 获取最近添加的表情|
|[**emojiControllerIncrementUseCount**](#emojicontrollerincrementusecount) | **POST** /emoji/{id}/use | 增加使用次数|
|[**emojiControllerRemove**](#emojicontrollerremove) | **DELETE** /emoji/{id} | 删除表情|
|[**emojiControllerRemoveFromFavorites**](#emojicontrollerremovefromfavorites) | **DELETE** /emoji/{id}/favorite | 取消收藏|
|[**emojiControllerUpdate**](#emojicontrollerupdate) | **PATCH** /emoji/{id} | 更新表情|
|[**emojiControllerUpload**](#emojicontrollerupload) | **POST** /emoji/upload | 上传表情图片|
|[**inviteControllerCreateInvite**](#invitecontrollercreateinvite) | **POST** /invite | 创建邀请码|
|[**inviteControllerGetInviteDetail**](#invitecontrollergetinvitedetail) | **GET** /invite/{id} | 获取邀请详情|
|[**inviteControllerGetInviteStats**](#invitecontrollergetinvitestats) | **GET** /invite/stats | 获取邀请统计信息|
|[**inviteControllerGetMyInviteEarnings**](#invitecontrollergetmyinviteearnings) | **GET** /invite/earnings | 获取邀请收益记录|
|[**inviteControllerGetMyInvites**](#invitecontrollergetmyinvites) | **GET** /invite/my | 获取我的邀请列表|
|[**inviteControllerUseInvite**](#invitecontrolleruseinvite) | **POST** /invite/use | 使用邀请码|
|[**messageControllerBatchOperation**](#messagecontrollerbatchoperation) | **POST** /message/batch | 批量操作消息（标记已读/删除）|
|[**messageControllerBlockPrivateUser**](#messagecontrollerblockprivateuser) | **POST** /message/private/block/{userId} | 拉黑私信对象|
|[**messageControllerCreate**](#messagecontrollercreate) | **POST** /message | 创建消息（支持全员、部分、个人通知）|
|[**messageControllerFindAll**](#messagecontrollerfindall) | **GET** /message | 获取当前用户所有消息（含全员通知）|
|[**messageControllerFindOne**](#messagecontrollerfindone) | **GET** /message/{id} | 获取单条消息|
|[**messageControllerGetBlockedUsers**](#messagecontrollergetblockedusers) | **GET** /message/private/blocks | 获取拉黑列表|
|[**messageControllerGetPrivateConversation**](#messagecontrollergetprivateconversation) | **GET** /message/private/conversations/{userId}/messages | 获取与指定用户的私信记录|
|[**messageControllerGetPrivateConversations**](#messagecontrollergetprivateconversations) | **GET** /message/private/conversations | 获取当前用户的私信会话列表|
|[**messageControllerGetUnreadCount**](#messagecontrollergetunreadcount) | **GET** /message/unread/count | 获取未读消息数量|
|[**messageControllerMarkAllAsRead**](#messagecontrollermarkallasread) | **POST** /message/read-all | 标记所有消息为已读|
|[**messageControllerMarkAsRead**](#messagecontrollermarkasread) | **POST** /message/{id}/read | 标记消息为已读|
|[**messageControllerMarkPrivateMessagesRead**](#messagecontrollermarkprivatemessagesread) | **POST** /message/private/read-batch | 批量标记私信已读|
|[**messageControllerRecallPrivateMessage**](#messagecontrollerrecallprivatemessage) | **POST** /message/private/recall/{id} | 撤回私信|
|[**messageControllerRemove**](#messagecontrollerremove) | **DELETE** /message/{id} | 删除消息|
|[**messageControllerSearch**](#messagecontrollersearch) | **GET** /message/search | 高级查询消息|
|[**messageControllerSendPrivateMessage**](#messagecontrollersendprivatemessage) | **POST** /message/private/{userId} | 发送私信|
|[**messageControllerUnblockPrivateUser**](#messagecontrollerunblockprivateuser) | **DELETE** /message/private/block/{userId} | 取消拉黑私信对象|
|[**messageControllerUpdate**](#messagecontrollerupdate) | **PATCH** /message/{id} | 更新消息内容|
|[**orderControllerCancelOrder**](#ordercontrollercancelorder) | **PUT** /order/{id}/cancel | 取消订单|
|[**orderControllerCreateArticleOrder**](#ordercontrollercreatearticleorder) | **POST** /order/article | 创建文章订单|
|[**orderControllerCreateMembershipOrder**](#ordercontrollercreatemembershiporder) | **POST** /order/membership | 创建会员充值订单|
|[**orderControllerFindByOrderNo**](#ordercontrollerfindbyorderno) | **GET** /order/no/{orderNo} | 根据订单号获取订单|
|[**orderControllerFindOne**](#ordercontrollerfindone) | **GET** /order/{id} | 获取订单详情|
|[**orderControllerGetAllOrders**](#ordercontrollergetallorders) | **GET** /order | 获取所有订单列表（管理员权限）|
|[**orderControllerGetPendingOrders**](#ordercontrollergetpendingorders) | **GET** /order/pending | 获取待支付订单|
|[**orderControllerGetUserOrders**](#ordercontrollergetuserorders) | **GET** /order/user | 获取用户订单列表|
|[**orderControllerGetWalletBalance**](#ordercontrollergetwalletbalance) | **GET** /order/wallet/balance | 获取钱包余额|
|[**orderControllerRequestRefund**](#ordercontrollerrequestrefund) | **POST** /order/{id}/refund | 申请退款|
|[**paymentControllerAlipayNotify**](#paymentcontrolleralipaynotify) | **POST** /payment/notify/alipay | 支付宝支付回调|
|[**paymentControllerCreatePayment**](#paymentcontrollercreatepayment) | **POST** /payment/create | 创建支付|
|[**paymentControllerEpayNotify**](#paymentcontrollerepaynotify) | **GET** /payment/notify/epay | 易支付支付回调|
|[**paymentControllerFindPaymentByOrderId**](#paymentcontrollerfindpaymentbyorderid) | **GET** /payment/order/{orderId} | 查询订单支付记录|
|[**paymentControllerFindPaymentRecord**](#paymentcontrollerfindpaymentrecord) | **GET** /payment/record/{id} | 查询支付记录|
|[**paymentControllerFindUserPayments**](#paymentcontrollerfinduserpayments) | **GET** /payment/user | 查询用户支付记录|
|[**paymentControllerTestEpaySignature**](#paymentcontrollertestepaysignature) | **POST** /payment/test/epay-signature | 测试易支付签名计算|
|[**paymentControllerWechatNotify**](#paymentcontrollerwechatnotify) | **POST** /payment/notify/wechat | 微信支付回调|
|[**permissionControllerCreate**](#permissioncontrollercreate) | **POST** /permission | 创建权限|
|[**permissionControllerFindAll**](#permissioncontrollerfindall) | **GET** /permission | 获取所有权限|
|[**permissionControllerFindOne**](#permissioncontrollerfindone) | **GET** /permission/{id} | 根据ID获取权限|
|[**permissionControllerRemove**](#permissioncontrollerremove) | **DELETE** /permission/{id} | 删除权限|
|[**permissionControllerUpdate**](#permissioncontrollerupdate) | **PATCH** /permission/{id} | 更新权限|
|[**pointsControllerAddPoints**](#pointscontrolleraddpoints) | **POST** /points/add | 增加积分|
|[**pointsControllerClaimTaskReward**](#pointscontrollerclaimtaskreward) | **POST** /points/activities/{id}/claim | 领取任务奖励|
|[**pointsControllerCreateActivity**](#pointscontrollercreateactivity) | **POST** /points/activities | 创建积分活动|
|[**pointsControllerFindAllActivities**](#pointscontrollerfindallactivities) | **GET** /points/activities | 获取积分活动列表|
|[**pointsControllerFindOneActivity**](#pointscontrollerfindoneactivity) | **GET** /points/activities/{id} | 获取积分活动详情|
|[**pointsControllerGetAllTransactions**](#pointscontrollergetalltransactions) | **GET** /points/transactions/all | 获取所有用户的积分交易记录（管理员）|
|[**pointsControllerGetBalance**](#pointscontrollergetbalance) | **GET** /points/balance | 获取积分余额|
|[**pointsControllerGetMyTaskProgress**](#pointscontrollergetmytaskprogress) | **GET** /points/tasks/my/{activityId} | 获取指定活动的任务进度|
|[**pointsControllerGetMyTasks**](#pointscontrollergetmytasks) | **GET** /points/tasks/my | 获取我的任务记录|
|[**pointsControllerGetStatistics**](#pointscontrollergetstatistics) | **GET** /points/statistics | 获取积分系统统计数据（管理员）|
|[**pointsControllerGetTransactions**](#pointscontrollergettransactions) | **GET** /points/transactions | 获取积分交易记录|
|[**pointsControllerGetUserBalance**](#pointscontrollergetuserbalance) | **GET** /points/users/{userId}/balance | 获取指定用户的积分余额（管理员）|
|[**pointsControllerGetUserTransactions**](#pointscontrollergetusertransactions) | **GET** /points/users/{userId}/transactions | 获取指定用户的积分交易记录（管理员）|
|[**pointsControllerRemoveActivity**](#pointscontrollerremoveactivity) | **DELETE** /points/activities/{id} | 删除积分活动|
|[**pointsControllerSpendPoints**](#pointscontrollerspendpoints) | **POST** /points/spend | 消费积分|
|[**pointsControllerUpdateActivity**](#pointscontrollerupdateactivity) | **PATCH** /points/activities/{id} | 更新积分活动|
|[**reportControllerCreate**](#reportcontrollercreate) | **POST** /report | 创建举报|
|[**reportControllerFindAll**](#reportcontrollerfindall) | **GET** /report | 获取举报列表|
|[**reportControllerFindOne**](#reportcontrollerfindone) | **GET** /report/{id} | 获取举报详情|
|[**reportControllerGetStatistics**](#reportcontrollergetstatistics) | **GET** /report/statistics | 获取举报统计|
|[**reportControllerRemove**](#reportcontrollerremove) | **DELETE** /report/{id} | 删除举报记录|
|[**reportControllerUpdate**](#reportcontrollerupdate) | **PATCH** /report/{id} | 更新举报状态|
|[**roleControllerAssignPermissions**](#rolecontrollerassignpermissions) | **POST** /role/{id}/permissions | 为角色分配权限|
|[**roleControllerCopyRole**](#rolecontrollercopyrole) | **POST** /role/{id}/copy | 复制角色|
|[**roleControllerCreate**](#rolecontrollercreate) | **POST** /role | 创建角色|
|[**roleControllerFindAll**](#rolecontrollerfindall) | **GET** /role | 获取所有角色|
|[**roleControllerFindOne**](#rolecontrollerfindone) | **GET** /role/{id} | 根据ID获取角色|
|[**roleControllerFindWithPagination**](#rolecontrollerfindwithpagination) | **GET** /role/list | 分页获取角色列表|
|[**roleControllerGetActiveRoles**](#rolecontrollergetactiveroles) | **GET** /role/active | 获取活跃角色列表|
|[**roleControllerRemove**](#rolecontrollerremove) | **DELETE** /role/{id} | 删除角色|
|[**roleControllerToggleStatus**](#rolecontrollertogglestatus) | **PATCH** /role/{id}/status | 启用/禁用角色|
|[**roleControllerUpdate**](#rolecontrollerupdate) | **PATCH** /role/{id} | 更新角色|
|[**searchControllerClearArticles**](#searchcontrollercleararticles) | **POST** /search/clear/articles | 清空文章搜索索引|
|[**searchControllerGetStatus**](#searchcontrollergetstatus) | **GET** /search/status | 获取 Elasticsearch 状态|
|[**searchControllerSyncArticles**](#searchcontrollersyncarticles) | **POST** /search/sync/articles | 同步文章到 Elasticsearch（全量同步）|
|[**statisticsControllerGetOverview**](#statisticscontrollergetoverview) | **GET** /statistics/overview | 获取后台统计概览|
|[**statisticsControllerGetTrends**](#statisticscontrollergettrends) | **GET** /statistics/trends | 获取最近趋势统计|
|[**tagControllerCreate**](#tagcontrollercreate) | **POST** /tag | 创建标签|
|[**tagControllerFindAll**](#tagcontrollerfindall) | **GET** /tag | 获取所有标签|
|[**tagControllerFindOne**](#tagcontrollerfindone) | **GET** /tag/{id} | 获取标签详情|
|[**tagControllerFollow**](#tagcontrollerfollow) | **POST** /tag/{id}/follow | 关注标签|
|[**tagControllerFollowedList**](#tagcontrollerfollowedlist) | **GET** /tag/followed/list |  关注的标签|
|[**tagControllerRemove**](#tagcontrollerremove) | **DELETE** /tag/{id} | 删除标签|
|[**tagControllerUnfollow**](#tagcontrollerunfollow) | **DELETE** /tag/{id}/follow | 取消关注标签|
|[**tagControllerUpdate**](#tagcontrollerupdate) | **PATCH** /tag/{id} | 更新标签|
|[**uploadControllerFindAll**](#uploadcontrollerfindall) | **GET** /upload | 获取所有上传文件|
|[**uploadControllerGetFileInfo**](#uploadcontrollergetfileinfo) | **GET** /upload/info/{id} | 获取文件信息|
|[**uploadControllerGetUploadConfig**](#uploadcontrollergetuploadconfig) | **GET** /upload/config | 上传配置|
|[**uploadControllerRemove**](#uploadcontrollerremove) | **DELETE** /upload/{id} | 删除文件|
|[**uploadControllerUploadFile**](#uploadcontrolleruploadfile) | **POST** /upload/file | 上传文件|
|[**userControllerBatchCheckMembershipStatus**](#usercontrollerbatchcheckmembershipstatus) | **POST** /user/membership/batch-check | 批量检查并更新所有用户的会员状态|
|[**userControllerCalculateCommission**](#usercontrollercalculatecommission) | **POST** /user/commission/calculate | 计算抽成金额|
|[**userControllerChangePassword**](#usercontrollerchangepassword) | **POST** /user/password/change | 修改密码（需要原密码）|
|[**userControllerCheckMembershipStatus**](#usercontrollercheckmembershipstatus) | **GET** /user/{id}/membership/check | 检查并更新用户会员状态|
|[**userControllerCreate**](#usercontrollercreate) | **POST** /user | 创建用户|
|[**userControllerFindAll**](#usercontrollerfindall) | **GET** /user | 获取用户列表|
|[**userControllerFindOne**](#usercontrollerfindone) | **GET** /user/{id} | 获取用户详情|
|[**userControllerFollow**](#usercontrollerfollow) | **POST** /user/{id}/follow | 关注用户|
|[**userControllerGetFollowerCount**](#usercontrollergetfollowercount) | **GET** /user/{id}/followers/count | 获取粉丝数量|
|[**userControllerGetFollowers**](#usercontrollergetfollowers) | **GET** /user/{id}/followers | 获取粉丝列表|
|[**userControllerGetFollowingCount**](#usercontrollergetfollowingcount) | **GET** /user/{id}/followings/count | 获取关注数量|
|[**userControllerGetFollowings**](#usercontrollergetfollowings) | **GET** /user/{id}/followings | 获取关注列表|
|[**userControllerGetProfile**](#usercontrollergetprofile) | **GET** /user/profile | 获取当前用户信息|
|[**userControllerGetSignInRecords**](#usercontrollergetsigninrecords) | **GET** /user/sign-in/records | 获取签到记录|
|[**userControllerGetSignInStats**](#usercontrollergetsigninstats) | **GET** /user/sign-in/stats | 获取签到统计|
|[**userControllerGetUserCommissionConfig**](#usercontrollergetusercommissionconfig) | **GET** /user/commission/config | 获取当前用户抽成配置|
|[**userControllerGetUserConfig**](#usercontrollergetuserconfig) | **GET** /user/config | 获取当前用户配置|
|[**userControllerGetWalletBalance**](#usercontrollergetwalletbalance) | **GET** /user/wallet/balance | 获取钱包余额|
|[**userControllerGetWalletStatistics**](#usercontrollergetwalletstatistics) | **GET** /user/wallet/statistics | 获取钱包统计信息|
|[**userControllerGetWalletTransactions**](#usercontrollergetwallettransactions) | **GET** /user/wallet/transactions | 获取钱包交易记录|
|[**userControllerLogin**](#usercontrollerlogin) | **POST** /user/login | 用户登录（支持用户名或邮箱）|
|[**userControllerLogout**](#usercontrollerlogout) | **POST** /user/logout | 退出登录（单设备）|
|[**userControllerRefreshToken**](#usercontrollerrefreshtoken) | **POST** /user/refresh-token | 刷新 access token|
|[**userControllerRegisterUser**](#usercontrollerregisteruser) | **POST** /user/register | 用户注册|
|[**userControllerRemove**](#usercontrollerremove) | **DELETE** /user/{id} | 删除用户|
|[**userControllerResetPassword**](#usercontrollerresetpassword) | **POST** /user/password/reset | 重置密码|
|[**userControllerSendVerificationCode**](#usercontrollersendverificationcode) | **POST** /user/email/verification | 发送邮箱验证码（通用接口）|
|[**userControllerSetUserCommissionConfig**](#usercontrollersetusercommissionconfig) | **POST** /user/commission/config | 设置用户抽成配置|
|[**userControllerSignIn**](#usercontrollersignin) | **POST** /user/sign-in | 手动签到|
|[**userControllerUnfollow**](#usercontrollerunfollow) | **POST** /user/{id}/unfollow | 取关用户|
|[**userControllerUpdate**](#usercontrollerupdate) | **PATCH** /user/{id} | 更新用户|
|[**userControllerUpdateCommissionSettings**](#usercontrollerupdatecommissionsettings) | **PATCH** /user/config/commission | 更新用户抽成设置|
|[**userControllerUpdateNotificationSettings**](#usercontrollerupdatenotificationsettings) | **PATCH** /user/config/notifications | 更新用户通知设置|
|[**userControllerUpdateProfileContact**](#usercontrollerupdateprofilecontact) | **PATCH** /user/profile/contact | 修改邮箱和手机号|
|[**userControllerUpdateUserConfig**](#usercontrollerupdateuserconfig) | **PATCH** /user/config | 更新当前用户配置|
|[**userControllerWithdrawWallet**](#usercontrollerwithdrawwallet) | **POST** /user/wallet/withdraw | 钱包提现|

# **achievementControllerClaimAllRewards**
> AchievementControllerClaimAllRewards201Response achievementControllerClaimAllRewards()



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

**AchievementControllerClaimAllRewards201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 领取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **achievementControllerClaimReward**
> achievementControllerClaimReward()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 领取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **achievementControllerCreate**
> AchievementControllerCreate201Response achievementControllerCreate(createAchievementDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateAchievementDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createAchievementDto: CreateAchievementDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerCreate(
    createAchievementDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createAchievementDto** | **CreateAchievementDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |

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

let sortBy: string; // (default to undefined)
let sortOrder: string; // (default to undefined)
let keyword: string; //关键词搜索（成就名称） (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerFindAll(
    sortBy,
    sortOrder,
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
| **sortBy** | [**string**] |  | defaults to undefined|
| **sortOrder** | [**string**] |  | defaults to undefined|
| **keyword** | [**string**] | 关键词搜索（成就名称） | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**AchievementControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **achievementControllerFindOne**
> achievementControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **achievementControllerRemove**
> achievementControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **achievementControllerUpdate**
> achievementControllerUpdate(updateAchievementDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateAchievementDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateAchievementDto: UpdateAchievementDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.achievementControllerUpdate(
    id,
    updateAchievementDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAchievementDto** | **UpdateAchievementDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerBatchDeleteBrowseHistory**
> articleControllerBatchDeleteBrowseHistory()



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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerCancelDislikeArticle**
> articleControllerCancelDislikeArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
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

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerCheckFavoriteStatus200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerClearBrowseHistory**
> articleControllerClearBrowseHistory()



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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerCreate**
> articleControllerCreate(createArticleDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateArticleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createArticleDto: CreateArticleDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerCreate(
    createArticleDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createArticleDto** | **CreateArticleDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerDeleteBrowseHistory**
> articleControllerDeleteBrowseHistory()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let articleId: string; // (default to undefined)
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
| **articleId** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerDislikeArticle**
> articleControllerDislikeArticle(body)



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let body: object; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerDislikeArticle(
    id,
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerFavoriteArticle**
> articleControllerFavoriteArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 收藏成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 文章不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerFindAll**
> ArticleControllerFindAll200Response articleControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let title: string; // (optional) (default to undefined)
let categoryId: number; // (optional) (default to undefined)
let type: 'following' | 'all' | 'popular' | 'latest'; // (optional) (default to undefined)
let tagId: number; // (optional) (default to undefined)
let status: string; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerFindAll(
    page,
    limit,
    title,
    categoryId,
    type,
    tagId,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **title** | [**string**] |  | (optional) defaults to undefined|
| **categoryId** | [**number**] |  | (optional) defaults to undefined|
| **type** | [**&#39;following&#39; | &#39;all&#39; | &#39;popular&#39; | &#39;latest&#39;**]**Array<&#39;following&#39; &#124; &#39;all&#39; &#124; &#39;popular&#39; &#124; &#39;latest&#39;>** |  | (optional) defaults to undefined|
| **tagId** | [**number**] |  | (optional) defaults to undefined|
| **status** | [**string**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let type: string; // (optional) (default to undefined)
let categoryId: number; // (optional) (default to undefined)
let keyword: string; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerFindByAuthor(
    id,
    page,
    limit,
    type,
    categoryId,
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
| **id** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **type** | [**string**] |  | (optional) defaults to undefined|
| **categoryId** | [**number**] |  | (optional) defaults to undefined|
| **keyword** | [**string**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerFindHotSearch**
> ArticleControllerFindHotSearch200Response articleControllerFindHotSearch()

热门搜索词

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let limit: number; //限制 (optional) (default to undefined)
let keyword: string; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerFindHotSearch(
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
| **limit** | [**number**] | 限制 | (optional) defaults to undefined|
| **keyword** | [**string**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindHotSearch200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerFindOne**
> ArticleControllerFindOne200Response articleControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 文章不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerFindRecommendations**
> ArticleControllerFindAll200Response articleControllerFindRecommendations()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

let articleId: string; // (default to undefined)
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
| **articleId** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetBrowseHistory200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerGetDislikeStatus**
> articleControllerGetDislikeStatus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
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

# **articleControllerGetDrafts**
> articleControllerGetDrafts()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
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
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerGetFavoritedArticles**
> ArticleControllerGetFavoritedArticles200Response articleControllerGetFavoritedArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let userId: number; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetFavoritedArticles(
    page,
    limit,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **userId** | [**number**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetFavoritedArticles200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**403** | 用户隐私设置不允许查看 |  -  |

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

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetLikeCount200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 文章不存在 |  -  |

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

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetLikeStatus200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 文章不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerGetLikedArticles**
> ArticleControllerGetLikedArticles200Response articleControllerGetLikedArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetLikedArticles200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

let limit: number; // (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetRecentBrowsedArticles(
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
| **limit** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetRecentBrowsedArticles200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

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

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let startDate: string; //开始日期 (optional) (default to undefined)
let endDate: string; //结束日期 (optional) (default to undefined)
let categoryId: number; //分类ID (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerGetUserBrowseHistory(
    page,
    limit,
    startDate,
    endDate,
    categoryId,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **startDate** | [**string**] | 开始日期 | (optional) defaults to undefined|
| **endDate** | [**string**] | 结束日期 | (optional) defaults to undefined|
| **categoryId** | [**number**] | 分类ID | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetUserBrowseHistory200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerLike**
> UserControllerLogout201Response articleControllerLike(articleLikeDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ArticleLikeDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let articleLikeDto: ArticleLikeDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerLike(
    id,
    articleLikeDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **articleLikeDto** | **ArticleLikeDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerLogout201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 操作成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 文章不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerRemove**
> articleControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 文章不存在 |  -  |

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

let keyword: string; // (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let categoryId: number; // (optional) (default to undefined)
let sortBy: 'relevance' | 'latest' | 'views' | 'likes'; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerSearch(
    keyword,
    page,
    limit,
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
| **keyword** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **categoryId** | [**number**] |  | (optional) defaults to undefined|
| **sortBy** | [**&#39;relevance&#39; | &#39;latest&#39; | &#39;views&#39; | &#39;likes&#39;**]**Array<&#39;relevance&#39; &#124; &#39;latest&#39; &#124; &#39;views&#39; &#124; &#39;likes&#39;>** |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**404** | 文章不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerSetFeatured**
> articleControllerSetFeatured(setArticleFeaturedDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SetArticleFeaturedDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let setArticleFeaturedDto: SetArticleFeaturedDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerSetFeatured(
    id,
    setArticleFeaturedDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setArticleFeaturedDto** | **SetArticleFeaturedDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerSetProfilePin**
> articleControllerSetProfilePin(setArticleProfilePinDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SetArticleProfilePinDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let setArticleProfilePinDto: SetArticleProfilePinDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerSetProfilePin(
    id,
    setArticleProfilePinDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setArticleProfilePinDto** | **SetArticleProfilePinDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerUnfavoriteArticle**
> UserControllerLogout201Response articleControllerUnfavoriteArticle()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerLogout201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取消收藏成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerUpdate**
> ArticleControllerUpdate200Response articleControllerUpdate(updateArticleDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateArticleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateArticleDto: UpdateArticleDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerUpdate(
    id,
    updateArticleDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateArticleDto** | **UpdateArticleDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerUpdate200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 文章不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **articleControllerUpdateBrowseProgress**
> articleControllerUpdateBrowseProgress(recordBrowseHistoryDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RecordBrowseHistoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let recordBrowseHistoryDto: RecordBrowseHistoryDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.articleControllerUpdateBrowseProgress(
    id,
    recordBrowseHistoryDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recordBrowseHistoryDto** | **RecordBrowseHistoryDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **bannerControllerCreate**
> BannerControllerCreate201Response bannerControllerCreate(createBannerDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateBannerDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createBannerDto: CreateBannerDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.bannerControllerCreate(
    createBannerDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createBannerDto** | **CreateBannerDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**BannerControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 无权限 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **bannerControllerFindActive**
> BannerControllerFindActive200Response bannerControllerFindActive()



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

**BannerControllerFindActive200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

let sortBy: string; // (default to undefined)
let sortOrder: string; // (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let status: string; //状态筛选（管理员可查询，普通用户默认active） (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.bannerControllerFindAll(
    sortBy,
    sortOrder,
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
| **sortBy** | [**string**] |  | defaults to undefined|
| **sortOrder** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **status** | [**string**] | 状态筛选（管理员可查询，普通用户默认active） | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**BannerControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **bannerControllerFindOne**
> object bannerControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //轮播ID (default to undefined)
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
| **id** | [**number**] | 轮播ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**object**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 轮播不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **bannerControllerRemove**
> bannerControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //轮播ID (default to undefined)
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
| **id** | [**number**] | 轮播ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 无权限 |  -  |
|**404** | 轮播不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **bannerControllerUpdate**
> bannerControllerUpdate(body)



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //轮播ID (default to undefined)
let body: object; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.bannerControllerUpdate(
    id,
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
| **id** | [**number**] | 轮播ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 无权限 |  -  |
|**404** | 轮播不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoryControllerCreate**
> categoryControllerCreate(createCategoryDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createCategoryDto: CreateCategoryDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.categoryControllerCreate(
    createCategoryDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCategoryDto** | **CreateCategoryDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

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

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let name: string; // (optional) (default to undefined)
let status: string; // (optional) (default to undefined)
let parentId: number; // (optional) (default to undefined)
let sortBy: string; // (optional) (default to undefined)
let sortOrder: string; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.categoryControllerFindAll(
    page,
    limit,
    name,
    status,
    parentId,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **name** | [**string**] |  | (optional) defaults to undefined|
| **status** | [**string**] |  | (optional) defaults to undefined|
| **parentId** | [**number**] |  | (optional) defaults to undefined|
| **sortBy** | [**string**] |  | (optional) defaults to undefined|
| **sortOrder** | [**string**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CategoryControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoryControllerFindOne**
> CategoryControllerFindOne200Response categoryControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CategoryControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 分类不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoryControllerRemove**
> categoryControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 分类不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoryControllerUpdate**
> categoryControllerUpdate(updateCategoryDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateCategoryDto: UpdateCategoryDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.categoryControllerUpdate(
    id,
    updateCategoryDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCategoryDto** | **UpdateCategoryDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 分类不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **collectionControllerAddToCollection**
> CollectionControllerAddToCollection201Response collectionControllerAddToCollection()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //合集ID (default to undefined)
let articleId: number; //文章ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerAddToCollection(
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
| **id** | [**number**] | 合集ID | defaults to undefined|
| **articleId** | [**number**] | 文章ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerAddToCollection201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **collectionControllerCheckArticleInCollections**
> CollectionControllerCheckArticleInCollections200Response collectionControllerCheckArticleInCollections()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let articleId: number; //文章ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerCheckArticleInCollections(
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
| **articleId** | [**number**] | 文章ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerCheckArticleInCollections200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **collectionControllerCreate**
> collectionControllerCreate(createCollectionDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateCollectionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createCollectionDto: CreateCollectionDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerCreate(
    createCollectionDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCollectionDto** | **CreateCollectionDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

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

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let userId: number; //用户ID (optional) (default to undefined)
let keyword: string; //关键词搜索（收藏夹名称） (optional) (default to undefined)
let sortBy: string; //排序字段 (optional) (default to undefined)
let sortOrder: 'ASC' | 'DESC'; //排序方向 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerFindAll(
    page,
    limit,
    userId,
    keyword,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **userId** | [**number**] | 用户ID | (optional) defaults to undefined|
| **keyword** | [**string**] | 关键词搜索（收藏夹名称） | (optional) defaults to undefined|
| **sortBy** | [**string**] | 排序字段 | (optional) defaults to undefined|
| **sortOrder** | [**&#39;ASC&#39; | &#39;DESC&#39;**]**Array<&#39;ASC&#39; &#124; &#39;DESC&#39;>** | 排序方向 | (optional) defaults to undefined|
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
|**200** |  |  -  |

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

let id: number; //合集ID (default to undefined)
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
| **id** | [**number**] | 合集ID | defaults to undefined|
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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **collectionControllerGetArticleCollectionInfo**
> CollectionControllerGetArticleCollectionInfo200Response collectionControllerGetArticleCollectionInfo()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let articleId: number; //文章ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerGetArticleCollectionInfo(
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
| **articleId** | [**number**] | 文章ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerGetArticleCollectionInfo200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **collectionControllerGetCollectionItems**
> CollectionControllerGetCollectionItems200Response collectionControllerGetCollectionItems()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //合集ID (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerGetCollectionItems(
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
| **id** | [**number**] | 合集ID | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CollectionControllerGetCollectionItems200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **collectionControllerRemove**
> collectionControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //合集ID (default to undefined)
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
| **id** | [**number**] | 合集ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **collectionControllerRemoveFromCollection**
> collectionControllerRemoveFromCollection()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //合集ID (default to undefined)
let articleId: number; //文章ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerRemoveFromCollection(
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
| **id** | [**number**] | 合集ID | defaults to undefined|
| **articleId** | [**number**] | 文章ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **collectionControllerUpdate**
> collectionControllerUpdate(updateCollectionDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateCollectionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //合集ID (default to undefined)
let updateCollectionDto: UpdateCollectionDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.collectionControllerUpdate(
    id,
    updateCollectionDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCollectionDto** | **UpdateCollectionDto**|  | |
| **id** | [**number**] | 合集ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerCreate**
> commentControllerCreate(createCommentDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateCommentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createCommentDto: CreateCommentDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerCreate(
    createCommentDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCommentDto** | **CreateCommentDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerFindAll**
> CommentControllerFindAll200Response commentControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let sortBy: 'latest' | 'oldest' | 'hot' | ''; //排序 (optional) (default to undefined)
let onlyAuthor: boolean; //只看作者 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerFindAll(
    id,
    page,
    limit,
    sortBy,
    onlyAuthor,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **sortBy** | [**&#39;latest&#39; | &#39;oldest&#39; | &#39;hot&#39; | &#39;&#39;**]**Array<&#39;latest&#39; &#124; &#39;oldest&#39; &#124; &#39;hot&#39; &#124; &#39;&#39;>** | 排序 | (optional) defaults to undefined|
| **onlyAuthor** | [**boolean**] | 只看作者 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let articleId: string; // (optional) (default to undefined)
let userId: string; // (optional) (default to undefined)
let keyword: string; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerFindAllComments(
    page,
    limit,
    articleId,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **articleId** | [**string**] |  | (optional) defaults to undefined|
| **userId** | [**string**] |  | (optional) defaults to undefined|
| **keyword** | [**string**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerFindAllComments200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerFindOne**
> CommentControllerFindAll200Response commentControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let sortBy: 'latest' | 'oldest' | 'hot'; //排序 (optional) (default to undefined)
let onlyAuthor: boolean; //只看作者 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerFindOne(
    id,
    page,
    limit,
    sortBy,
    onlyAuthor,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **sortBy** | [**&#39;latest&#39; | &#39;oldest&#39; | &#39;hot&#39;**]**Array<&#39;latest&#39; &#124; &#39;oldest&#39; &#124; &#39;hot&#39;>** | 排序 | (optional) defaults to undefined|
| **onlyAuthor** | [**boolean**] | 只看作者 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 评论不存在 |  -  |

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

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ArticleControllerGetLikeCount200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerGetReplies**
> any commentControllerGetReplies()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //父评论ID (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerGetReplies(
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
| **id** | [**number**] | 父评论ID | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 父评论不存在 |  -  |

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
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerFindAllComments200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerLike**
> commentControllerLike()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 点赞成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 评论不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerRemove**
> commentControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 评论不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerSetPin**
> commentControllerSetPin(setCommentPinDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SetCommentPinDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let setCommentPinDto: SetCommentPinDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerSetPin(
    id,
    setCommentPinDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setCommentPinDto** | **SetCommentPinDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commentControllerUpdate**
> CommentControllerUpdate200Response commentControllerUpdate(updateCommentDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateCommentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateCommentDto: UpdateCommentDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.commentControllerUpdate(
    id,
    updateCommentDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCommentDto** | **UpdateCommentDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**CommentControllerUpdate200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 评论不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **configControllerCreate**
> configControllerCreate(body)



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let body: object; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerCreate(
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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

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

let group: string; //配置分组 (default to undefined)
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
| **group** | [**string**] | 配置分组 | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ConfigControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

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
|**200** | 获取成功 |  -  |

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
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **configControllerRemove**
> configControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //配置ID (default to undefined)
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
| **id** | [**number**] | 配置ID | defaults to undefined|
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
|**200** | 删除成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 配置不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **configControllerUpdate**
> configControllerUpdate()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //配置ID (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let body: any; // (optional)

const { status, data } = await apiInstance.configControllerUpdate(
    id,
    authorization,
    deviceId,
    deviceName,
    deviceType,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **any**|  | |
| **id** | [**number**] | 配置ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 配置不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **configControllerUpdateAll**
> configControllerUpdateAll(configControllerUpdateAllRequestInner)



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let configControllerUpdateAllRequestInner: Array<ConfigControllerUpdateAllRequestInner>; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerUpdateAll(
    configControllerUpdateAllRequestInner,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **configControllerUpdateAllRequestInner** | **Array<ConfigControllerUpdateAllRequestInner>**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **configControllerUpdateByKey**
> configControllerUpdateByKey()



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

const { status, data } = await apiInstance.configControllerUpdateByKey(
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

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 配置不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **configControllerUpdateGroup**
> configControllerUpdateGroup(requestBody)



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let group: string; //配置分组 (default to undefined)
let requestBody: Array<string>; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.configControllerUpdateGroup(
    group,
    requestBody,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<string>**|  | |
| **group** | [**string**] | 配置分组 | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentAuditControllerAuditImage**
> contentAuditControllerAuditImage()



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

const { status, data } = await apiInstance.contentAuditControllerAuditImage(
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
|**200** | 审核完成 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentAuditControllerAuditText**
> ContentAuditControllerAuditText201Response contentAuditControllerAuditText()



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ContentAuditControllerAuditTextRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let contentAuditControllerAuditTextRequest: ContentAuditControllerAuditTextRequest; // (optional)

const { status, data } = await apiInstance.contentAuditControllerAuditText(
    authorization,
    deviceId,
    deviceName,
    deviceType,
    contentAuditControllerAuditTextRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contentAuditControllerAuditTextRequest** | **ContentAuditControllerAuditTextRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ContentAuditControllerAuditText201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 审核完成 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentAuditControllerGetConfig**
> contentAuditControllerGetConfig()



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

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentAuditControllerGetPendingArticles**
> contentAuditControllerGetPendingArticles()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to undefined)
let limit: number; //每页数量 (optional) (default to undefined)
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
| **limit** | [**number**] | 每页数量 | (optional) defaults to undefined|
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
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentAuditControllerReloadConfig**
> contentAuditControllerReloadConfig()



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

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 重载成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contentAuditControllerReviewArticle**
> contentAuditControllerReviewArticle(body)



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let body: object; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.contentAuditControllerReviewArticle(
    id,
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
| **id** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 审核成功 |  -  |
|**404** | 文章不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerClaimActivityReward**
> decorationControllerClaimActivityReward()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let activityId: string; // (default to undefined)
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
| **activityId** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 领取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerCleanExpired**
> DecorationControllerCleanExpired201Response decorationControllerCleanExpired()



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

**DecorationControllerCleanExpired201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 清理成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerCreate**
> decorationControllerCreate(createDecorationDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateDecorationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createDecorationDto: CreateDecorationDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerCreate(
    createDecorationDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createDecorationDto** | **CreateDecorationDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerCreateActivity**
> DecorationControllerCreateActivity201Response decorationControllerCreateActivity(createActivityDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateActivityDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createActivityDto: CreateActivityDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerCreateActivity(
    createActivityDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createActivityDto** | **CreateActivityDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerCreateActivity201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |

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

let type: 'AVATAR_FRAME' | 'COMMENT_BUBBLE' | 'ACHIEVEMENT_BADGE'; //装饰品类型 (optional) (default to undefined)
let status: string; //状态（管理员可查询，普通用户默认ACTIVE） (optional) (default to undefined)
let keyword: string; //关键词搜索 (optional) (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let sortBy: string; // (optional) (default to undefined)
let sortOrder: string; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerFindAll(
    type,
    status,
    keyword,
    page,
    limit,
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
| **type** | [**&#39;AVATAR_FRAME&#39; | &#39;COMMENT_BUBBLE&#39; | &#39;ACHIEVEMENT_BADGE&#39;**]**Array<&#39;AVATAR_FRAME&#39; &#124; &#39;COMMENT_BUBBLE&#39; &#124; &#39;ACHIEVEMENT_BADGE&#39;>** | 装饰品类型 | (optional) defaults to undefined|
| **status** | [**string**] | 状态（管理员可查询，普通用户默认ACTIVE） | (optional) defaults to undefined|
| **keyword** | [**string**] | 关键词搜索 | (optional) defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **sortBy** | [**string**] |  | (optional) defaults to undefined|
| **sortOrder** | [**string**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

let status: string; //状态筛选 (optional) (default to undefined)
let type: string; //类型筛选 (optional) (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerFindAllActivities(
    status,
    type,
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
| **status** | [**string**] | 状态筛选 | (optional) defaults to undefined|
| **type** | [**string**] | 类型筛选 | (optional) defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerFindAllActivities200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerFindOne**
> DecorationControllerFindOne200Response decorationControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerFindOneActivity**
> decorationControllerFindOneActivity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGetMyAchievementBadges(
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerGetMyAchievementBadges200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerGetMyActivityProgress**
> OrderControllerGetPendingOrders200Response decorationControllerGetMyActivityProgress()



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

**OrderControllerGetPendingOrders200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerGetMyDecorations**
> DecorationControllerGetMyDecorations200Response decorationControllerGetMyDecorations()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let type: string; // (optional) (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGetMyDecorations(
    type,
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
| **type** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerGetMyDecorations200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerGetUserDecorations**
> DecorationControllerGetUserDecorations200Response decorationControllerGetUserDecorations()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; // (default to undefined)
let type: string; // (optional) (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGetUserDecorations(
    userId,
    type,
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
| **type** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerGetUserDecorations200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerGift**
> decorationControllerGift(giftDecorationDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    GiftDecorationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let giftDecorationDto: GiftDecorationDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerGift(
    giftDecorationDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **giftDecorationDto** | **GiftDecorationDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 赠送成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerPurchase**
> decorationControllerPurchase(purchaseDecorationDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PurchaseDecorationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let purchaseDecorationDto: PurchaseDecorationDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerPurchase(
    purchaseDecorationDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **purchaseDecorationDto** | **PurchaseDecorationDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 购买成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerRemove**
> decorationControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerRemoveActivity**
> decorationControllerRemoveActivity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerUnuseDecoration**
> decorationControllerUnuseDecoration()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let decorationId: string; // (default to undefined)
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
| **decorationId** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取消成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerUpdate**
> decorationControllerUpdate(updateDecorationDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateDecorationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateDecorationDto: UpdateDecorationDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerUpdate(
    id,
    updateDecorationDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateDecorationDto** | **UpdateDecorationDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerUpdateActivity**
> decorationControllerUpdateActivity(updateActivityDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateActivityDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateActivityDto: UpdateActivityDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.decorationControllerUpdateActivity(
    id,
    updateActivityDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateActivityDto** | **UpdateActivityDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **decorationControllerUseDecoration**
> DecorationControllerUseDecoration201Response decorationControllerUseDecoration()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let decorationId: string; // (default to undefined)
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
| **decorationId** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**DecorationControllerUseDecoration201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 装备成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerAddToFavorites**
> emojiControllerAddToFavorites()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //表情ID (default to undefined)
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
| **id** | [**string**] | 表情ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerCreate**
> EmojiControllerCreate201Response emojiControllerCreate(createEmojiDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateEmojiDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createEmojiDto: CreateEmojiDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerCreate(
    createEmojiDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createEmojiDto** | **CreateEmojiDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**EmojiControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

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

let grouped: boolean; //聚合 (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let type: 'system' | 'user'; //表情类型 (optional) (default to undefined)
let category: string; //分类 (optional) (default to undefined)
let keyword: string; //关键词搜索 (optional) (default to undefined)
let isPublic: boolean; //是否公开 (optional) (default to undefined)
let status: 'active' | 'inactive' | 'deleted'; //状态 (optional) (default to undefined)
let userId: string; //用户ID（查询指定用户的表情） (optional) (default to undefined)
let onlyFavorites: boolean; //是否只查询收藏的表情 (optional) (default to undefined)
let sortBy: string; //排序字段 (optional) (default to undefined)
let sortOrder: 'ASC' | 'DESC'; //排序方向 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerFindAll(
    grouped,
    page,
    limit,
    type,
    category,
    keyword,
    isPublic,
    status,
    userId,
    onlyFavorites,
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
| **grouped** | [**boolean**] | 聚合 | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **type** | [**&#39;system&#39; | &#39;user&#39;**]**Array<&#39;system&#39; &#124; &#39;user&#39;>** | 表情类型 | (optional) defaults to undefined|
| **category** | [**string**] | 分类 | (optional) defaults to undefined|
| **keyword** | [**string**] | 关键词搜索 | (optional) defaults to undefined|
| **isPublic** | [**boolean**] | 是否公开 | (optional) defaults to undefined|
| **status** | [**&#39;active&#39; | &#39;inactive&#39; | &#39;deleted&#39;**]**Array<&#39;active&#39; &#124; &#39;inactive&#39; &#124; &#39;deleted&#39;>** | 状态 | (optional) defaults to undefined|
| **userId** | [**string**] | 用户ID（查询指定用户的表情） | (optional) defaults to undefined|
| **onlyFavorites** | [**boolean**] | 是否只查询收藏的表情 | (optional) defaults to undefined|
| **sortBy** | [**string**] | 排序字段 | (optional) defaults to undefined|
| **sortOrder** | [**&#39;ASC&#39; | &#39;DESC&#39;**]**Array<&#39;ASC&#39; &#124; &#39;DESC&#39;>** | 排序方向 | (optional) defaults to undefined|
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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerFindOne**
> emojiControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //表情ID (default to undefined)
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
| **id** | [**string**] | 表情ID | defaults to undefined|
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

# **emojiControllerGetCategories**
> EmojiControllerGetCategories200Response emojiControllerGetCategories()



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

**EmojiControllerGetCategories200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerGetFavorites**
> emojiControllerGetFavorites()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerGetFavorites(
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerGetPopular**
> emojiControllerGetPopular()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let limit: number; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerGetPopular(
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
| **limit** | [**number**] |  | (optional) defaults to undefined|
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

# **emojiControllerGetRecent**
> emojiControllerGetRecent()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let limit: number; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerGetRecent(
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
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerIncrementUseCount**
> emojiControllerIncrementUseCount()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //表情ID (default to undefined)
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
| **id** | [**string**] | 表情ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerRemove**
> emojiControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //表情ID (default to undefined)
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
| **id** | [**string**] | 表情ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerRemoveFromFavorites**
> emojiControllerRemoveFromFavorites()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //表情ID (default to undefined)
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
| **id** | [**string**] | 表情ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerUpdate**
> emojiControllerUpdate(updateEmojiDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateEmojiDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //表情ID (default to undefined)
let updateEmojiDto: UpdateEmojiDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.emojiControllerUpdate(
    id,
    updateEmojiDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateEmojiDto** | **UpdateEmojiDto**|  | |
| **id** | [**string**] | 表情ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **emojiControllerUpload**
> emojiControllerUpload()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let name: string; //表情名称 (default to undefined)
let isPublic: boolean; //是否公开 (default to true)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let code: string; //表情代码 (optional) (default to undefined)
let category: string; //分类 (optional) (default to undefined)
let tags: string; //标签（逗号分隔） (optional) (default to undefined)

const { status, data } = await apiInstance.emojiControllerUpload(
    name,
    isPublic,
    authorization,
    deviceId,
    deviceName,
    deviceType,
    code,
    category,
    tags
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | 表情名称 | defaults to undefined|
| **isPublic** | [**boolean**] | 是否公开 | defaults to true|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|
| **code** | [**string**] | 表情代码 | (optional) defaults to undefined|
| **category** | [**string**] | 分类 | (optional) defaults to undefined|
| **tags** | [**string**] | 标签（逗号分隔） | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inviteControllerCreateInvite**
> inviteControllerCreateInvite(createInviteDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateInviteDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createInviteDto: CreateInviteDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerCreateInvite(
    createInviteDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createInviteDto** | **CreateInviteDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 邀请码创建成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inviteControllerGetInviteDetail**
> inviteControllerGetInviteDetail()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 邀请记录不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inviteControllerGetInviteStats**
> InviteControllerGetInviteStats200Response inviteControllerGetInviteStats()



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

**InviteControllerGetInviteStats200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inviteControllerGetMyInviteEarnings**
> UserControllerGetFollowers200Response inviteControllerGetMyInviteEarnings()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerGetMyInviteEarnings(
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetFollowers200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inviteControllerGetMyInvites**
> UserControllerGetFollowers200Response inviteControllerGetMyInvites()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let keyword: string; // (default to undefined)
let status: string; // (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerGetMyInvites(
    keyword,
    status,
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
| **keyword** | [**string**] |  | defaults to undefined|
| **status** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetFollowers200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inviteControllerUseInvite**
> inviteControllerUseInvite(useInviteDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UseInviteDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let useInviteDto: UseInviteDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.inviteControllerUseInvite(
    useInviteDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **useInviteDto** | **UseInviteDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 邀请码使用成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**404** | 邀请码不存在 |  -  |
|**409** | 邀请码已使用 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerBatchOperation**
> messageControllerBatchOperation(batchMessageDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    BatchMessageDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchMessageDto: BatchMessageDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerBatchOperation(
    batchMessageDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchMessageDto** | **BatchMessageDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerBlockPrivateUser**
> messageControllerBlockPrivateUser()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //目标用户ID (default to undefined)
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
| **userId** | [**string**] | 目标用户ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerCreate**
> messageControllerCreate(createMessageDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateMessageDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createMessageDto: CreateMessageDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerCreate(
    createMessageDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createMessageDto** | **CreateMessageDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

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

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerFindAll(
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

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

let id: string; //消息ID (default to undefined)
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
| **id** | [**string**] | 消息ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

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

let userId: string; //会话对方用户ID (default to undefined)
let cursor: string; //游标字符串 (optional) (default to undefined)
let limit: number; //每页数量 (optional) (default to 20)
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
| **userId** | [**string**] | 会话对方用户ID | defaults to undefined|
| **cursor** | [**string**] | 游标字符串 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 20|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerGetPrivateConversation200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

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

let cursor: string; //游标字符串 (optional) (default to undefined)
let limit: number; //每页数量 (optional) (default to 20)
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
| **cursor** | [**string**] | 游标字符串 | (optional) defaults to undefined|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 20|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerGetPrivateConversations200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerMarkAllAsRead**
> messageControllerMarkAllAsRead(body)



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let body: object; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerMarkAllAsRead(
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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerMarkAsRead**
> messageControllerMarkAsRead()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //消息ID (default to undefined)
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
| **id** | [**string**] | 消息ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerMarkPrivateMessagesRead**
> messageControllerMarkPrivateMessagesRead(batchReadPrivateMessagesDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    BatchReadPrivateMessagesDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchReadPrivateMessagesDto: BatchReadPrivateMessagesDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerMarkPrivateMessagesRead(
    batchReadPrivateMessagesDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchReadPrivateMessagesDto** | **BatchReadPrivateMessagesDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerRecallPrivateMessage**
> messageControllerRecallPrivateMessage(recallPrivateMessageDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RecallPrivateMessageDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //私信ID (default to undefined)
let recallPrivateMessageDto: RecallPrivateMessageDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerRecallPrivateMessage(
    id,
    recallPrivateMessageDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recallPrivateMessageDto** | **RecallPrivateMessageDto**|  | |
| **id** | [**string**] | 私信ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerRemove**
> messageControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //消息ID (default to undefined)
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
| **id** | [**string**] | 消息ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerSearch**
> MessageControllerSearch200Response messageControllerSearch()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let type: 'private' | 'system' | 'notification'; //消息类型 (optional) (default to undefined)
let isRead: boolean; //是否已读 (optional) (default to undefined)
let isBroadcast: boolean; //是否为广播消息 (optional) (default to undefined)
let keyword: string; //搜索关键词 (optional) (default to undefined)
let senderId: number; //发送者ID (optional) (default to undefined)
let receiverId: number; //接收者ID (optional) (default to undefined)
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **type** | [**&#39;private&#39; | &#39;system&#39; | &#39;notification&#39;**]**Array<&#39;private&#39; &#124; &#39;system&#39; &#124; &#39;notification&#39;>** | 消息类型 | (optional) defaults to undefined|
| **isRead** | [**boolean**] | 是否已读 | (optional) defaults to undefined|
| **isBroadcast** | [**boolean**] | 是否为广播消息 | (optional) defaults to undefined|
| **keyword** | [**string**] | 搜索关键词 | (optional) defaults to undefined|
| **senderId** | [**number**] | 发送者ID | (optional) defaults to undefined|
| **receiverId** | [**number**] | 接收者ID | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**MessageControllerSearch200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerSendPrivateMessage**
> messageControllerSendPrivateMessage(sendPrivateMessageDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SendPrivateMessageDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //接收者用户ID (default to undefined)
let sendPrivateMessageDto: SendPrivateMessageDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerSendPrivateMessage(
    userId,
    sendPrivateMessageDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sendPrivateMessageDto** | **SendPrivateMessageDto**|  | |
| **userId** | [**string**] | 接收者用户ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerUnblockPrivateUser**
> messageControllerUnblockPrivateUser()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; //目标用户ID (default to undefined)
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
| **userId** | [**string**] | 目标用户ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messageControllerUpdate**
> messageControllerUpdate(updateMessageDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateMessageDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //消息ID (default to undefined)
let updateMessageDto: UpdateMessageDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.messageControllerUpdate(
    id,
    updateMessageDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateMessageDto** | **UpdateMessageDto**|  | |
| **id** | [**string**] | 消息ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerCancelOrder**
> orderControllerCancelOrder()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取消成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**404** | 订单不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerCreateArticleOrder**
> orderControllerCreateArticleOrder(createArticleOrderDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateArticleOrderDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createArticleOrderDto: CreateArticleOrderDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerCreateArticleOrder(
    createArticleOrderDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createArticleOrderDto** | **CreateArticleOrderDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerCreateMembershipOrder**
> OrderControllerCreateMembershipOrder201Response orderControllerCreateMembershipOrder(createMembershipOrderDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateMembershipOrderDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createMembershipOrderDto: CreateMembershipOrderDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerCreateMembershipOrder(
    createMembershipOrderDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createMembershipOrderDto** | **CreateMembershipOrderDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerCreateMembershipOrder201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerFindByOrderNo**
> OrderControllerFindOne200Response orderControllerFindByOrderNo()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let orderNo: string; // (default to undefined)
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
| **orderNo** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 订单不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerFindOne**
> OrderControllerFindOne200Response orderControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 订单不存在 |  -  |

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

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'; //订单状态 (optional) (default to undefined)
let type: 'MEMBERSHIP' | 'PRODUCT' | 'SERVICE' | 'ARTICLE'; //订单类型 (optional) (default to undefined)
let userId: number; //用户ID（筛选特定用户的订单） (optional) (default to undefined)
let keyword: string; //关键词搜索（订单号） (optional) (default to undefined)
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **status** | [**&#39;PENDING&#39; | &#39;PAID&#39; | &#39;CANCELLED&#39; | &#39;REFUNDED&#39;**]**Array<&#39;PENDING&#39; &#124; &#39;PAID&#39; &#124; &#39;CANCELLED&#39; &#124; &#39;REFUNDED&#39;>** | 订单状态 | (optional) defaults to undefined|
| **type** | [**&#39;MEMBERSHIP&#39; | &#39;PRODUCT&#39; | &#39;SERVICE&#39; | &#39;ARTICLE&#39;**]**Array<&#39;MEMBERSHIP&#39; &#124; &#39;PRODUCT&#39; &#124; &#39;SERVICE&#39; &#124; &#39;ARTICLE&#39;>** | 订单类型 | (optional) defaults to undefined|
| **userId** | [**number**] | 用户ID（筛选特定用户的订单） | (optional) defaults to undefined|
| **keyword** | [**string**] | 关键词搜索（订单号） | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**OrderControllerGetAllOrders200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerGetUserOrders**
> UserControllerGetFollowers200Response orderControllerGetUserOrders()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'; //订单状态 (optional) (default to undefined)
let type: 'MEMBERSHIP' | 'PRODUCT' | 'SERVICE' | 'ARTICLE'; //订单类型 (optional) (default to undefined)
let keyword: string; //关键词搜索（订单号） (optional) (default to undefined)
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **status** | [**&#39;PENDING&#39; | &#39;PAID&#39; | &#39;CANCELLED&#39; | &#39;REFUNDED&#39;**]**Array<&#39;PENDING&#39; &#124; &#39;PAID&#39; &#124; &#39;CANCELLED&#39; &#124; &#39;REFUNDED&#39;>** | 订单状态 | (optional) defaults to undefined|
| **type** | [**&#39;MEMBERSHIP&#39; | &#39;PRODUCT&#39; | &#39;SERVICE&#39; | &#39;ARTICLE&#39;**]**Array<&#39;MEMBERSHIP&#39; &#124; &#39;PRODUCT&#39; &#124; &#39;SERVICE&#39; &#124; &#39;ARTICLE&#39;>** | 订单类型 | (optional) defaults to undefined|
| **keyword** | [**string**] | 关键词搜索（订单号） | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetFollowers200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerRequestRefund**
> orderControllerRequestRefund()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.orderControllerRequestRefund(
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 申请成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**404** | 订单不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerAlipayNotify**
> paymentControllerAlipayNotify(alipayNotifyDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AlipayNotifyDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let alipayNotifyDto: AlipayNotifyDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerAlipayNotify(
    alipayNotifyDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **alipayNotifyDto** | **AlipayNotifyDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 回调处理成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerCreatePayment**
> PaymentControllerCreatePayment201Response paymentControllerCreatePayment(createPaymentDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreatePaymentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createPaymentDto: CreatePaymentDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerCreatePayment(
    createPaymentDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPaymentDto** | **CreatePaymentDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PaymentControllerCreatePayment201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 支付创建成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerEpayNotify**
> paymentControllerEpayNotify()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let pid: string; //商户ID (default to undefined)
let tradeNo: string; //易支付订单号 (default to undefined)
let outTradeNo: string; //商户订单号 (default to undefined)
let tradeStatus: string; //交易状态 (default to undefined)
let money: string; //交易金额 (default to undefined)
let type: string; //支付类型 (default to undefined)
let name: string; //商品名称 (default to undefined)
let sign: string; //签名 (default to undefined)
let signType: string; //签名类型 (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerEpayNotify(
    pid,
    tradeNo,
    outTradeNo,
    tradeStatus,
    money,
    type,
    name,
    sign,
    signType,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pid** | [**string**] | 商户ID | defaults to undefined|
| **tradeNo** | [**string**] | 易支付订单号 | defaults to undefined|
| **outTradeNo** | [**string**] | 商户订单号 | defaults to undefined|
| **tradeStatus** | [**string**] | 交易状态 | defaults to undefined|
| **money** | [**string**] | 交易金额 | defaults to undefined|
| **type** | [**string**] | 支付类型 | defaults to undefined|
| **name** | [**string**] | 商品名称 | defaults to undefined|
| **sign** | [**string**] | 签名 | defaults to undefined|
| **signType** | [**string**] | 签名类型 | defaults to undefined|
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
|**200** | 回调处理成功 |  -  |

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

let orderId: number; // (default to undefined)
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
| **orderId** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PaymentControllerFindPaymentByOrderId200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 查询成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerFindPaymentRecord**
> PaymentControllerFindPaymentRecord200Response paymentControllerFindPaymentRecord()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
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
| **id** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PaymentControllerFindPaymentRecord200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 查询成功 |  -  |

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

let page: number; // (default to undefined)
let limit: number; // (default to undefined)
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
| **page** | [**number**] |  | defaults to undefined|
| **limit** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PaymentControllerFindUserPayments200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 查询成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerTestEpaySignature**
> paymentControllerTestEpaySignature()



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

const { status, data } = await apiInstance.paymentControllerTestEpaySignature(
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
|**200** | 签名计算成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerWechatNotify**
> paymentControllerWechatNotify(wechatNotifyDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    WechatNotifyDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let wechatNotifyDto: WechatNotifyDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.paymentControllerWechatNotify(
    wechatNotifyDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **wechatNotifyDto** | **WechatNotifyDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 回调处理成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **permissionControllerCreate**
> object permissionControllerCreate(createPermissionDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreatePermissionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createPermissionDto: CreatePermissionDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.permissionControllerCreate(
    createPermissionDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPermissionDto** | **CreatePermissionDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**object**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **permissionControllerFindOne**
> PermissionControllerFindOne200Response permissionControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PermissionControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 权限不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **permissionControllerRemove**
> permissionControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 权限不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **permissionControllerUpdate**
> object permissionControllerUpdate(updatePermissionDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdatePermissionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updatePermissionDto: UpdatePermissionDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.permissionControllerUpdate(
    id,
    updatePermissionDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePermissionDto** | **UpdatePermissionDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**object**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 权限不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerAddPoints**
> pointsControllerAddPoints(addPointsDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AddPointsDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let addPointsDto: AddPointsDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerAddPoints(
    addPointsDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addPointsDto** | **AddPointsDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 积分增加成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerClaimTaskReward**
> pointsControllerClaimTaskReward()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 奖励领取成功 |  -  |
|**400** | 任务未完成或已领取 |  -  |
|**401** | 未授权 |  -  |
|**404** | 任务记录不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerCreateActivity**
> pointsControllerCreateActivity(createPointsActivityDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreatePointsActivityDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createPointsActivityDto: CreatePointsActivityDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerCreateActivity(
    createPointsActivityDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPointsActivityDto** | **CreatePointsActivityDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 活动创建成功 |  -  |
|**400** | 活动代码已存在或请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

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

let type: string; // (default to undefined)
let keyword: string; // (default to undefined)
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
| **type** | [**string**] |  | defaults to undefined|
| **keyword** | [**string**] |  | defaults to undefined|
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
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerFindOneActivity**
> PointsControllerFindOneActivity200Response pointsControllerFindOneActivity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerFindOneActivity200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 活动不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerGetAllTransactions**
> pointsControllerGetAllTransactions()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let type: 'EARN' | 'SPEND' | 'ADMIN_ADJUST' | 'EXPIRE' | 'REFUND'; //交易类型 (optional) (default to undefined)
let source: string; //积分来源/用途 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetAllTransactions(
    page,
    limit,
    type,
    source,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **type** | [**&#39;EARN&#39; | &#39;SPEND&#39; | &#39;ADMIN_ADJUST&#39; | &#39;EXPIRE&#39; | &#39;REFUND&#39;**]**Array<&#39;EARN&#39; &#124; &#39;SPEND&#39; &#124; &#39;ADMIN_ADJUST&#39; &#124; &#39;EXPIRE&#39; &#124; &#39;REFUND&#39;>** | 交易类型 | (optional) defaults to undefined|
| **source** | [**string**] | 积分来源/用途 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerGetBalance**
> pointsControllerGetBalance()



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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerGetMyTaskProgress**
> pointsControllerGetMyTaskProgress()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let activityId: string; // (default to undefined)
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
| **activityId** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 任务记录不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerGetMyTasks**
> pointsControllerGetMyTasks()



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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerGetTransactions**
> pointsControllerGetTransactions()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let type: 'EARN' | 'SPEND' | 'ADMIN_ADJUST' | 'EXPIRE' | 'REFUND'; //交易类型 (optional) (default to undefined)
let source: string; //积分来源/用途 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetTransactions(
    page,
    limit,
    type,
    source,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **type** | [**&#39;EARN&#39; | &#39;SPEND&#39; | &#39;ADMIN_ADJUST&#39; | &#39;EXPIRE&#39; | &#39;REFUND&#39;**]**Array<&#39;EARN&#39; &#124; &#39;SPEND&#39; &#124; &#39;ADMIN_ADJUST&#39; &#124; &#39;EXPIRE&#39; &#124; &#39;REFUND&#39;>** | 交易类型 | (optional) defaults to undefined|
| **source** | [**string**] | 积分来源/用途 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerGetUserBalance**
> PointsControllerGetUserBalance200Response pointsControllerGetUserBalance()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; // (default to undefined)
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
| **userId** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**PointsControllerGetUserBalance200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerGetUserTransactions**
> pointsControllerGetUserTransactions()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; // (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let type: 'EARN' | 'SPEND' | 'ADMIN_ADJUST' | 'EXPIRE' | 'REFUND'; //交易类型 (optional) (default to undefined)
let source: string; //积分来源/用途 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerGetUserTransactions(
    userId,
    page,
    limit,
    type,
    source,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **type** | [**&#39;EARN&#39; | &#39;SPEND&#39; | &#39;ADMIN_ADJUST&#39; | &#39;EXPIRE&#39; | &#39;REFUND&#39;**]**Array<&#39;EARN&#39; &#124; &#39;SPEND&#39; &#124; &#39;ADMIN_ADJUST&#39; &#124; &#39;EXPIRE&#39; &#124; &#39;REFUND&#39;>** | 交易类型 | (optional) defaults to undefined|
| **source** | [**string**] | 积分来源/用途 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerRemoveActivity**
> pointsControllerRemoveActivity()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 活动删除成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 活动不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerSpendPoints**
> pointsControllerSpendPoints(spendPointsDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SpendPointsDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let spendPointsDto: SpendPointsDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerSpendPoints(
    spendPointsDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **spendPointsDto** | **SpendPointsDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 积分消费成功 |  -  |
|**400** | 积分不足或请求参数错误 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pointsControllerUpdateActivity**
> pointsControllerUpdateActivity(updatePointsActivityDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdatePointsActivityDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updatePointsActivityDto: UpdatePointsActivityDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.pointsControllerUpdateActivity(
    id,
    updatePointsActivityDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePointsActivityDto** | **UpdatePointsActivityDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 活动更新成功 |  -  |
|**400** | 活动代码已存在或请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 活动不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reportControllerCreate**
> reportControllerCreate(createReportDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateReportDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createReportDto: CreateReportDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.reportControllerCreate(
    createReportDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createReportDto** | **CreateReportDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |

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

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let type: 'USER' | 'ARTICLE' | 'COMMENT'; //举报类型 (optional) (default to undefined)
let status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REJECTED'; //处理状态 (optional) (default to undefined)
let category: 'SPAM' | 'ABUSE' | 'INAPPROPRIATE' | 'COPYRIGHT' | 'OTHER'; //举报分类 (optional) (default to undefined)
let reporterId: number; //举报人ID (optional) (default to undefined)
let keyword: string; //关键词搜索（举报原因） (optional) (default to undefined)
let sortBy: string; //排序字段 (optional) (default to undefined)
let sortOrder: 'ASC' | 'DESC'; //排序方向 (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.reportControllerFindAll(
    page,
    limit,
    type,
    status,
    category,
    reporterId,
    keyword,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **type** | [**&#39;USER&#39; | &#39;ARTICLE&#39; | &#39;COMMENT&#39;**]**Array<&#39;USER&#39; &#124; &#39;ARTICLE&#39; &#124; &#39;COMMENT&#39;>** | 举报类型 | (optional) defaults to undefined|
| **status** | [**&#39;PENDING&#39; | &#39;PROCESSING&#39; | &#39;RESOLVED&#39; | &#39;REJECTED&#39;**]**Array<&#39;PENDING&#39; &#124; &#39;PROCESSING&#39; &#124; &#39;RESOLVED&#39; &#124; &#39;REJECTED&#39;>** | 处理状态 | (optional) defaults to undefined|
| **category** | [**&#39;SPAM&#39; | &#39;ABUSE&#39; | &#39;INAPPROPRIATE&#39; | &#39;COPYRIGHT&#39; | &#39;OTHER&#39;**]**Array<&#39;SPAM&#39; &#124; &#39;ABUSE&#39; &#124; &#39;INAPPROPRIATE&#39; &#124; &#39;COPYRIGHT&#39; &#124; &#39;OTHER&#39;>** | 举报分类 | (optional) defaults to undefined|
| **reporterId** | [**number**] | 举报人ID | (optional) defaults to undefined|
| **keyword** | [**string**] | 关键词搜索（举报原因） | (optional) defaults to undefined|
| **sortBy** | [**string**] | 排序字段 | (optional) defaults to undefined|
| **sortOrder** | [**&#39;ASC&#39; | &#39;DESC&#39;**]**Array<&#39;ASC&#39; &#124; &#39;DESC&#39;>** | 排序方向 | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**ReportControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reportControllerFindOne**
> reportControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reportControllerGetStatistics**
> reportControllerGetStatistics()



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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reportControllerRemove**
> reportControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reportControllerUpdate**
> reportControllerUpdate(updateReportDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateReportDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateReportDto: UpdateReportDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.reportControllerUpdate(
    id,
    updateReportDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateReportDto** | **UpdateReportDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **roleControllerAssignPermissions**
> roleControllerAssignPermissions(assignPermissionsDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AssignPermissionsDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let assignPermissionsDto: AssignPermissionsDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerAssignPermissions(
    id,
    assignPermissionsDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignPermissionsDto** | **AssignPermissionsDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 分配成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **roleControllerCopyRole**
> roleControllerCopyRole()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 复制成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **roleControllerCreate**
> object roleControllerCreate(createRoleDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateRoleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createRoleDto: CreateRoleDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerCreate(
    createRoleDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRoleDto** | **CreateRoleDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**object**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let name: string; // (optional) (default to undefined)
let isActive: boolean; // (optional) (default to undefined)
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **name** | [**string**] |  | (optional) defaults to undefined|
| **isActive** | [**boolean**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**RoleControllerFindWithPagination200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **roleControllerRemove**
> roleControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **roleControllerToggleStatus**
> roleControllerToggleStatus()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerToggleStatus(
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 状态更新成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **roleControllerUpdate**
> object roleControllerUpdate(updateRoleDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateRoleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateRoleDto: UpdateRoleDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.roleControllerUpdate(
    id,
    updateRoleDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRoleDto** | **UpdateRoleDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**object**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchControllerClearArticles**
> searchControllerClearArticles()



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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchControllerSyncArticles**
> UserControllerLogout201Response searchControllerSyncArticles()



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

**UserControllerLogout201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetTrends**
> statisticsControllerGetTrends()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let days: number; //统计天数，默认 7 天，最大 30 天 (optional) (default to 7)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.statisticsControllerGetTrends(
    days,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **days** | [**number**] | 统计天数，默认 7 天，最大 30 天 | (optional) defaults to 7|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerCreate**
> tagControllerCreate(createTagDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateTagDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createTagDto: CreateTagDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerCreate(
    createTagDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTagDto** | **CreateTagDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 创建成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerFindAll**
> TagControllerFindAll200Response tagControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let name: string; // (optional) (default to undefined)
let sortBy: 'hot' | 'createdAt'; // (optional) (default to undefined)
let sortOrder: 'DESC' | 'ASC'; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerFindAll(
    page,
    limit,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **name** | [**string**] |  | (optional) defaults to undefined|
| **sortBy** | [**&#39;hot&#39; | &#39;createdAt&#39;**]**Array<&#39;hot&#39; &#124; &#39;createdAt&#39;>** |  | (optional) defaults to undefined|
| **sortOrder** | [**&#39;DESC&#39; | &#39;ASC&#39;**]**Array<&#39;DESC&#39; &#124; &#39;ASC&#39;>** |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**TagControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerFindOne**
> TagControllerFindOne200Response tagControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**TagControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**404** | 标签不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerFollow**
> tagControllerFollow()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 关注成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 标签不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerFollowedList**
> TagControllerFindAll200Response tagControllerFollowedList()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; // (optional) (default to undefined)
let limit: number; //限制 (optional) (default to undefined)
let name: number; // (optional) (default to undefined)
let userId: number; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerFollowedList(
    page,
    limit,
    name,
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
| **page** | [**number**] |  | (optional) defaults to undefined|
| **limit** | [**number**] | 限制 | (optional) defaults to undefined|
| **name** | [**number**] |  | (optional) defaults to undefined|
| **userId** | [**number**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**TagControllerFindAll200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerRemove**
> tagControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 标签不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerUnfollow**
> tagControllerUnfollow()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 取消关注成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 标签不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerUpdate**
> tagControllerUpdate(updateTagDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateTagDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateTagDto: UpdateTagDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.tagControllerUpdate(
    id,
    updateTagDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTagDto** | **UpdateTagDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 标签不存在 |  -  |

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

let sortBy: string; // (default to undefined)
let sortOrder: string; // (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.uploadControllerFindAll(
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
| **sortBy** | [**string**] |  | defaults to undefined|
| **sortOrder** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UploadControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取所有上传文件成功 |  -  |

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

let id: string; //文件ID (default to undefined)
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
| **id** | [**string**] | 文件ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UploadControllerGetFileInfo200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取文件信息成功 |  -  |
|**404** | 文件不存在 |  -  |

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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadControllerRemove**
> uploadControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //文件ID (default to undefined)
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
| **id** | [**string**] | 文件ID | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除文件成功 |  -  |
|**400** | 删除文件失败 |  -  |
|**403** | 未授权 |  -  |
|**404** | 文件不存在 |  -  |
|**500** | 服务器错误 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadControllerUploadFile**
> UploadControllerUploadFile201Response uploadControllerUploadFile()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let file: File; // (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let metadata: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.uploadControllerUploadFile(
    file,
    authorization,
    deviceId,
    deviceName,
    deviceType,
    metadata
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|
| **metadata** | [**string**] |  | (optional) defaults to undefined|


### Return type

**UploadControllerUploadFile201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 上传文件成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**403** | 权限不足 |  -  |
|**500** | 服务器错误 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerBatchCheckMembershipStatus**
> userControllerBatchCheckMembershipStatus()



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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 批量检查完成 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerCalculateCommission**
> UserControllerCalculateCommission201Response userControllerCalculateCommission(calculateCommissionDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CalculateCommissionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let calculateCommissionDto: CalculateCommissionDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerCalculateCommission(
    calculateCommissionDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **calculateCommissionDto** | **CalculateCommissionDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCalculateCommission201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 计算成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerChangePassword**
> userControllerChangePassword(changePasswordDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ChangePasswordDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let changePasswordDto: ChangePasswordDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerChangePassword(
    changePasswordDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changePasswordDto** | **ChangePasswordDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 修改成功 |  -  |
|**400** | 原密码错误 |  -  |
|**401** | 未授权 |  -  |

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

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCheckMembershipStatus200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 检查完成 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |
|**404** | 用户不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerCreate**
> UserControllerCreate201Response userControllerCreate(createUserDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createUserDto: CreateUserDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerCreate(
    createUserDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserDto** | **CreateUserDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**403** | 权限不足 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindAll**
> UserControllerFindAll200Response userControllerFindAll()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let username: string; // (optional) (default to undefined)
let keyword: string; //关键词 username or nickname (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerFindAll(
    page,
    limit,
    username,
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
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **username** | [**string**] |  | (optional) defaults to undefined|
| **keyword** | [**string**] | 关键词 username or nickname | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindOne**
> UserControllerFindOne200Response userControllerFindOne()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerFindOne200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 用户不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFollow**
> UserControllerLogout201Response userControllerFollow()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerLogout201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

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

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetFollowerCount200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerGetFollowers**
> UserControllerGetFollowers200Response userControllerGetFollowers()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let keyword: string; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetFollowers(
    id,
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
| **id** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **keyword** | [**string**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetFollowers200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerGetFollowingCount**
> UserControllerGetFollowingCount200Response userControllerGetFollowingCount()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetFollowingCount200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerGetFollowings**
> UserControllerGetFollowers200Response userControllerGetFollowings()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let page: number; //页码 (optional) (default to 1)
let limit: number; //每页数量 (optional) (default to 10)
let keyword: string; // (optional) (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetFollowings(
    id,
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
| **id** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **limit** | [**number**] | 每页数量 | (optional) defaults to 10|
| **keyword** | [**string**] |  | (optional) defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetFollowers200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

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

let days: number; // (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetSignInRecords(
    days,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **days** | [**number**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetSignInRecords200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerGetUserConfig**
> UserControllerGetUserCommissionConfig200Response userControllerGetUserConfig()



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

**UserControllerGetUserCommissionConfig200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 用户不存在 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

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

let page: number; // (default to undefined)
let limit: number; // (default to undefined)
let type: string; // (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerGetWalletTransactions(
    page,
    limit,
    type,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | defaults to undefined|
| **limit** | [**number**] |  | defaults to undefined|
| **type** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerGetWalletTransactions200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 获取成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerLogin**
> UserControllerLogin201Response userControllerLogin(loginDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    LoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let loginDto: LoginDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerLogin(
    loginDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginDto** | **LoginDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerLogin201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 登录成功，返回JWT token |  -  |
|**401** | 用户名/邮箱或密码错误 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerLogout**
> UserControllerLogout201Response userControllerLogout()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let deviceId: string; // (default to undefined)
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId2: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerLogout(
    deviceId,
    authorization,
    deviceId2,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deviceId** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId2** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerLogout201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRefreshToken**
> UserControllerRefreshToken201Response userControllerRefreshToken(userControllerRefreshTokenRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserControllerRefreshTokenRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let deviceId: string; // (default to undefined)
let userControllerRefreshTokenRequest: UserControllerRefreshTokenRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId2: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerRefreshToken(
    deviceId,
    userControllerRefreshTokenRequest,
    authorization,
    deviceId2,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userControllerRefreshTokenRequest** | **UserControllerRefreshTokenRequest**|  | |
| **deviceId** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId2** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerRefreshToken201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRegisterUser**
> UserControllerCreate201Response userControllerRegisterUser(createUserDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createUserDto: CreateUserDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerRegisterUser(
    createUserDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserDto** | **CreateUserDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 注册成功，返回用户信息 |  -  |
|**400** | 请求参数不合法 |  -  |
|**404** | 用户不存在 |  -  |
|**409** | 用户名已存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRemove**
> userControllerRemove()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 删除成功 |  -  |
|**401** | 未授权 |  -  |
|**404** | 用户不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerResetPassword**
> userControllerResetPassword()



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserControllerResetPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')
let userControllerResetPasswordRequest: UserControllerResetPasswordRequest; // (optional)

const { status, data } = await apiInstance.userControllerResetPassword(
    authorization,
    deviceId,
    deviceName,
    deviceType,
    userControllerResetPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userControllerResetPasswordRequest** | **UserControllerResetPasswordRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 重置成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**404** | 用户不存在 |  -  |
|**410** | 验证码已过期 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerSendVerificationCode**
> UserControllerLogout201Response userControllerSendVerificationCode(sendMailDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SendMailDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let sendMailDto: SendMailDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerSendVerificationCode(
    sendMailDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sendMailDto** | **SendMailDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerLogout201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 发送成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**404** | 用户不存在 |  -  |
|**429** | 请求过多 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerSetUserCommissionConfig**
> UserControllerSetUserCommissionConfig201Response userControllerSetUserCommissionConfig(userCommissionConfigDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserCommissionConfigDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userCommissionConfigDto: UserCommissionConfigDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerSetUserCommissionConfig(
    userCommissionConfigDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userCommissionConfigDto** | **UserCommissionConfigDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerSetUserCommissionConfig201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 设置成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerSignIn**
> userControllerSignIn()



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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**400** | 签到成功 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUnfollow**
> UserControllerLogout201Response userControllerUnfollow()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**UserControllerLogout201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdate**
> userControllerUpdate(updateUserDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)
let updateUserDto: UpdateUserDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdate(
    id,
    updateUserDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserDto** | **UpdateUserDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**404** | 用户不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateCommissionSettings**
> userControllerUpdateCommissionSettings()



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

const { status, data } = await apiInstance.userControllerUpdateCommissionSettings(
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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateNotificationSettings**
> userControllerUpdateNotificationSettings(updateUserNoticeDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateUserNoticeDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let updateUserNoticeDto: UpdateUserNoticeDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdateNotificationSettings(
    updateUserNoticeDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserNoticeDto** | **UpdateUserNoticeDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateProfileContact**
> object userControllerUpdateProfileContact(userControllerUpdateProfileContactRequest)

已实现邮箱验证，修改邮箱时需要传入验证码 手机验证等待实现

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserControllerUpdateProfileContactRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userControllerUpdateProfileContactRequest: UserControllerUpdateProfileContactRequest; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdateProfileContact(
    userControllerUpdateProfileContactRequest,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userControllerUpdateProfileContactRequest** | **UserControllerUpdateProfileContactRequest**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateUserConfig**
> userControllerUpdateUserConfig(updateUserConfigDto)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateUserConfigDto
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let updateUserConfigDto: UpdateUserConfigDto; //
let authorization: string; // (optional) (default to 'Bearer {{token}}')
let deviceId: string; // (optional) (default to '{{deviceId}}')
let deviceName: string; // (optional) (default to '{{deviceName}}')
let deviceType: string; // (optional) (default to '{{deviceType}}')

const { status, data } = await apiInstance.userControllerUpdateUserConfig(
    updateUserConfigDto,
    authorization,
    deviceId,
    deviceName,
    deviceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserConfigDto** | **UpdateUserConfigDto**|  | |
| **authorization** | [**string**] |  | (optional) defaults to 'Bearer {{token}}'|
| **deviceId** | [**string**] |  | (optional) defaults to '{{deviceId}}'|
| **deviceName** | [**string**] |  | (optional) defaults to '{{deviceName}}'|
| **deviceType** | [**string**] |  | (optional) defaults to '{{deviceType}}'|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 更新成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |
|**404** | 用户不存在 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerWithdrawWallet**
> userControllerWithdrawWallet()



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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 提现成功 |  -  |
|**400** | 请求参数错误 |  -  |
|**401** | 未授权 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


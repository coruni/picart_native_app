# i18n 文案对照表（key → 多语言）

> 生成时间：2026-11-27　｜　key 总数：337　｜　生成器：`scripts/gen-i18n-doc.py`（勿手改，重跑即可更新）

**响应里的 message 已改为直接返回 key**（用户 2026-11-27 指定），翻译由前端完成。
本文是后端维护的**权威对照表**，前端语言包以此为基准；文案变更只需重跑生成器。

占位符 `%s` / `%d` / `%.1f` 前端需自行替换（或后端后续提供带参接口）。

## 语言

| 代码 | 语言 | 状态 |
|---|---|---|
| en | English | ✅ 权威（`en.go`） |
| zh-CN | 简体中文 | ✅ 本文 |
| zh-TW | 繁體中文 | ✅ 本文 |
| ja | 日本語 | ✅ 本文 |
| ko | 한국어 | ✅ 本文 |

## achievement

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `achievement.code_exists` | Achievement code %s already exists | 成就编码已存在：%s | 成就編碼已存在：%s | 実績コードは既に存在します：%s | 업적 코드가 이미 존재합니다: %s |
| `achievement.created` | Achievement created | 成就已创建 | 成就已建立 | 実績を作成しました | 업적이 생성되었습니다 |
| `achievement.deleted` | Achievement deleted | 成就已删除 | 成就已刪除 | 実績を削除しました | 업적이 삭제되었습니다 |
| `achievement.granted` | Achievement granted | 成就已达成 | 成就已達成 | 実績を獲得しました | 업적이 달성되었습니다 |
| `achievement.not_available` | Achievement not found or not started | 成就不存在或未开始 | 成就不存在或未開始 | 実績が存在しないか開始されていません | 업적이 없거나 시작되지 않았습니다 |
| `achievement.not_completed` | Achievement is not completed yet | 成就条件尚未达成 | 成就條件尚未達成 | 実績の条件をまだ満たしていません | 업적 조건이 아직 충족되지 않았습니다 |
| `achievement.not_found` | Achievement not found | 成就不存在 | 成就不存在 | 実績が見つかりません | 업적을 찾을 수 없습니다 |
| `achievement.updated` | Achievement updated | 成就已更新 | 成就已更新 | 実績を更新しました | 업적이 수정되었습니다 |

## article

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `article.already_purchased` | You have already purchased this article | 已购买过该文章 | 已購買過該文章 | 既に購入済みです | 이미 구매한 게시글입니다 |
| `article.content_required` | Article content is required | 文章内容必填 | 文章內容必填 | 記事の内容は必須です | 게시글 내용은 필수입니다 |
| `article.content_required_mixed` | Content is required for mixed articles | 图文文章必须填写正文 | 圖文文章必須填寫正文 | mixed 記事は本文が必須です | 혼합 게시글은 본문이 필수입니다 |
| `article.created` | Article created | 文章已创建 | 文章已建立 | 記事を作成しました | 게시글이 생성되었습니다 |
| `article.delete_no_permission` | You do not have permission to delete this article | 没有删除该文章的权限 | 沒有刪除該文章的權限 | この記事を削除する権限がありません | 이 게시글을 삭제할 권한이 없습니다 |
| `article.deleted` | Article deleted | 文章已删除 | 文章已刪除 | 記事を削除しました | 게시글이 삭제되었습니다 |
| `article.featured` | Article featured | 文章已设为精华 | 文章已設為精華 | 記事を特集に設定しました | 게시글이 추천으로 설정되었습니다 |
| `article.featured_admin_only` | Only administrators can set featured articles | 仅管理员可设精华文章 | 僅管理員可設精華文章 | 特集記事の設定は管理者のみ可能です | 추천 게시글 설정은 관리자만 가능합니다 |
| `article.no_permission` | You do not have permission to modify this article | 没有修改该文章的权限 | 沒有修改該文章的權限 | この記事を修正する権限がありません | 이 게시글을 수정할 권한이 없습니다 |
| `article.not_found` | Article not found | 文章不存在 | 文章不存在 | 記事が見つかりません | 게시글을 찾을 수 없습니다 |
| `article.not_payable` | This article does not require payment | 该文章无需付费 | 該文章無需付費 | この記事は課金対象ではありません | 이 게시글은 결제가 필요하지 않습니다 |
| `article.not_published` | This article is not published yet | 文章尚未发布 | 文章尚未發佈 | 記事はまだ公開されていません | 게시글이 아직 발행되지 않았습니다 |
| `article.pinned` | Article pinned | 文章已置顶 | 文章已置頂 | 記事をピン留めしました | 게시글이 고정되었습니다 |
| `article.price_invalid` | Invalid article price | 文章价格无效 | 文章價格無效 | 記事の価格が無効です | 게시글 가격이 잘못되었습니다 |
| `article.require_follow` | Follow the author to read this article | 关注作者后可阅读该文章 | 關注作者後可閱讀該文章 | この記事を読むには作者のフォローが必要です | 이 게시글을 읽으려면 작성자를 팔로우하세요 |
| `article.require_login` | Please log in to read this article | 登录后可阅读该文章 | 登入後可閱讀該文章 | この記事を読むにはログインしてください | 이 게시글을 읽으려면 로그인하세요 |
| `article.require_membership` | Membership required to read this article | 会员可阅读该文章 | 會員可閱讀該文章 | この記事を読むにはメンバーシップが必要です | 이 게시글을 읽으려면 멤버십이 필요합니다 |
| `article.require_payment` | Purchase required to read this article | 购买后可阅读该文章 | 購買後可閱讀該文章 | この記事を読むには購入が必要です | 이 게시글을 읽으려면 구매가 필요합니다 |
| `article.status_invalid` | Invalid article status: %s | 无效的文章状态：%s | 無效的文章狀態：%s | 無効な記事ステータスです：%s | 잘못된 게시글 상태입니다: %s |
| `article.title_required` | Article title is required | 文章标题必填 | 文章標題必填 | 記事のタイトルは必須です | 게시글 제목은 필수입니다 |
| `article.unpinned` | Article unpinned | 文章已取消置顶 | 文章已取消置頂 | 記事のピン留めを解除しました | 게시글 고정이 해제되었습니다 |
| `article.updated` | Article updated | 文章已更新 | 文章已更新 | 記事を更新しました | 게시글이 수정되었습니다 |
| `article.video_url_required` | Video URL is required for video articles | 视频文章必须填写视频地址 | 影片文章必須填寫影片位址 | video 記事は動画 URL が必須です | 동영상 게시글은 동영상 URL이 필수입니다 |

## audit

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `audit.config_reloaded` | Audit configuration reloaded | 审核配置已重载 | 審核配置已重載 | 審査設定を再読込しました | 심사 설정이 다시 로드되었습니다 |
| `audit.handle_success` | Audit handled | 审核已处理 | 審核已處理 | 審査を処理しました | 심사가 처리되었습니다 |
| `audit.not_configured` | Content audit is not configured | 内容审核未配置 | 內容審核未配置 | コンテンツ審査が設定されていません | 콘텐츠 심사가 구성되지 않았습니다 |
| `audit.not_pending` | This article is not pending review | 该文章不在待审核状态 | 該文章不在待審核狀態 | この記事は審査待ちではありません | 해당 게시글은 심사 대기 상태가 아닙니다 |
| `audit.passed` | Content passed audit | 内容已通过审核 | 內容已通過審核 | コンテンツは審査を通過しました | 콘텐츠가 심사를 통과했습니다 |
| `audit.pending_review` | Content submitted for review | 内容已送审 | 內容已送審 | コンテンツを審査に提出しました | 콘텐츠가 심사에 제출되었습니다 |
| `audit.provider_none` | No audit provider configured | 未配置审核 provider | 未配置審核 provider | 審査プロバイダが設定されていません | 심사 provider가 구성되지 않았습니다 |
| `audit.record_not_found` | Audit record not found | 审核记录不存在 | 審核記錄不存在 | 審査記録が見つかりません | 심사 기록을 찾을 수 없습니다 |
| `audit.rejected` | Content rejected by audit | 内容未通过审核 | 內容未通過審核 | コンテンツが審査で拒否されました | 콘텐츠가 심사에서 거절되었습니다 |

## auth

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `auth.account_banned` | This account has been banned | 该账号已被封禁 | 該帳號已被封禁 | このアカウントは停止されています | 해당 계정은 정지되었습니다 |
| `auth.account_disabled` | This account has been disabled | 该账号已被禁用 | 該帳號已被停用 | このアカウントは無効化されています | 해당 계정은 비활성화되었습니다 |
| `auth.bad_credentials` | Incorrect username or password | 用户名或密码错误 | 使用者名稱或密碼錯誤 | ユーザー名またはパスワードが正しくありません | 사용자 이름 또는 비밀번호가 올바르지 않습니다 |
| `auth.captcha_invalid` | Invalid or expired verification code | 验证码无效或已过期 | 驗證碼無效或已過期 | 認証コードが無効または期限切れです | 인증 코드가 잘못되었거나 만료되었습니다 |
| `auth.captcha_send_failed` | Failed to send verification code | 验证码发送失败 | 驗證碼發送失敗 | 認証コードの送信に失敗しました | 인증 코드 전송에 실패했습니다 |
| `auth.captcha_sent` | Verification code sent | 验证码已发送 | 驗證碼已發送 | 認証コードを送信しました | 인증 코드를 전송했습니다 |
| `auth.captcha_too_frequent` | Please wait before requesting another code | 请稍候再请求验证码 | 請稍候再請求驗證碼 | しばらく待ってから再度コードを請求してください | 잠시 후 인증 코드를 다시 요청하세요 |
| `auth.device_id_required` | The device-id header is required | 缺少 Device-Id 请求头 | 缺少 Device-Id 請求頭 | Device-Id ヘッダーが必要です | Device-Id 헤더가 필요합니다 |
| `auth.device_limit` | Device limit reached, please log out from another device | 设备数已达上限，请先退出其他设备 | 裝置數已達上限，請先登出其他裝置 | 端末数が上限に達しました。他の端末からログアウトしてください | 기기 수가 최대치에 도달했습니다. 다른 기기에서 로그아웃하세요 |
| `auth.login_success` | Login successful | 登录成功 | 登入成功 | ログインしました | 로그인 성공 |
| `auth.logout_all_success` | Logged out from all devices | 已退出全部设备 | 已從全部裝置登出 | すべての端末からログアウトしました | 모든 기기에서 로그아웃되었습니다 |
| `auth.logout_success` | Logged out | 已退出登录 | 已登出 | ログアウトしました | 로그아웃되었습니다 |
| `auth.need_login` | Please log in first | 请先登录 | 請先登入 | 先にログインしてください | 먼저 로그인해 주세요 |
| `auth.new_password_too_short` | New password must be at least 8 characters | 新密码至少 8 个字符 | 新密碼至少 8 個字元 | 新しいパスワードは 8 文字以上必要です | 새 비밀번호는 8자 이상이어야 합니다 |
| `auth.oauth_binding_conflict` | This third-party account is already bound to another user | 该第三方账号已绑定其他用户 | 該第三方帳號已綁定其他使用者 | このサードパーティアカウントは既に他のユーザーに紐付いています | 해당 서드파티 계정은 이미 다른 사용자에게 연동되어 있습니다 |
| `auth.oauth_binding_not_found` | This third-party account is not bound to your profile | 该第三方账号未绑定到你的账户 | 該第三方帳號未綁定到你的賬戶 | このサードパーティアカウントはあなたのアカウントに紐付いていません | 해당 서드파티 계정은 내 계정에 연동되어 있지 않습니다 |
| `auth.oauth_failed` | Third-party login failed | 第三方登录失败 | 第三方登入失敗 | サードパーティログインに失敗しました | 서드파티 로그인에 실패했습니다 |
| `auth.oauth_failed_detail` | Third-party login failed: %s | 第三方登录失败：%s | 第三方登入失敗：%s | サードパーティログインに失敗しました：%s | 서드파티 로그인에 실패했습니다: %s |
| `auth.oauth_not_configured` | Third-party login is not configured | 第三方登录未配置 | 第三方登入未配置 | サードパーティログインが設定されていません | 서드파티 로그인이 구성되지 않았습니다 |
| `auth.oauth_reauth_required` | Your third-party session has expired, please sign in again | 第三方会话已过期，请重新登录 | 第三方會話已過期，請重新登入 | サードパーティセッションの有効期限が切れました。再度ログインしてください | 서드파티 세션이 만료되었습니다. 다시 로그인하세요 |
| `auth.oauth_scope_missing` | Required permission was not granted, please authorize again and allow profile access | 所需授权未授予，请重新授权并允许访问资料 | 所需授權未授予，請重新授權並允許存取資料 | 必要な権限が付与されていません。再認証してプロフィールへのアクセスを許可してください | 필요한 권한이 부여되지 않았습니다. 다시 인증하고 프로필 접근을 허용하세요 |
| `auth.oauth_state_invalid` | The login link has expired, please sign in again | 登录链接已过期，请重新登录 | 登入連結已過期，請重新登入 | ログインリンクの有効期限が切れました。再度ログインしてください | 로그인 링크가 만료되었습니다. 다시 로그인해 주세요 |
| `auth.oauth_token_forged` | Invalid third-party credentials | 第三方凭证无效 | 第三方憑證無效 | サードパーティの資格情報が無効です | 서드파티 자격 증명이 잘못되었습니다 |
| `auth.oauth_unbind_last_method` | This is your last way to sign in, please set a phone number or email before unbinding | 这是你最后一种登录方式，请先绑定手机号或邮箱再解绑 | 這是你最後一種登入方式，請先綁定手機號或郵箱再解綁 | これが最後のログイン方法です。解除する前に電話番号かメールアドレスを設定してください | 마지막 로그인 방법입니다. 해제하기 전에 전화번호나 이메일을 설정하세요 |
| `auth.old_password_wrong` | Current password is incorrect | 当前密码不正确 | 當前密碼不正確 | 現在のパスワードが正しくありません | 현재 비밀번호가 올바르지 않습니다 |
| `auth.password_changed` | Password changed successfully | 密码修改成功 | 密碼修改成功 | パスワードを変更しました | 비밀번호가 변경되었습니다 |
| `auth.password_mismatch` | Passwords do not match | 两次密码不一致 | 兩次密碼不一致 | パスワードが一致しません | 비밀번호가 일치하지 않습니다 |
| `auth.password_reset` | Password reset successful | 密码重置成功 | 密碼重置成功 | パスワードをリセットしました | 비밀번호가 재설정되었습니다 |
| `auth.password_too_short` | Password must be at least 6 characters | 密码至少 6 个字符 | 密碼至少 6 個字元 | パスワードは 6 文字以上必要です | 비밀번호는 6자 이상이어야 합니다 |
| `auth.perm_version_stale` | Permissions changed, please log in again | 权限已变更，请重新登录 | 權限已變更，請重新登入 | 権限が変更されました。再度ログインしてください | 권한이 변경되었습니다. 다시 로그인해 주세요 |
| `auth.refresh_expired` | Refresh token expired | 刷新令牌已过期 | 重新整理權杖已過期 | リフレッシュトークンの有効期限が切れました | 리프레시 토큰이 만료되었습니다 |
| `auth.refresh_invalid` | Invalid refresh token | 刷新令牌无效 | 重新整理權杖無效 | リフレッシュトークンが無効です | 리프레시 토큰이 잘못되었습니다 |
| `auth.register_success` | Registration successful | 注册成功 | 註冊成功 | 会員登録が完了しました | 회원가입이 완료되었습니다 |
| `auth.token_expired` | Token expired, please log in again | 登录已过期，请重新登录 | 登入已過期，請重新登入 | トークンの有効期限が切れました。再度ログインしてください | 토큰이 만료되었습니다. 다시 로그인해 주세요 |
| `auth.token_invalid` | Invalid token | 令牌无效 | 權杖無效 | トークンが無効です | 유효하지 않은 토큰입니다 |

## banner

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `banner.created` | Banner created | 轮播已创建 | 輪播已建立 | バナーを作成しました | 배너가 생성되었습니다 |
| `banner.deleted` | Banner deleted | 轮播已删除 | 輪播已刪除 | バナーを削除しました | 배너가 삭제되었습니다 |
| `banner.image_required` | Banner image is required | 轮播图片必填 | 輪播圖片必填 | バナー画像は必須です | 배너 이미지는 필수입니다 |
| `banner.not_found` | Banner not found | 轮播不存在 | 輪播不存在 | バナーが見つかりません | 배너를 찾을 수 없습니다 |
| `banner.title_required` | Banner title is required | 轮播标题必填 | 輪播標題必填 | バナータイトルは必須です | 배너 제목은 필수입니다 |
| `banner.updated` | Banner updated | 轮播已更新 | 輪播已更新 | バナーを更新しました | 배너가 수정되었습니다 |

## category

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `category.created` | Category created | 分类已创建 | 分類已建立 | カテゴリを作成しました | 카테고리가 생성되었습니다 |
| `category.deleted` | Category deleted | 分类已删除 | 分類已刪除 | カテゴリを削除しました | 카테고리가 삭제되었습니다 |
| `category.has_articles` | Category still has articles and cannot be deleted | 分类下仍有文章，不能删除 | 分類下仍有文章，不能刪除 | カテゴリに記事が残っているため削除できません | 카테고리에 게시글이 남아 있어 삭제할 수 없습니다 |
| `category.has_children` | Category still has subcategories; delete or move them first | 分类下仍有子分类，请先删除或移走 | 分類下仍有子分類，請先刪除或移走 | カテゴリに子カテゴリが残っています。先に削除または移動してください | 카테고리에 하위 카테고리가 있습니다. 먼저 삭제하거나 이동하세요 |
| `category.name_exists` | Category name %s already exists | 分类名已存在：%s | 分類名已存在：%s | カテゴリ名は既に存在します：%s | 카테고리 이름이 이미 존재합니다: %s |
| `category.name_required` | Category name is required | 分类名必填 | 分類名必填 | カテゴリ名は必須です | 카테고리 이름은 필수입니다 |
| `category.not_found` | Category not found | 分类不存在 | 分類不存在 | カテゴリが見つかりません | 카테고리를 찾을 수 없습니다 |
| `category.parent_not_found` | Parent category not found | 父分类不存在 | 父分類不存在 | 親カテゴリが見つかりません | 상위 카테고리를 찾을 수 없습니다 |
| `category.parent_self` | A category cannot be its own parent | 分类不能以自己为父级 | 分類不能以自己為父級 | 自分自身を親カテゴリにはできません | 자기 자신을 상위 카테고리로 지정할 수 없습니다 |
| `category.updated` | Category updated | 分类已更新 | 分類已更新 | カテゴリを更新しました | 카테고리가 수정되었습니다 |

## collection

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `collection.article_added` | Article added to collection | 文章已加入合集 | 文章已加入合集 | 記事をコレクションに追加しました | 게시글이 컬렉션에 추가되었습니다 |
| `collection.article_exists` | Article is already in this collection | 文章已在合集中 | 文章已在合集中 | 記事は既にコレクションに含まれています | 게시글이 이미 컬렉션에 있습니다 |
| `collection.article_removed` | Article removed from collection | 文章已移出合集 | 文章已移出合集 | 記事をコレクションから削除しました | 게시글이 컬렉션에서 제거되었습니다 |
| `collection.created` | Collection created | 合集已创建 | 合集已建立 | コレクションを作成しました | 컬렉션이 생성되었습니다 |
| `collection.deleted` | Collection deleted | 合集已删除 | 合集已刪除 | コレクションを削除しました | 컬렉션이 삭제되었습니다 |
| `collection.is_private` | This collection is private | 该合集是私密的 | 該合集是私密的 | このコレクションは非公開です | 이 컬렉션은 비공개입니다 |
| `collection.name_required` | Collection name is required | 合集名称必填 | 合集名稱必填 | コレクション名は必須です | 컬렉션 이름은 필수입니다 |
| `collection.no_permission` | You do not have permission to modify this collection | 没有修改该合集的权限 | 沒有修改該合集的權限 | このコレクションを修正する権限がありません | 이 컬렉션을 수정할 권한이 없습니다 |
| `collection.not_found` | Collection not found | 合集不存在 | 合集不存在 | コレクションが見つかりません | 컬렉션을 찾을 수 없습니다 |
| `collection.updated` | Collection updated | 合集已更新 | 合集已更新 | コレクションを更新しました | 컬렉션이 수정되었습니다 |

## comment

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `comment.content_required` | Comment content is required | 评论内容必填 | 評論內容必填 | コメントの内容は必須です | 댓글 내용은 필수입니다 |
| `comment.created` | Comment posted | 评论已发表 | 評論已發表 | コメントを投稿しました | 댓글이 게시되었습니다 |
| `comment.deleted` | Comment deleted | 评论已删除 | 評論已刪除 | コメントを削除しました | 댓글이 삭제되었습니다 |
| `comment.no_permission` | You do not have permission to modify this comment | 没有修改该评论的权限 | 沒有修改該評論的權限 | このコメントを修正する権限がありません | 이 댓글을 수정할 권한이 없습니다 |
| `comment.not_found` | Comment not found | 评论不存在 | 評論不存在 | コメントが見つかりません | 댓글을 찾을 수 없습니다 |
| `comment.pin_author_or_admin` | Only the article author or an administrator can pin comments | 仅文章作者或管理员可置顶评论 | 僅文章作者或管理員可置頂評論 | ピン留めは投稿者または管理者のみ可能です | 고정은 작성자 또는 관리자만 가능합니다 |
| `comment.pinned` | Comment pinned | 评论已置顶 | 評論已置頂 | コメントをピン留めしました | 댓글이 고정되었습니다 |
| `comment.unpinned` | Comment unpinned | 评论已取消置顶 | 評論已取消置頂 | コメントのピン留めを解除しました | 댓글 고정이 해제되었습니다 |

## common

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `common.already_exists` | %s already exists | %s 已存在 | %s 已存在 | %s は既に存在します | %s이(가) 이미 존재합니다 |
| `common.bad_request` | Invalid request | 请求无效 | 請求無效 | リクエストが無効です | 잘못된 요청입니다 |
| `common.conflict` | Resource conflict | 资源冲突 | 資源衝突 | リソースが競合しています | 리소스가 충돌합니다 |
| `common.created` | Created successfully | 创建成功 | 建立成功 | 作成しました | 생성되었습니다 |
| `common.deleted` | Deleted successfully | 删除成功 | 刪除成功 | 削除しました | 삭제되었습니다 |
| `common.dependency_unavailable` | Dependency service unavailable, please try again later | 依赖服务暂不可用，请稍后再试 | 依賴服務暫不可用，請稍後再試 | 依存サービスが一時的に利用できません。後でもう一度お試しください | 의존 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도하세요 |
| `common.expired` | %s has expired | %s 已过期 | %s 已過期 | %s は有効期限が切れています | %s이(가) 만료되었습니다 |
| `common.forbidden` | Permission denied | 没有权限 | 沒有權限 | 権限がありません | 권한이 없습니다 |
| `common.internal_error` | Internal server error | 服务器内部错误 | 伺服器內部錯誤 | サーバー内部エラーが発生しました | 서버 내부 오류가 발생했습니다 |
| `common.invalid_id` | Invalid ID: %s | ID 无效：%s | ID 無效：%s | IDが無効です：%s | 잘못된 ID입니다: %s |
| `common.invalid_param` | Invalid parameter: %s | 参数无效：%s | 參數無效：%s | パラメータが無効です：%s | 잘못된 매개변수입니다: %s |
| `common.invalid_parameter` | Invalid request parameter | 请求参数无效 | 請求參數無效 | リクエストパラメータが無効です | 요청 매개변수가 잘못되었습니다 |
| `common.missing_field` | Missing required field: %s | 缺少必填字段：%s | 缺少必填欄位：%s | 必須フィールドが不足しています：%s | 필수 필드가 누락되었습니다: %s |
| `common.not_allowed` | This operation is not allowed | 该操作不被允许 | 該操作不被允許 | この操作は許可されていません | 이 작업은 허용되지 않습니다 |
| `common.not_found` | Resource not found | 资源不存在 | 資源不存在 | リソースが見つかりません | 리소스를 찾을 수 없습니다 |
| `common.ok` | Success | 成功 | 成功 | 成功 | 성공 |
| `common.operation_failed` | Operation failed: %s | 操作失败：%s | 操作失敗：%s | 操作に失敗しました：%s | 작업에 실패했습니다: %s |
| `common.resource_in_use` | Resource is still in use | 资源使用中 | 資源使用中 | リソースは使用中です | 리소스가 사용 중입니다 |
| `common.reward_already_claimed` | Reward has already been claimed | 奖励已被领取 | 獎勵已被領取 | 報酬は既に受取済みです | 보상이 이미 수령되었습니다 |
| `common.too_many_requests` | Too many requests, please try again later | 请求过于频繁，请稍后再试 | 請求過於頻繁，請稍後再試 | リクエストが集中しています。しばらくしてから再度お試しください | 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요 |
| `common.unauthorized` | Unauthorized | 未登录 | 未登入 | 未ログインです | 로그인이 필요합니다 |
| `common.updated` | Updated successfully | 更新成功 | 更新成功 | 更新しました | 수정되었습니다 |
| `common.verify_code_expired` | Verification code expired | 验证码已过期 | 驗證碼已過期 | 認証コードの有効期限が切れました | 인증 코드가 만료되었습니다 |

## config

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `config.body_array_required` | Request body must be a config array | 请求体必须是配置数组 | 請求體必須是配置陣列 | リクエストボディは設定配列である必要があります | 요청 본문은 설정 배열이어야 합니다 |
| `config.cache_cleared` | Cache cleared | 缓存已清空 | 快取已清空 | キャッシュをクリアしました | 캐시가 지워졌습니다 |
| `config.created` | Configuration created | 配置已创建 | 配置已建立 | 設定を作成しました | 설정이 생성되었습니다 |
| `config.deleted` | Configuration deleted | 配置已删除 | 配置已刪除 | 設定を削除しました | 설정이 삭제되었습니다 |
| `config.group_not_found` | Configuration group %s not found | 配置分组不存在：%s | 配置分組不存在：%s | 設定グループが見つかりません：%s | 설정 그룹을 찾을 수 없습니다: %s |
| `config.key_exists` | Configuration key %s already exists | 配置键已存在：%s | 配置鍵已存在：%s | 設定キーは既に存在します：%s | 설정 키가 이미 존재합니다: %s |
| `config.key_required` | Configuration key is required | 配置键必填 | 配置鍵必填 | 設定キーは必須です | 설정 키는 필수입니다 |
| `config.list_empty` | Configuration list cannot be empty | 配置列表不能为空 | 配置列表不能為空 | 設定リストは空にできません | 설정 목록은 비워둘 수 없습니다 |
| `config.not_found` | Configuration not found | 配置不存在 | 配置不存在 | 設定が見つかりません | 설정을 찾을 수 없습니다 |
| `config.sensitive_batch_added` | Added %d sensitive words | 已添加 %d 个敏感词 | 已添加 %d 個敏感詞 | %d 件の NG ワードを追加しました | %d개의 민감 단어가 추가되었습니다 |
| `config.sensitive_batch_removed` | Removed %d sensitive words | 已删除 %d 个敏感词 | 已刪除 %d 個敏感詞 | %d 件の NG ワードを削除しました | %d개의 민감 단어가 삭제되었습니다 |
| `config.sensitive_word_added` | Sensitive word added | 敏感词已添加 | 敏感詞已添加 | NG ワードを追加しました | 민감 단어가 추가되었습니다 |
| `config.sensitive_word_empty` | Sensitive word cannot be empty | 敏感词不能为空 | 敏感詞不能為空 | NG ワードは空にできません | 민감 단어는 비워둘 수 없습니다 |
| `config.sensitive_word_not_found` | Sensitive word %s not found | 敏感词不存在：%s | 敏感詞不存在：%s | NG ワードが見つかりません：%s | 민감 단어를 찾을 수 없습니다: %s |
| `config.sensitive_word_removed` | Sensitive word removed | 敏感词已删除 | 敏感詞已刪除 | NG ワードを削除しました | 민감 단어가 삭제되었습니다 |
| `config.startup_only` | Configuration %s takes effect at startup only; change the environment variable and restart the service | 配置 %s 仅启动时生效；请改环境变量后重启服务 | 配置 %s 僅啟動時生效；請改環境變數後重啟服務 | 設定 %s は起動時のみ有効です。環境変数を変更してサービスを再起動してください | 설정 %s은 시작 시에만 적용됩니다. 환경 변수를 변경하고 서비스를 재시작하세요 |
| `config.startup_only_howto` | Configuration %s is startup-only (storage / search clients are initialized at service start); writing it to the database has no effect. Change the environment variable or config file and restart the service instead | 配置 %s 为启动期专用（存储/搜索客户端在启动时初始化）；写库无效，请改环境变量或配置文件后重启 | 配置 %s 為啟動期專用（儲存/搜尋客戶端在啟動時初始化）；寫庫無效，請改環境變數或配置檔案後重啟 | 設定 %s は起動時専用です（ストレージ/検索クライアントは起動時に初期化）。DB への書き込みは無効です。環境変数か設定ファイルを変更して再起動してください | 설정 %s은 시작 전용입니다(저장소/검색 클라이언트는 시작 시 초기화). DB 쓰기는 효과가 없습니다. 환경 변수나 설정 파일을 변경하고 재시작하세요 |
| `config.updated` | Configuration updated | 配置已更新 | 配置已更新 | 設定を更新しました | 설정이 수정되었습니다 |

## decoration

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `decoration.activity_ended` | Activity has ended | 活动已结束 | 活動已結束 | 活動は終了しました | 활동이 종료되었습니다 |
| `decoration.activity_name_required` | Activity name is required | 活动名称必填 | 活動名稱必填 | 活動名は必須です | 활동 이름은 필수입니다 |
| `decoration.activity_not_active` | Activity is not active | 活动未开始或已停用 | 活動未開始或已停用 | 活動が有効ではありません | 활동이 활성화되지 않았습니다 |
| `decoration.activity_not_found` | Activity not found | 活动不存在 | 活動不存在 | 活動が見つかりません | 활동을 찾을 수 없습니다 |
| `decoration.activity_not_joined` | You have not joined this activity | 未参加该活动 | 未參加該活動 | この活動に参加していません | 이 활동에 참여하지 않았습니다 |
| `decoration.activity_requirements_not_met` | Activity requirements are not met | 未满足活动条件 | 未滿足活動條件 | 活動の条件を満たしていません | 활동 조건을 충족하지 못했습니다 |
| `decoration.activity_reward_claimed` | Activity reward has already been claimed | 活动奖励已被领取 | 活動獎勵已被領取 | 活動報酬は既に受取済みです | 활동 보상이 이미 수령되었습니다 |
| `decoration.activity_reward_required` | Reward decoration is required | 奖励装饰品必填 | 獎勵裝飾品必填 | 報酬の装飾品は必須です | 보상 장식품은 필수입니다 |
| `decoration.already_owned` | You already own this decoration | 已拥有该装饰品 | 已擁有該裝飾品 | 既に所持しています | 이미 보유한 장식품입니다 |
| `decoration.cannot_gift_self` | You cannot gift a decoration to yourself | 不能赠送装饰品给自己 | 不能贈送裝飾品給自己 | 自分に装飾品を贈ることはできません | 자기 자신에게 장식품을 선물할 수 없습니다 |
| `decoration.equipped` | Decoration equipped | 装饰品已佩戴 | 裝飾品已佩戴 | 装飾品を装着しました | 장식품을 착용했습니다 |
| `decoration.expired` | This decoration has expired | 该装饰品已过期 | 該裝飾品已過期 | この装飾品は期限切れです | 해당 장식품이 만료되었습니다 |
| `decoration.name_required` | Decoration name is required | 装饰品名称必填 | 裝飾品名稱必填 | 装飾品名は必須です | 장식품 이름은 필수입니다 |
| `decoration.not_found` | Decoration not found | 装饰品不存在 | 裝飾品不存在 | 装飾品が見つかりません | 장식품을 찾을 수 없습니다 |
| `decoration.not_owned` | You do not own this decoration | 未拥有该装饰品 | 未擁有該裝飾品 | この装飾品を所持していません | 해당 장식품을 보유하지 않았습니다 |
| `decoration.not_purchasable` | This decoration cannot be purchased | 该装饰品不可购买 | 該裝飾品不可購買 | この装飾品は購入できません | 해당 장식품은 구매할 수 없습니다 |
| `decoration.recipient_already_owned` | The recipient already owns this decoration | 对方已拥有该装饰品 | 對方已擁有該裝飾品 | 相手は既にこの装飾品を所持しています | 상대방이 이미 해당 장식품을 보유하고 있습니다 |
| `decoration.type_required` | Decoration type is required | 装饰品类型必填 | 裝飾品類型必填 | 装飾品タイプは必須です | 장식품 유형은 필수입니다 |
| `decoration.unavailable` | This decoration is unavailable | 该装饰品不可用 | 該裝飾品不可用 | この装飾品は利用できません | 해당 장식품을 사용할 수 없습니다 |
| `decoration.unequipped` | Decoration unequipped | 装饰品已卸下 | 裝飾品已卸下 | 装飾品を解除しました | 장식품을 해제했습니다 |
| `decoration.wallet_unavailable` | Wallet service is not available | 钱包服务不可用 | 錢包服務不可用 | ウォレットサービスが利用できません | 지갑 서비스를 사용할 수 없습니다 |

## emoji

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `emoji.code_exists` | Emoji code already exists | 表情编码已存在 | 表情編碼已存在 | 絵文字コードは既に存在します | 이모티콘 코드가 이미 존재합니다 |
| `emoji.created` | Emoji created | 表情已创建 | 表情已建立 | 絵文字を作成しました | 이모티콘이 생성되었습니다 |
| `emoji.deleted` | Emoji deleted | 表情已删除 | 表情已刪除 | 絵文字を削除しました | 이모티콘이 삭제되었습니다 |
| `emoji.name_required` | Emoji name is required | 表情名称必填 | 表情名稱必填 | 絵文字名は必須です | 이모티콘 이름은 필수입니다 |
| `emoji.no_permission` | You can only manage your own emojis | 只能管理自己的表情 | 只能管理自己的表情 | 自分の絵文字のみ管理できます | 자신의 이모티콘만 관리할 수 있습니다 |
| `emoji.not_found` | Emoji not found | 表情不存在 | 表情不存在 | 絵文字が見つかりません | 이모티콘을 찾을 수 없습니다 |
| `emoji.not_in_pack` | Emoji is not in this pack | 表情不在此表情包中 | 表情不在此表情包中 | 絵文字はこのパックに含まれていません | 이모티콘이 이 팩에 없습니다 |
| `emoji.not_owned` | You do not own this emoji pack | 未拥有该表情包 | 未擁有該表情包 | この絵文字パックを所持していません | 해당 이모티콘 팩을 보유하지 않았습니다 |
| `emoji.pack_name_required` | Emoji pack name is required | 表情包名称必填 | 表情包名稱必填 | 絵文字パック名は必須です | 이모티콘 팩 이름은 필수입니다 |
| `emoji.pack_no_permission` | You can only manage your own emoji packs | 只能管理自己的表情包 | 只能管理自己的表情包 | 自分の絵文字パックのみ管理できます | 자신의 이모티콘 팩만 관리할 수 있습니다 |
| `emoji.pack_not_found` | Emoji pack not found | 表情包不存在 | 表情包不存在 | 絵文字パックが見つかりません | 이모티콘 팩을 찾을 수 없습니다 |
| `emoji.system_only_admin` | System emojis can only be managed by administrators | 系统表情仅管理员可管理 | 系統表情僅管理員可管理 | システム絵文字は管理者のみ管理できます | 시스템 이모티콘은 관리자만 관리할 수 있습니다 |
| `emoji.upload_not_available` | Emoji upload persistence is handled by the upload service and is not integrated yet; upload via POST /upload first, then create the emoji with the returned URL | 表情上传持久化由上传服务负责，尚未整合；请先 POST /upload 上传，再用返回的 URL 创建表情 | 表情上傳持久化由上傳服務負責，尚未整合；請先 POST /upload 上傳，再用返回的 URL 建立表情 | 絵文字アップロードの永続化はアップロードサービスが担当します。まず POST /upload でアップロードし、返された URL で絵文字を作成してください | 이모티콘 업로드 저장은 업로드 서비스가 담당합니다. 먼저 POST /upload로 업로드한 후 반환된 URL로 생성하세요 |
| `emoji.url_required` | Emoji image URL is required | 表情图片地址必填 | 表情圖片位址必填 | 絵文字の画像 URL は必須です | 이모티콘 이미지 URL은 필수입니다 |

## interaction

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `interaction.already_done` | Already done | 重复操作 | 重複操作 | 既に実行済みです | 이미 처리되었습니다 |
| `interaction.favorited` | Added to favorites | 已收藏 | 已收藏 | お気に入りに追加しました | 즐겨찾기에 추가했습니다 |
| `interaction.liked` | Liked | 已点赞 | 已點讚 | いいねしました | 좋아요했습니다 |
| `interaction.not_done` | Not done yet | 尚未执行该操作 | 尚未執行該操作 | まだ実行されていません | 아직 처리되지 않았습니다 |
| `interaction.unfavorited` | Removed from favorites | 已取消收藏 | 已取消收藏 | お気に入りを解除しました | 즐겨찾기가 해제되었습니다 |
| `interaction.unliked` | Like removed | 已取消点赞 | 已取消點讚 | いいねを取り消しました | 좋아요가 취소되었습니다 |
| `interaction.view_not_found` | View history record not found | 浏览记录不存在 | 瀏覽記錄不存在 | 閲覧履歴が見つかりません | 열람 기록을 찾을 수 없습니다 |

## invite

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `invite.code_expired` | Invitation code has expired | 邀请码已过期 | 邀請碼已過期 | 招待コードの有効期限が切れました | 초대 코드가 만료되었습니다 |
| `invite.code_generate_failed` | Failed to generate invitation code | 生成邀请码失败 | 產生邀請碼失敗 | 招待コードの生成に失敗しました | 초대 코드 생성에 실패했습니다 |
| `invite.code_invalid` | Invalid invitation code | 邀请码无效 | 邀請碼無效 | 招待コードが無効です | 초대 코드가 잘못되었습니다 |
| `invite.code_used` | Invitation code has already been used | 邀请码已被使用 | 邀請碼已被使用 | 招待コードは既に使用されています | 초대 코드가 이미 사용되었습니다 |
| `invite.commission_not_found` | Commission record not found | 佣金记录不存在 | 佣金記錄不存在 | コミッション記録が見つかりません | 커미션 기록을 찾을 수 없습니다 |
| `invite.created` | Invitation code created | 邀请码已生成 | 邀請碼已產生 | 招待コードを作成しました | 초대 코드가 생성되었습니다 |
| `invite.not_found` | Invitation not found | 邀请不存在 | 邀請不存在 | 招待が見つかりません | 초대를 찾을 수 없습니다 |
| `invite.reward_granted` | Invitation reward granted | 邀请奖励已发放 | 邀請獎勵已發放 | 招待報酬を付与しました | 초대 보상이 지급되었습니다 |

## membership

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `membership.duplicated` | Membership is still active, no need to renew | 会员仍在有效期内，无需续费 | 會員仍在有效期內，無需續費 | メンバーシップはまだ有効です。更新は不要です | 멤버십이 아직 유효합니다. 갱신이 필요 없습니다 |
| `membership.duration_invalid` | Invalid membership duration (1-120 months) | 会员时长无效（1-120 个月） | 會員時長無效（1-120 個月） | メンバーシップ期間が無効です（1〜120 ヶ月） | 멤버십 기간이 잘못되었습니다(1-120개월) |
| `membership.lifetime_active` | You are already a lifetime member | 你已是终身会员 | 你已是終身會員 | 既に永久メンバーです | 이미 평생 회원입니다 |
| `membership.plan_invalid` | Invalid membership plan | 无效的会员方案 | 無效的會員方案 | 無効なメンバーシッププランです | 잘못된 멤버십 플랜입니다 |

## message

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `message.action_invalid` | action must be one of: read/delete | action 必须是 read 或 delete | action 必須是 read 或 delete | action は read または delete である必要があります | action은 read 또는 delete여야 합니다 |
| `message.batch_forbidden` | You do not have permission to operate on some of the messages | 对部分消息没有操作权限 | 對部分訊息沒有操作權限 | 一部のメッセージに対する操作権限がありません | 일부 메시지에 대한 작업 권한이 없습니다 |
| `message.blacklisted` | Cannot send: you or the recipient has blocked the other party | 无法发送：你或对方已拉黑对方 | 無法發送：你或對方已拉黑對方 | 送信できません：あなたか相手がブロックしています | 전송 불가: 나 또는 상대가 차단했습니다 |
| `message.block_self` | You cannot block yourself | 不能拉黑自己 | 不能拉黑自己 | 自分をブロックできません | 자기 자신을 차단할 수 없습니다 |
| `message.broadcast_forbidden` | You do not have permission to send broadcast messages | 无权发送广播消息 | 無權發送廣播訊息 | ブロードキャストを送信する権限がありません | 브로드캐스트 메시지를 보낼 권한이 없습니다 |
| `message.cannot_send_self` | You cannot send a message to yourself | 不能给自己发消息 | 不能給自己發訊息 | 自分にメッセージを送ることはできません | 자기 자신에게 메시지를 보낼 수 없습니다 |
| `message.content_empty` | Message content cannot be empty | 消息内容不能为空 | 訊息內容不能為空 | メッセージ内容は空にできません | 메시지 내용은 비워둘 수 없습니다 |
| `message.delete_forbidden` | You do not have permission to delete this message | 无权删除该消息 | 無權刪除該訊息 | このメッセージを削除する権限がありません | 이 메시지를 삭제할 권한이 없습니다 |
| `message.deleted` | Message deleted | 消息已删除 | 訊息已刪除 | メッセージを削除しました | 메시지가 삭제되었습니다 |
| `message.ids_required` | message_ids cannot be empty | message_ids 不能为空 | message_ids 不能為空 | message_ids は空にできません | message_ids는 비워둘 수 없습니다 |
| `message.kind_invalid` | message_kind must be one of: text/image/file/card | message_kind 必须是 text/image/file/card | message_kind 必須是 text/image/file/card | message_kind は text/image/file/card のいずれかである必要があります | message_kind은 text/image/file/card 중 하나여야 합니다 |
| `message.marked_read` | Marked as read | 已标记为已读 | 已標記為已讀 | 既読にしました | 읽음으로 표시되었습니다 |
| `message.not_found` | Message not found | 消息不存在 | 訊息不存在 | メッセージが見つかりません | 메시지를 찾을 수 없습니다 |
| `message.payload_card` | Card message payload must contain title and description | 卡片消息 payload 必须包含 title 和 description | 卡片訊息 payload 必須包含 title 和 description | カードメッセージのペイロードには title と description が必要です | 카드 메시지 페이로드에는 title과 description이 필요합니다 |
| `message.payload_file` | File message payload must contain url and name | 文件消息 payload 必须包含 url 和 name | 檔案訊息 payload 必須包含 url 和 name | ファイルメッセージのペイロードには url と name が必要です | 파일 메시지 페이로드에는 url과 name이 필요합니다 |
| `message.payload_image` | Image message payload must contain url or urls | 图片消息 payload 必须包含 url 或 urls | 圖片訊息 payload 必須包含 url 或 urls | 画像メッセージのペイロードには url または urls が必要です | 이미지 메시지 페이로드에는 url 또는 urls가 필요합니다 |
| `message.payload_required` | Non-text messages must provide a payload | 非文本消息必须提供 payload | 非文字訊息必須提供 payload | テキスト以外のメッセージにはペイロードが必要です | 텍스트가 아닌 메시지는 페이로드가 필요합니다 |
| `message.recall_forbidden` | You do not have permission to recall this message | 无权撤回该消息 | 無權撤回該訊息 | このメッセージを取り消す権限がありません | 이 메시지를 취소할 권한이 없습니다 |
| `message.receiver_not_found` | Recipient not found | 接收者不存在 | 接收者不存在 | 受信者が見つかりません | 수신자를 찾을 수 없습니다 |
| `message.receiver_required` | Receiver list cannot be empty | 接收者列表不能为空 | 接收者列表不能為空 | 受信者リストは空にできません | 수신자 목록은 비워둘 수 없습니다 |
| `message.sent` | Message sent | 消息已发送 | 訊息已發送 | メッセージを送信しました | 메시지를 전송했습니다 |
| `message.session_failed` | Failed to create conversation | 创建会话失败 | 建立會話失敗 | 会話の作成に失敗しました | 대화 생성에 실패했습니다 |
| `message.text_required` | Text message content cannot be empty | 文本消息内容不能为空 | 文字訊息內容不能為空 | テキストメッセージの内容は空にできません | 텍스트 메시지 내용은 비워둘 수 없습니다 |
| `message.update_forbidden` | You do not have permission to modify this message | 无权修改该消息 | 無權修改該訊息 | このメッセージを修正する権限がありません | 이 메시지를 수정할 권한이 없습니다 |
| `message.view_forbidden` | You do not have permission to view this message | 无权查看该消息 | 無權查看該訊息 | このメッセージを表示する権限がありません | 이 메시지를 볼 권한이 없습니다 |

## order

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `order.already_paid` | Order has already been paid | 订单已支付 | 訂單已支付 | 注文は既に支払い済みです | 주문이 이미 결제되었습니다 |
| `order.cancelled` | Order cancelled | 订单已取消 | 訂單已取消 | 注文をキャンセルしました | 주문이 취소되었습니다 |
| `order.created` | Order created | 订单已创建 | 訂單已建立 | 注文を作成しました | 주문이 생성되었습니다 |
| `order.no_permission` | You do not have permission to access this order | 没有访问该订单的权限 | 沒有存取該訂單的權限 | この注文にアクセスする権限がありません | 이 주문에 접근할 권한이 없습니다 |
| `order.not_found` | Order not found | 订单不存在 | 訂單不存在 | 注文が見つかりません | 주문을 찾을 수 없습니다 |
| `order.not_pending` | Order is not in pending status | 订单不在待支付状态 | 訂單不在待支付狀態 | 注文は支払い待ち状態ではありません | 주문이 결제 대기 상태가 아닙니다 |
| `order.paid` | Payment successful | 支付成功 | 支付成功 | 支払いが完了しました | 결제가 완료되었습니다 |
| `order.status_invalid` | Invalid order status: %s | 无效的订单状态：%s | 無效的訂單狀態：%s | 無効な注文ステータスです：%s | 잘못된 주문 상태입니다: %s |

## payment

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `payment.alipay_create_failed` | Failed to create Alipay payment: %s | 创建支付宝支付失败：%s | 建立支付寶支付失敗：%s | Alipay 決済の作成に失敗しました：%s | Alipay 결제 생성에 실패했습니다: %s |
| `payment.alipay_pubkey_load_failed` | Failed to load Alipay public key: %s | 加载支付宝公钥失败：%s | 載入支付寶公鑰失敗：%s | Alipay 公開鍵の読み込みに失敗しました：%s | Alipay 공개키 로드에 실패했습니다: %s |
| `payment.alipay_sdk_init_failed` | Failed to initialize Alipay SDK: %s | 支付宝 SDK 初始化失败：%s | 支付寶 SDK 初始化失敗：%s | Alipay SDK の初期化に失敗しました：%s | Alipay SDK 초기화에 실패했습니다: %s |
| `payment.channel_disabled` | This payment channel is disabled | 该支付渠道已停用 | 該支付渠道已停用 | この決済チャネルは無効です | 해당 결제 채널이 비활성화되었습니다 |
| `payment.config_missing` | Payment channel is not configured | 支付渠道未配置 | 支付渠道未配置 | 決済チャネルが設定されていません | 결제 채널이 구성되지 않았습니다 |
| `payment.not_supported` | Payment method not supported: %s | 不支持的支付方式：%s | 不支持的支付方式：%s | サポートされていない決済方法です：%s | 지원되지 않는 결제 수단입니다: %s |
| `payment.notify_failed` | Failed: %s | 失败：%s | 失敗：%s | 失敗しました：%s | 실패: %s |
| `payment.notify_success` | Success | 成功 | 成功 | 成功 | 성공 |
| `payment.record_not_found` | Payment record not found | 支付记录不存在 | 支付記錄不存在 | 決済記録が見つかりません | 결제 기록을 찾을 수 없습니다 |
| `payment.refunded` | Refunded | 已退款 | 已退款 | 返金しました | 환불되었습니다 |
| `payment.signature_invalid` | Invalid payment signature | 支付签名无效 | 支付簽名無效 | 決済署名が無効です | 결제 서명이 잘못되었습니다 |
| `payment.wechat_create_failed` | Failed to create WeChat payment: %s | 创建微信支付失败：%s | 建立微信支付失敗：%s | WeChat 決済の作成に失敗しました：%s | WeChat 결제 생성에 실패했습니다: %s |

## permission

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `permission.assigned` | Permissions assigned | 权限已分配 | 權限已分配 | 権限を割り当てました | 권한이 할당되었습니다 |
| `permission.in_use` | Permission is still referenced by roles and cannot be deleted | 权限仍被角色引用，不能删除 | 權限仍被角色引用，不能刪除 | 権限はロールから参照されているため削除できません | 권한이 역할에서 참조 중이므로 삭제할 수 없습니다 |
| `permission.name_exists` | Permission name already exists | 权限名已存在 | 權限名已存在 | 権限名は既に存在します | 권한 이름이 이미 존재합니다 |
| `permission.not_found` | Permission not found | 权限点不存在 | 權限點不存在 | 権限が見つかりません | 권한을 찾을 수 없습니다 |

## points

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `points.account_create_failed` | Failed to create points account | 创建积分账户失败 | 建立積分賬戶失敗 | ポイント口座の作成に失敗しました | 포인트 계정 생성에 실패했습니다 |
| `points.activity_not_found` | Points activity not found | 积分活动不存在 | 積分活動不存在 | ポイント活動が見つかりません | 포인트 활동을 찾을 수 없습니다 |
| `points.already_signed_in` | Already signed in today | 今天已签到 | 今天已簽到 | 本日は既にチェックイン済みです | 오늘은 이미 출석체크했습니다 |
| `points.amount_invalid` | Points amount must be greater than 0 | 积分数额必须大于 0 | 積分數額必須大於 0 | ポイント数は 0 より大きい必要があります | 포인트 수량은 0보다 커야 합니다 |
| `points.config_not_found` | Points configuration not found | 积分配置不存在 | 積分配置不存在 | ポイント設定が見つかりません | 포인트 설정을 찾을 수 없습니다 |
| `points.daily_limit_reached` | Daily limit reached for this activity | 已达该活动每日上限 | 已達該活動每日上限 | この活動の 1 日上限に達しました | 이 활동의 일일 한도에 도달했습니다 |
| `points.insufficient` | Insufficient points | 积分不足 | 積分不足 | ポイントが不足しています | 포인트가 부족합니다 |
| `points.record_not_found` | Points record not found | 积分记录不存在 | 積分記錄不存在 | ポイント記録が見つかりません | 포인트 기록을 찾을 수 없습니다 |
| `points.sign_in_success` | Signed in, +%d points | 签到成功，+%d 积分 | 簽到成功，+%d 積分 | チェックインしました。+%d ポイント | 출석 완료, +%d 포인트 |
| `points.task_not_completed` | Task is not completed yet | 任务尚未完成 | 任務尚未完成 | タスクがまだ完了していません | 작업이 아직 완료되지 않았습니다 |
| `points.total_limit_reached` | Total limit reached for this activity | 已达该活动总上限 | 已達該活動總上限 | この活動の累計上限に達しました | 이 활동의 총 한도에 도달했습니다 |

## report

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `report.already_handled` | Report has already been handled | 举报已被处理 | 舉報已被處理 | 通報は既に処理済みです | 신고가 이미 처리되었습니다 |
| `report.already_submitted` | You have already reported this content | 已举报过该内容 | 已舉報過該內容 | 既に通報済みです | 이미 신고한 콘텐츠입니다 |
| `report.created` | Report submitted | 举报已提交 | 舉報已提交 | 通報を提出しました | 신고가 접수되었습니다 |
| `report.handled` | Report handled | 举报已处理 | 舉報已處理 | 通報を処理しました | 신고가 처리되었습니다 |
| `report.invalid_column` | Invalid statistic column | 无效的统计字段 | 無效的統計欄位 | 無効な統計フィールドです | 잘못된 통계 필드입니다 |
| `report.not_found` | Report not found | 举报不存在 | 舉報不存在 | 通報が見つかりません | 신고를 찾을 수 없습니다 |
| `report.reason_required` | Report reason is required | 举报原因必填 | 舉報原因必填 | 通報理由は必須です | 신고 사유는 필수입니다 |
| `report.target_invalid` | Invalid report target | 无效的举报对象 | 無效的舉報對象 | 無効な通報対象です | 잘못된 신고 대상입니다 |

## role

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `role.created` | Role created | 角色已创建 | 角色已建立 | ロールを作成しました | 역할이 생성되었습니다 |
| `role.deleted` | Role deleted | 角色已删除 | 角色已刪除 | ロールを削除しました | 역할이 삭제되었습니다 |
| `role.in_use` | Role is assigned to users and cannot be deleted | 角色已分配给用户，不能删除 | 角色已分配給使用者，不能刪除 | ロールはユーザーに割り当て済みのため削除できません | 역할이 사용자에게 할당되어 삭제할 수 없습니다 |
| `role.is_system` | Built-in system roles cannot be deleted | 系统内置角色不能删除 | 系統內置角色不能刪除 | システム組み込みロールは削除できません | 시스템 내장 역할은 삭제할 수 없습니다 |
| `role.name_exists` | Role name %s already exists | 角色名已存在：%s | 角色名已存在：%s | ロール名は既に存在します：%s | 역할 이름이 이미 존재합니다: %s |
| `role.no_permission` | You do not have permission for this operation | 没有该操作的权限 | 沒有該操作的權限 | この操作の権限がありません | 이 작업에 대한 권한이 없습니다 |
| `role.not_found` | Role not found | 角色不存在 | 角色不存在 | ロールが見つかりません | 역할을 찾을 수 없습니다 |
| `role.updated` | Role updated | 角色已更新 | 角色已更新 | ロールを更新しました | 역할이 수정되었습니다 |

## search

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `search.disabled` | Search is disabled | 搜索功能已关闭 | 搜尋功能已關閉 | 検索機能は無効です | 검색 기능이 비활성화되었습니다 |
| `search.failed` | Search failed: %s | 搜索失败：%s | 搜尋失敗：%s | 検索に失敗しました：%s | 검색에 실패했습니다: %s |
| `search.index_cleared` | Search index cleared | 搜索索引已清空 | 搜尋索引已清空 | 検索インデックスをクリアしました | 검색 인덱스가 초기화되었습니다 |
| `search.init_failed` | Failed to initialize Elasticsearch: %s | Elasticsearch 初始化失败：%s | Elasticsearch 初始化失敗：%s | Elasticsearch の初期化に失敗しました：%s | Elasticsearch 초기화에 실패했습니다: %s |
| `search.keyword_required` | Search keyword is required | 搜索关键字必填 | 搜尋關鍵字必填 | 検索キーワードは必須です | 검색 키워드는 필수입니다 |
| `search.not_configured` | Search service is not configured | 搜索服务未配置 | 搜尋服務未配置 | 検索サービスが設定されていません | 검색 서비스가 구성되지 않았습니다 |
| `search.synced` | Synced %d articles to Elasticsearch | 已同步 %d 篇文章到 Elasticsearch | 已同步 %d 篇文章到 Elasticsearch | %d 件の記事を Elasticsearch に同期しました | %d개의 게시글을 Elasticsearch에 동기화했습니다 |

## stats

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `stats.invalid_range` | Invalid date range | 无效的日期范围 | 無效的日期範圍 | 無効な日付範囲です | 잘못된 날짜 범위입니다 |
| `stats.not_found` | Statistics not found | 统计不存在 | 統計不存在 | 統計が見つかりません | 통계를 찾을 수 없습니다 |

## tag

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `tag.already_followed` | You are already following this tag | 已关注该标签 | 已關注該標籤 | 既にフォローしています | 이미 팔로우 중인 태그입니다 |
| `tag.created` | Tag created | 标签已创建 | 標籤已建立 | タグを作成しました | 태그가 생성되었습니다 |
| `tag.deleted` | Tag deleted | 标签已删除 | 標籤已刪除 | タグを削除しました | 태그가 삭제되었습니다 |
| `tag.name_exists` | Tag name %s already exists | 标签名已存在：%s | 標籤名已存在：%s | タグ名は既に存在します：%s | 태그 이름이 이미 존재합니다: %s |
| `tag.name_required` | Tag name is required | 标签名必填 | 標籤名必填 | タグ名は必須です | 태그 이름은 필수입니다 |
| `tag.not_followed` | You are not following this tag | 未关注该标签 | 未關注該標籤 | フォローしていません | 팔로우하지 않았습니다 |
| `tag.not_found` | Tag not found | 标签不存在 | 標籤不存在 | タグが見つかりません | 태그를 찾을 수 없습니다 |

## upload

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `upload.deleted` | Upload deleted | 上传记录已删除 | 上傳記錄已刪除 | アップロードを削除しました | 업로드가 삭제되었습니다 |
| `upload.file_too_large` | File too large: %.1fMB exceeds the %dMB limit | 文件过大：%.1fMB 超过 %dMB 限制 | 檔案過大：%.1fMB 超過 %dMB 限制 | ファイルが大きすぎます：%.1fMB は %dMB の上限を超えています | 파일이 너무 큽니다: %.1fMB가 %dMB 제한을 초과합니다 |
| `upload.invalid_content` | File content is not a valid %s file | 文件内容不是有效的 %s 文件 | 檔案內容不是有效的 %s 檔案 | ファイルの内容は有効な %s ファイルではありません | 파일 내용이 유효한 %s 파일이 아닙니다 |
| `upload.metadata_invalid` | metadata must be a valid JSON array | metadata 必须是合法的 JSON 数组 | metadata 必須是合法的 JSON 陣列 | metadata は有効な JSON 配列である必要があります | metadata는 유효한 JSON 배열이어야 합니다 |
| `upload.migration_done` | Migration finished: %d processed, %d skipped, %d failed | 迁移完成：%d 处理，%d 跳过，%d 失败 | 遷移完成：%d 處理，%d 跳過，%d 失敗 | 移行完了：%d 件処理、%d 件スキップ、%d 件失敗 | 마이그레이션 완료: %d 처리, %d 건너뜀, %d 실패 |
| `upload.mime_mismatch` | File content does not match the declared type: %s | 文件内容与声明类型不符：%s | 檔案內容與宣告類型不符：%s | ファイルの内容が宣言された型と一致しません：%s | 파일 내용이 선언된 형식과 일치하지 않습니다: %s |
| `upload.multipart_required` | Please upload with multipart/form-data | 请使用 multipart/form-data 方式上传 | 請使用 multipart/form-data 方式上傳 | multipart/form-data でアップロードしてください | multipart/form-data로 업로드해 주세요 |
| `upload.no_file` | No file provided | 未提供文件 | 未提供檔案 | ファイルが提供されていません | 파일이 제공되지 않았습니다 |
| `upload.not_found` | Upload not found | 上传记录不存在 | 上傳記錄不存在 | アップロードが見つかりません | 업로드를 찾을 수 없습니다 |
| `upload.presign_failed` | Failed to generate upload URL | 生成上传 URL 失败 | 產生上傳 URL 失敗 | アップロード URL の生成に失敗しました | 업로드 URL 생성에 실패했습니다 |
| `upload.presign_fields_required` | filename, contentType and size are required | filename、contentType、size 为必填 | filename、contentType、size 為必填 | filename・contentType・size は必須です | filename, contentType, size은 필수입니다 |
| `upload.read_failed` | Failed to read uploaded file | 读取上传文件失败 | 讀取上傳檔案失敗 | アップロードファイルの読み取りに失敗しました | 업로드 파일 읽기에 실패했습니다 |
| `upload.save_failed` | Failed to save file | 保存文件失败 | 儲存檔案失敗 | ファイルの保存に失敗しました | 파일 저장에 실패했습니다 |
| `upload.scene_invalid` | Invalid upload scene: %s | 无效的上传场景：%s | 無效的上傳場景：%s | 無効なアップロードシーンです：%s | 잘못된 업로드 씬입니다: %s |
| `upload.success` | Upload successful | 上传成功 | 上傳成功 | アップロードに成功しました | 업로드에 성공했습니다 |
| `upload.too_many_files` | Too many files: maximum %d per request | 文件过多：每次最多 %d 个 | 檔案過多：每次最多 %d 個 | ファイルが多すぎます：1 回のリクエストは最大 %d 件です | 파일이 너무 많습니다: 요청당 최대 %d개 |
| `upload.type_not_allowed` | File type not allowed: %s | 文件类型不允许：%s | 檔案類型不允許：%s | 許可されていないファイル形式です：%s | 허용되지 않는 파일 형식입니다: %s |

## user

| key | en | zh-CN | zh-TW | ja | ko |
|---|---|---|---|---|---|
| `user.account_deleted` | This account has been deleted | 该账号已注销 | 該帳號已註銷 | このアカウントは退会済みです | 해당 계정은 탈퇴되었습니다 |
| `user.already_exists` | User already exists | 用户已存在 | 使用者已存在 | ユーザーは既に存在します | 사용자가 이미 존재합니다 |
| `user.already_followed` | You are already following this user | 已关注该用户 | 已關注該使用者 | 既にフォローしています | 이미 팔로우 중입니다 |
| `user.avatar_updated` | Avatar updated | 头像已更新 | 頭像已更新 | アバターを更新しました | 아바타가 수정되었습니다 |
| `user.cannot_follow_self` | You cannot follow yourself | 不能关注自己 | 不能關注自己 | 自分自身をフォローできません | 자기 자신을 팔로우할 수 없습니다 |
| `user.certification_exists` | A certification is already pending or approved | 已有待审核或已通过的认证 | 已有待審核或已通過的認證 | 審査待ちまたは承認済みの認証が既にあります | 이미 심사 대기 또는 승인된 인증이 있습니다 |
| `user.certification_not_found` | Certification record not found | 认证记录不存在 | 認證記錄不存在 | 認証記録が見つかりません | 인증 기록을 찾을 수 없습니다 |
| `user.certification_not_pending` | This certification is not pending review | 该认证不在待审核状态 | 該認證不在待審核狀態 | この認証は審査待ちではありません | 해당 인증은 심사 대기 상태가 아닙니다 |
| `user.certification_passed` | Certification approved | 认证已通过 | 認證已通過 | 認証が承認されました | 인증이 승인되었습니다 |
| `user.certification_rejected` | Certification rejected: %s | 认证被拒绝：%s | 認證被拒絕：%s | 認証が却下されました：%s | 인증이 거절되었습니다: %s |
| `user.certification_submit` | Certification submitted, pending review | 认证已提交，待审核 | 認證已提交，待審核 | 認証を提出しました。審査待ちです | 인증이 제출되어 심사 대기 중입니다 |
| `user.commission_type_unknown` | Unknown commission type | 未知的佣金类型 | 未知的佣金類型 | 不明なコミッション種類です | 알 수 없는 커미션 유형입니다 |
| `user.deletion_not_pending` | No pending account deletion request | 没有待处理的注销申请 | 沒有待處理的註銷申請 | 処理待ちの退会申請はありません | 처리 대기 중인 탈퇴 신청이 없습니다 |
| `user.deletion_pending` | Account deletion already requested and is in the cooling-off period | 注销申请已在冷静期内 | 註銷申請已在冷靜期內 | 退会申請はクーリングオフ期間中です | 탈퇴 신청이 유예 기간 중입니다 |
| `user.email_exists` | This email is already registered | 该邮箱已被注册 | 該郵箱已被註冊 | このメールアドレスは既に登録されています | 이 이메일은 이미 등록되어 있습니다 |
| `user.followed` | Followed | 已关注 | 已關注 | フォローしました | 팔로우했습니다 |
| `user.not_following` | You are not following this user | 未关注该用户 | 未關注該使用者 | フォローしていません | 팔로우하지 않았습니다 |
| `user.not_found` | User not found | 用户不存在 | 使用者不存在 | ユーザーが見つかりません | 사용자를 찾을 수 없습니다 |
| `user.password_too_weak` | Password must be at least 8 characters | 密码至少 8 个字符 | 密碼至少 8 個字元 | パスワードは 8 文字以上必要です | 비밀번호는 8자 이상이어야 합니다 |
| `user.phone_exists` | This phone number is already registered | 该手机号已被注册 | 該手機號已被註冊 | この電話番号は既に登録されています | 이 전화번호는 이미 등록되어 있습니다 |
| `user.profile_updated` | Profile updated | 资料已更新 | 資料已更新 | プロフィールを更新しました | 프로필이 수정되었습니다 |
| `user.unfollowed` | Unfollowed | 已取消关注 | 已取消關注 | フォローを解除しました | 팔로우를 해제했습니다 |
| `user.username_exists` | This username is already taken | 该用户名已被占用 | 該使用者名稱已被佔用 | このユーザー名は既に使用されています | 이 사용자 이름은 이미 사용 중입니다 |
| `user.username_invalid` | Username must be 3-32 characters, letters, digits or underscore | 用户名须为 3-32 位字母、数字或下划线 | 使用者名稱須為 3-32 位字母、數字或底線 | ユーザー名は 3〜32 文字の英数字・アンダースコアである必要があります | 사용자 이름은 3-32자의 영문, 숫자, 밑줄이어야 합니다 |

---

## 前端接入说明

1. **响应 message 是 key**（如 `"auth.need_login"`），前端按本文查表翻译；
2. `status_code` 才是逻辑判断依据（如 20001 → 跳登录页），**不要按 message 判断**；
3. 带占位符的 key（38 个）需 `message.replace('%s', 实际值)`；
4. 新增 key 的流程：`keys*.go` 加常量 → `en.go` 加英文 → 重跑本文生成器。

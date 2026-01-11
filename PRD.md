# Genshin Avatar Studio - 产品需求说明书 (PRD)

## 📋 文档信息

**产品名称**: Genshin Avatar Studio
**版本**: v1.0 MVP
**目标发布**: 2026年2月
**文档作者**: Product Team
**最后更新**: 2026-01-12

---

## 🎯 产品概述

### 产品定位
**全球首个专注于原神（Genshin Impact）风格的 AI 头像生成器**

为原神玩家、内容创作者、VTuber 提供即时、高质量、多平台适配的定制角色头像。

### 核心价值主张
- ✅ **米哈游官方美学** - 专业还原原神角色设计风格
- ✅ **即时交付** - 2分钟内生成完整头像包（vs 手绘2-7天）
- ✅ **多平台适配** - 18+张不同尺寸，覆盖所有主流社交/游戏平台
- ✅ **超高性价比** - $15-20/次（vs 手绘$50-150）
- ✅ **商业友好** - 明确商业使用许可

### 目标用户

**主要用户（80%）**:
1. **原神玩家** - 想要个性化头像
   - 年龄: 18-35岁
   - 消费能力: 中等（年均游戏内消费 $100-500）
   - 平台: Discord, Twitter, Reddit
   - 痛点: 手绘太贵，AI 工具不专业

2. **Discord 社区成员** - 需要独特身份
   - 活跃在原神相关服务器
   - 愿意为个性化付费
   - 需要多尺寸适配

3. **内容创作者** - YouTube/TikTok/Twitch
   - 需要品牌化头像
   - 预算有限
   - 需要快速交付

**次要用户（20%）**:
4. **VTuber** - 需要角色设计（未来扩展）
5. **Cosplayer** - 需要角色参考（未来扩展）

### 市场规模
- **原神月活用户**: 15.2M
- **Discord 社区**: 2.38M 成员
- **Reddit 社区**: 3.7M 订阅者
- **总社区规模**: 6M+ 活跃用户
- **目标市场（西方）**: 45% ≈ 2.7M 潜在用户
- **可达成市场（年1）**: 50K-100K 用户
- **付费转化目标**: 2-3% = 1,000-3,000 付费用户

---

## 🎨 产品功能

### MVP 核心功能（Phase 1 - 必须有）

#### 1. 角色定制器
**功能描述**: 用户通过可视化界面配置角色外观

**配置选项**:

**1.1 性别选择**
- [ ] 男性 (Male)
- [ ] 女性 (Female)

**1.2 发型 (HairStyle)**
- [ ] 长发 (Long)
- [ ] 短发 (Short)
- [ ] 马尾 (Ponytail)
- [ ] 双马尾 (Twin Tails)
- [ ] 编发 (Braid)

**1.3 发色 (HairColor)**
- [ ] 黑色 (Black)
- [ ] 棕色 (Brown)
- [ ] 金色 (Blonde)
- [ ] 银色 (Silver)
- [ ] 白色 (White)
- [ ] 红色 (Red)
- [ ] 粉色 (Pink)
- [ ] 蓝色 (Blue)
- [ ] 紫色 (Purple)
- [ ] 绿色 (Green)

**1.4 眼睛颜色 (EyeColor)**
- [ ] 蓝色 (Blue)
- [ ] 绿色 (Green)
- [ ] 棕色 (Brown)
- [ ] 红色 (Red)
- [ ] 紫色 (Purple)
- [ ] 金色 (Gold)
- [ ] 粉色 (Pink)

**1.5 特殊特征 (Traits)** - 多选
- [ ] 眼镜 (Glasses)
- [ ] 眼罩 (Eyepatch)
- [ ] 精灵耳 (Elf Ears)
- [ ] 恶魔角 (Horns)
- [ ] 天使翅膀 (Wings)
- [ ] 猫耳 (Cat Ears)

**技术要求**:
- 实时预览（可选配置更新时显示参考图）
- 表单验证（所有必填项验证）
- 配置保存（localStorage，方便用户下次使用）
- 响应式设计（移动端友好）

**UI/UX 要求**:
- 清晰的分步向导（Step 1: 基础 → Step 2: 发型 → Step 3: 特征）
- 每个选项配图标/小图标
- 原神风格的 UI 配色（蓝金色调）
- 进度指示器

---

#### 2. AI 图像生成
**功能描述**: 基于用户配置生成高质量原神风格头像

**生成规格**:
- **原始尺寸**: 1024x1024 (高质量)
- **格式**: PNG
- **质量**: 最高质量（Sharp, Detailed）
- **风格**: 原神官方美学
- **背景**: 纯白背景（便于后续处理）
- **构图**: 半身像（bust shot, from chest up）
- **视角**: 正面，看向观众

**生成参数**:
```typescript
{
  width: 1024,
  height: 1024,
  num_outputs: 1,
  num_inference_steps: 4,  // FLUX-schnell 快速模式
  output_format: 'png'
}
```

**Prompt 优化要求**:
- 强调"Genshin Impact style"
- 添加一致性标签："same character, consistent design"
- 质量词："masterpiece, best quality, highly detailed"
- 构图词："centered composition, professional character design"

**技术要求**:
- 生成时间: < 30 秒
- 成功率: > 95%
- 自动重试机制（最多3次）
- 错误处理和友好提示

**成本控制**:
- 单次生成成本: ~$0.10
- 限流处理: 12秒间隔（避免 Replicate 429 错误）

---

#### 3. 多平台尺寸生成
**功能描述**: 自动将原始图片处理成 18+ 种平台适配尺寸

**平台列表及规格**:

**3.1 社交媒体 (6张)**
| 平台 | 尺寸 | 形状 | 文件名 |
|------|------|------|--------|
| Discord | 128x128 | 圆形 | discord-128.png |
| Twitter/X | 400x400 | 圆形 | twitter-400.png |
| Instagram | 320x320 | 圆形 | instagram-320.png |
| Facebook | 180x180 | 圆形 | facebook-180.png |
| LinkedIn | 400x400 | 方形 | linkedin-400.png |
| TikTok | 200x200 | 圆形 | tiktok-200.png |

**3.2 游戏平台 (5张)**
| 平台 | 尺寸 | 形状 | 文件名 |
|------|------|------|--------|
| Steam | 184x184 | 方形 | steam-184.png |
| Xbox | 1080x1080 | 方形 | xbox-1080.png |
| PlayStation | 1000x1000 | 方形 | playstation-1000.png |
| Epic Games | 512x512 | 方形 | epicgames-512.png |
| Nintendo | 256x256 | 方形 | nintendo-256.png |

**3.3 直播平台 (3张)**
| 平台 | 尺寸 | 形状 | 文件名 |
|------|------|------|--------|
| Twitch | 256x256 | 圆形 | twitch-256.png |
| YouTube | 800x800 | 圆形 | youtube-800.png |
| Kick | 300x300 | 圆形 | kick-300.png |

**3.4 专业用途 (3张)**
| 类型 | 尺寸 | 形状 | 文件名 |
|------|------|------|--------|
| 高清原图 | 1024x1024 | 方形 | highres-1024.png |
| 透明背景 | 512x512 | 方形 | transparent-512.png |
| 打印质量 | 2048x2048 | 方形 | print-2048.png |

**3.5 附赠壁纸 (2张)**
| 类型 | 尺寸 | 文件名 |
|------|------|--------|
| 手机壁纸 | 1080x1920 | mobile-wallpaper-1080x1920.png |
| 桌面壁纸 | 1920x1080 | desktop-wallpaper-1920x1080.png |

**技术要求**:
- 使用 Sharp 库进行图片处理
- 圆形裁剪使用 SVG mask
- 保持高质量（PNG 压缩级别 9）
- 批量处理时间: < 10 秒
- 内存优化（流式处理）

---

#### 4. ZIP 打包下载
**功能描述**: 将所有生成的图片打包成 ZIP，方便用户一键下载

**目录结构**:
```
genshin-avatar-pack-{generationId}.zip
│
├─ 01-social-media/
│  ├─ discord-128.png
│  ├─ twitter-400.png
│  ├─ instagram-320.png
│  ├─ facebook-180.png
│  ├─ linkedin-400.png
│  └─ tiktok-200.png
│
├─ 02-gaming/
│  ├─ steam-184.png
│  ├─ xbox-1080.png
│  ├─ playstation-1000.png
│  ├─ epicgames-512.png
│  └─ nintendo-256.png
│
├─ 03-streaming/
│  ├─ twitch-256.png
│  ├─ youtube-800.png
│  └─ kick-300.png
│
├─ 04-professional/
│  ├─ highres-1024.png
│  ├─ transparent-512.png
│  └─ print-2048.png
│
├─ 05-wallpapers/
│  ├─ mobile-wallpaper-1080x1920.png
│  └─ desktop-wallpaper-1920x1080.png
│
└─ README.txt  (使用说明)
```

**README.txt 内容**:
```
╔════════════════════════════════════════════════════════════════╗
║              GENSHIN AVATAR STUDIO - AVATAR PACK               ║
╚════════════════════════════════════════════════════════════════╝

Generation ID: {generationId}
Generated: {timestamp}

📦 PACKAGE CONTENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This package contains 18+ optimized avatar images for different platforms:

📱 SOCIAL MEDIA (01-social-media/) - 6 images
🎮 GAMING PLATFORMS (02-gaming/) - 5 images
📺 STREAMING PLATFORMS (03-streaming/) - 3 images
💼 PROFESSIONAL USE (04-professional/) - 3 images
🖼️ BONUS WALLPAPERS (05-wallpapers/) - 2 images

💡 USAGE TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Use platform-specific images for best quality
2. Circular images already have rounded edges
3. Transparent background version is great for custom edits
4. Print quality version is suitable for merchandise

🔒 LICENSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Personal use: Unlimited
✓ Social media profiles: Unlimited
✓ Gaming profiles: Unlimited
✓ Streaming channels: Unlimited
✓ Commercial use: Allowed (with credit)

✗ Redistribution: Not allowed
✗ AI training: Not allowed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Need more avatars? Visit: https://genshin-avatar.studio

Questions? Contact: support@genshin-avatar.studio
```

**技术要求**:
- 使用 Archiver 库
- 最高压缩级别（level 9）
- 目标大小: 5-8 MB
- 生成时间: < 5 秒
- 上传到 Supabase Storage
- 返回公开下载链接

---

#### 5. 预览与下载页面
**功能描述**: 显示生成进度、预览图片、提供下载

**页面结构**:

**5.1 生成中状态**
- 进度条（0-100%）
- 当前状态文本
  - "Initializing AI generation..."
  - "Generating your avatar... (30s)"
  - "Processing images... (10s)"
  - "Creating download package... (5s)"
  - "All done! ✓"
- 原神风格加载动画
- 预计剩余时间

**5.2 生成完成状态**
- 大图预览（原始 1024x1024 图片）
- 缩略图网格（展示部分平台尺寸）
- 下载按钮（醒目的 CTA）
- 社交分享按钮
- 重新生成按钮

**5.3 错误状态**
- 友好的错误提示
- 可能的原因和解决方案
- 重试按钮
- 联系支持

**技术要求**:
- 实时进度更新（轮询或 WebSocket）
- 图片懒加载
- 下载文件名: `genshin-avatar-{timestamp}.zip`
- 错误边界处理

**UI/UX 要求**:
- 原神配色方案（蓝金渐变）
- 流畅动画过渡
- 响应式布局
- 无障碍访问（ARIA 标签）

---

### Phase 2 功能（未来扩展 - 3-6个月后）

#### 6. 表情差分包（可选）
**功能描述**: 生成 5 种表情的头像

**表情列表**:
- 中性 (Avatar) - 已在 MVP 中
- 开心 (Happy)
- 愤怒 (Angry)
- 悲伤 (Sad)
- 得意 (Smug)

**价格**: $25-35/次（vs MVP $15-20）

**优先级**: 中（取决于用户反馈）

---

#### 7. 角色存档功能
**功能描述**: 保存配置，方便下次生成

**优先级**: 低（可用 localStorage 临时替代）

---

#### 8. 崩坏：星穹铁道风格
**功能描述**: 添加崩铁科幻美学

**前提条件**:
- 原神产品月收入 > $3,000
- 至少 50 个用户要求
- 技术架构验证成功

**优先级**: 低（6-12 个月后）

---

## 💰 商业模式

### 定价策略

**Phase 1 (MVP)**:
- **基础版**: $15/次
  - 1 个头像（中性表情）
  - 18+ 平台尺寸
  - 2 张壁纸
  - ZIP 打包下载
  - 商业使用许可

**Phase 2 (如果成功)**:
- **标准版**: $20/次（基础版功能）
- **高级版**: $35/次
  - 5 个表情差分
  - 每个表情也生成多平台尺寸
  - 总共 90+ 张图片

### 支付方式
- **Stripe Checkout** (主要)
  - 支持信用卡/借记卡
  - 支持 Apple Pay / Google Pay
  - 自动发票

- **Gumroad** (备选，用于测试)
  - 快速上线
  - 无需自建支付系统

### 成本结构

**单次生成成本**:
- AI 生成: $0.10
- Supabase 存储: $0.001
- Supabase 流量: $0.01
- **总成本**: ~$0.11

**毛利率**: 99% ($15 - $0.11 = $14.89)

**月度固定成本**:
- Vercel 托管: $20
- Supabase Pro: $25
- 域名: $2
- Replicate 基础: $0（按量付费）
- **总计**: ~$47/月

**盈亏平衡**:
- 需要销售: 4 次/月（$15 × 4 = $60 > $47）
- 保守目标: 100 次/月 = $1,500 收入，$58 成本，$1,442 净利

---

## 📊 成功指标（KPIs）

### 产品指标

**3 个月目标（Beta）**:
- [ ] 注册用户: 5,000+
- [ ] 生成次数: 10,000+
- [ ] 付费转化率: > 2%
- [ ] 付费用户: 100+
- [ ] 月收入: $1,500+

**6 个月目标（正式版）**:
- [ ] 注册用户: 20,000+
- [ ] 月活用户: 10,000+
- [ ] 付费转化率: > 3%
- [ ] 付费用户: 300+
- [ ] 月收入: $4,500+
- [ ] 复购率: > 20%

**12 个月目标（成熟期）**:
- [ ] 注册用户: 100,000+
- [ ] 月活用户: 50,000+
- [ ] 付费用户: 1,500+
- [ ] 月收入: $22,500+
- [ ] 品牌认知: "原神头像"第一搜索结果

### 技术指标

**性能要求**:
- [ ] 页面加载时间: < 2秒
- [ ] 生成总时间: < 60秒
- [ ] AI 生成成功率: > 95%
- [ ] 图片处理成功率: > 99%
- [ ] ZIP 打包成功率: > 99%
- [ ] 服务可用性: > 99.5%

**用户体验**:
- [ ] 用户满意度: > 4.5/5
- [ ] Net Promoter Score (NPS): > 50
- [ ] 支持工单响应: < 24 小时

---

## 🎨 设计要求

### 品牌标识

**产品名**: Genshin Avatar Studio

**Logo 要求**:
- 融合原神元素（风元素符号、星星、Paimon 风格）
- 蓝金配色
- 现代、专业、可爱

**配色方案**:
```
主色调:
- 原神蓝: #5AB8E8
- 金色点缀: #FFD700
- 深蓝背景: #1A1F35

辅助色:
- 白色: #FFFFFF
- 浅灰: #F5F7FA
- 深灰文本: #2C3E50

状态色:
- 成功: #4CAF50
- 警告: #FF9800
- 错误: #F44336
- 信息: #2196F3
```

**字体**:
- 标题: Poppins (英文) / Noto Sans SC (中文)
- 正文: Inter (英文) / Noto Sans SC (中文)
- 代码: JetBrains Mono

### UI 组件库
- 使用 shadcn/ui (已在项目中)
- 自定义原神主题
- 保持一致性和可访问性

---

## 🔒 合规与法律

### IP 使用声明

**重要**: 本产品是**粉丝创作工具**，非米哈游官方产品

**合规措施**:
1. **明确声明**（每个页面底部）:
   ```
   "Genshin Avatar Studio is a fan-made tool and is not affiliated
   with, endorsed by, or officially connected to miHoYo/HoYoverse.
   All Genshin Impact-related trademarks and copyrights belong to
   miHoYo/HoYoverse."
   ```

2. **遵守米哈游粉丝创作政策**:
   - 单批次商品 ≤ 500 件
   - 不使用官方 Logo 作为产品商标
   - 不暗示官方授权
   - 提供版权归属声明

3. **用户协议**:
   - 用户对生成内容负责
   - 禁止用于非法用途
   - 明确商业使用许可范围

### 数据隐私

**GDPR / CCPA 合规**:
- [ ] Cookie 同意横幅
- [ ] 隐私政策页面
- [ ] 用户数据导出功能
- [ ] 用户数据删除功能
- [ ] 不收集敏感信息

**数据存储**:
- 用户配置: Supabase Database (加密)
- 生成图片: Supabase Storage (30天后自动删除)
- 支付信息: 仅由 Stripe 处理（PCI DSS 合规）

---

## 📅 发布计划

### Phase 0: 准备阶段（Week 1-2）

**Week 1**:
- [x] PRD 编写和评审
- [ ] 技术架构设计
- [ ] UI/UX 设计稿
- [ ] 域名购买 (genshin-avatar.studio)
- [ ] 基础设施搭建（Vercel + Supabase）

**Week 2**:
- [ ] Prompt 工程优化（原神风格）
- [ ] 图片处理管道测试
- [ ] 前端页面开发（80%）
- [ ] 支付集成测试

---

### Phase 1: 内部测试（Week 3）

**目标**: 验证核心功能

**任务**:
- [ ] 完成所有核心功能开发
- [ ] 内部测试（10 次生成）
- [ ] 修复关键 Bug
- [ ] 性能优化

**验收标准**:
- [ ] 端到端生成成功率 > 90%
- [ ] 生成时间 < 90 秒
- [ ] ZIP 下载正常
- [ ] 支付流程完整

---

### Phase 2: Beta 测试（Week 4-5）

**目标**: 获取真实用户反馈

**策略**:
- [ ] 发布到 r/Genshin_Impact (Beta 邀请帖)
- [ ] 前 50 个用户免费（换取反馈）
- [ ] 创建 Discord 服务器
- [ ] 每日收集反馈并快速迭代

**成功标准**:
- [ ] 收集 50+ 用户反馈
- [ ] 用户满意度 > 4/5
- [ ] 识别并修复主要问题
- [ ] 至少 10 个用户愿意付费

---

### Phase 3: 公开发布（Week 6）

**发布渠道**:
1. **Product Hunt** (主要)
   - 精心准备发布页面
   - 联系 Hunter
   - 目标: 前 5 Product of the Day

2. **Reddit**
   - r/Genshin_Impact (3.7M 用户)
   - r/Genshin_Memepact
   - r/GenshinImpactTips

3. **Discord**
   - 官方原神服务器（2.38M 成员）
   - 各大原神社区服务器

4. **社交媒体**
   - Twitter/X (#GenshinImpact 话题)
   - TikTok (联系 2-3 个微影响者)

**定价**:
- 正式价格: $15/次
- 限时优惠（首周）: $12/次（20% off）

---

### Phase 4: 优化迭代（Week 7-12）

**重点**:
- [ ] SEO 优化（目标: "genshin avatar" 首页）
- [ ] 性能优化（减少生成时间到 45 秒）
- [ ] 新功能开发（基于用户反馈）
- [ ] 内容营销（博客、教程视频）
- [ ] 影响者合作（5-10 个 Genshin 内容创作者）

**月度目标**:
- 月收入: $1,500-3,000
- 月活用户: 5,000-10,000
- 付费用户: 100-200

---

## 🚫 超出范围（明确不做）

**Phase 1 不包括**:
1. ❌ 用户账号系统（使用邮箱验证码登录即可）
2. ❌ 社交功能（点赞、评论、分享）
3. ❌ AI 模型微调（使用现成的 FLUX 模型）
4. ❌ 移动 App（先专注 Web）
5. ❌ 多语言支持（先只做英文）
6. ❌ 表情动画（静态图片即可）
7. ❌ 崩坏/绝区零风格（只做原神）
8. ❌ 全身立绘（只做半身头像）
9. ❌ 订阅制（只做单次付费）
10. ❌ API 开放（避免滥用）

---

## 📝 附录

### A. 参考竞品分析

**直接竞品**:
1. Picrew - 免费，但质量一般，非 AI
2. NightCafe - 通用 AI，非专精原神
3. Character.AI - 偏对话，头像质量低

**间接竞品**:
1. Midjourney - 强大但通用，价格高
2. 手绘定制服务 - 质量高但慢且贵

**竞争优势**:
- ✅ 唯一专精原神的 AI 工具
- ✅ 价格最优（$15 vs 手绘$50+）
- ✅ 速度最快（2分钟 vs 手绘7天）
- ✅ 多平台适配（18+尺寸）

---

### B. 风险评估

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 米哈游法律行动 | 低 | 高 | 遵守粉丝创作政策,明确声明 |
| AI 生成质量不稳定 | 中 | 高 | Prompt 工程优化,重试机制 |
| Replicate 成本飙升 | 低 | 中 | 监控成本,设置预算警报 |
| 竞品模仿 | 高 | 中 | 快速迭代,建立品牌护城河 |
| 用户增长缓慢 | 中 | 高 | 多渠道营销,影响者合作 |
| 支付欺诈 | 低 | 中 | Stripe 自带反欺诈 |

---

### C. 技术栈总结

**前端**:
- Next.js 16.1.1 (App Router)
- React 19
- TypeScript 5
- TailwindCSS 4
- shadcn/ui
- Framer Motion (动画)

**后端**:
- Next.js API Routes
- Supabase (PostgreSQL + Storage + Auth)
- Replicate (FLUX.1-schnell AI 模型)

**图片处理**:
- Sharp (resize, crop, format)
- Archiver (ZIP 打包)

**支付**:
- Stripe Checkout
- Stripe Webhooks (订单验证)

**部署**:
- Vercel (托管)
- Supabase Cloud (数据库 + 存储)
- Cloudflare (CDN,可选)

**监控**:
- Vercel Analytics
- Sentry (错误追踪,可选)
- Stripe Dashboard (支付监控)

---

### D. 关键假设需验证

**市场假设**:
1. ✅ 原神玩家愿意为头像付费
2. ✅ $15 的价格点被接受
3. ⚠️ 用户更喜欢 AI 生成 vs 手绘（需验证）
4. ⚠️ 多平台尺寸是真需求（需验证）

**技术假设**:
1. ✅ FLUX 模型可以生成原神风格
2. ✅ 生成时间 < 60 秒可实现
3. ⚠️ 圆形裁剪不会破坏图片质量（需验证）
4. ⚠️ ZIP 大小 < 10MB（需验证）

**商业假设**:
1. ⚠️ 2-3% 付费转化率（行业平均，需验证）
2. ⚠️ CAC（获客成本）< $1（需验证）
3. ⚠️ 复购率 > 20%（需验证）

---

## ✅ 版本历史

- **v1.0** (2026-01-12) - 初始 PRD，定义 MVP 范围
- **v1.1** (TBD) - Beta 测试后更新
- **v2.0** (TBD) - 正式发布后更新

---

**文档结束**

如需更多信息或澄清，请联系产品团队。

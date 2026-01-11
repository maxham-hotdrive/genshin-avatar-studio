# 🚀 GitHub 上传指南

你的项目已经在本地完成了Git初始化和提交！现在按照以下步骤上传到GitHub：

---

## 📋 步骤 1: 在GitHub上创建新仓库

1. 访问 [https://github.com/new](https://github.com/new)
2. 填写仓库信息：
   - **Repository name**: `genshin-avatar-studio`
   - **Description**: `Professional Genshin Impact character avatar generator with multi-platform support`
   - **Visibility**:
     - 🔓 **Public** (推荐) - 开源项目，可展示在个人主页
     - 🔒 **Private** - 私有项目，只有你能看到
   - ⚠️ **重要**: 不要勾选以下选项：
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license

3. 点击 **"Create repository"** 按钮

---

## 📋 步骤 2: 连接本地仓库到GitHub

创建仓库后，GitHub会显示快速设置页面。复制你的仓库URL（应该类似于）：

```
https://github.com/你的用户名/genshin-avatar-studio.git
```

然后在终端执行以下命令：

### 方案 A: 使用HTTPS（推荐，简单）

```bash
cd "d:/AI Learning/AI动漫站点/anime-identity-kit"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/genshin-avatar-studio.git

# 推送到GitHub
git push -u origin master
```

### 方案 B: 使用SSH（需要先配置SSH密钥）

```bash
cd "d:/AI Learning/AI动漫站点/anime-identity-kit"

# 添加远程仓库
git remote add origin git@github.com:你的用户名/genshin-avatar-studio.git

# 推送到GitHub
git push -u origin master
```

---

## 📋 步骤 3: 验证上传成功

推送完成后：

1. 刷新你的GitHub仓库页面
2. 你应该能看到所有文件
3. README.md会自动显示在仓库首页

---

## 🔑 可能遇到的问题

### 问题 1: 需要GitHub认证

如果使用HTTPS，第一次推送时需要输入GitHub凭据：

**推荐方案 - 使用Personal Access Token (PAT)**:

1. 访问 [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写：
   - Note: `Genshin Avatar Studio`
   - Expiration: `90 days` 或 `No expiration`
   - 勾选权限: `repo` (Full control of private repositories)
4. 点击 **"Generate token"**
5. **⚠️ 立即复制Token** (只显示一次！)
6. 推送时使用Token作为密码：
   - Username: 你的GitHub用户名
   - Password: 粘贴刚才的Token

### 问题 2: 推送被拒绝 (rejected)

如果看到错误信息：

```
! [rejected]        master -> master (fetch first)
```

执行：

```bash
git pull origin master --allow-unrelated-histories
git push -u origin master
```

### 问题 3: 分支名称问题

如果你的GitHub使用 `main` 作为默认分支，而本地是 `master`：

```bash
# 重命名本地分支
git branch -M main

# 推送到main分支
git push -u origin main
```

---

## 📝 快速命令参考

```bash
# 检查当前状态
git status

# 查看远程仓库
git remote -v

# 查看提交历史
git log --oneline

# 移除远程仓库（如果配置错误）
git remote remove origin

# 重新添加正确的远程仓库
git remote add origin https://github.com/你的用户名/genshin-avatar-studio.git
```

---

## 🎯 上传后的下一步

### 1. 更新仓库描述

在GitHub仓库页面点击 ⚙️ Settings：
- **About** 区域添加：
  - Description: `Professional Genshin Impact avatar generator - 18+ platform sizes`
  - Website: 你的部署URL（如果有）
  - Topics: `genshin-impact`, `avatar-generator`, `nextjs`, `ai`, `replicate`

### 2. 创建 .env.example 文件

让其他人知道需要哪些环境变量：

```bash
# 在项目根目录创建
echo "# Replicate
REPLICATE_API_TOKEN=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_URL=" > .env.example

git add .env.example
git commit -m "docs: Add environment variables template"
git push
```

### 3. 添加GitHub Actions（可选）

创建自动化部署或测试流程。

---

## 🔗 有用的链接

- [Git 基础教程](https://git-scm.com/book/zh/v2)
- [GitHub 文档](https://docs.github.com/cn)
- [Personal Access Token 指南](https://docs.github.com/cn/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## ✅ 检查清单

在推送前确认：

- [ ] 已在GitHub创建仓库
- [ ] 本地代码已提交 (`git status` 显示干净)
- [ ] .gitignore 正确配置（不包含 .env 文件）
- [ ] 已配置远程仓库URL
- [ ] 准备好GitHub认证（Token或SSH）

---

**准备好了？执行以下命令开始上传：**

```bash
cd "d:/AI Learning/AI动漫站点/anime-identity-kit"
git remote add origin https://github.com/你的用户名/genshin-avatar-studio.git
git push -u origin master
```

**祝你成功！🎉**

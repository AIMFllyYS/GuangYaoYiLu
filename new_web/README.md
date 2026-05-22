# 光药医路 new_web

Next.js 16.2 全栈网站，面向腾讯云 EdgeOne Pages / Pages 类部署环境设计。页面数据默认内置，用户侧记录只写入浏览器 `localStorage`；AI 中药解析和研究速递经后端 Route Handler 代理调用小米 MiMo，避免在前端暴露密钥。

## 本地运行

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

在 `.env.local` 中设置：

- `MIMO_API_KEY`：小米 MiMo API Key
- `MIMO_MODEL`：默认 `mimo-v2.5`
- `MIMO_BASE_URL`：默认 `https://api.xiaomimimo.com/v1`
- `MIMO_ENABLE_WEB_SEARCH`：研究成果模式是否尝试启用联网检索工具

## 部署说明

不要开启 `output: "export"`。本站包含 `/api/ai-herb` 后端 Route Handler，用于密钥保护、流式返回 XML 和研究检索。腾讯云 EdgeOne Pages 支持 Next.js App Router、Route Handlers、SSR/SSG 与流式响应，部署时在平台环境变量中配置上面的变量即可。

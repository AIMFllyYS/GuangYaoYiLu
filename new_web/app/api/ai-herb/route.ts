export const runtime = "edge";

type RequestMode = "herb" | "research";

type Payload = {
  query?: string;
  mode?: RequestMode;
  localContext?: string;
};

const baseUrl = process.env.MIMO_BASE_URL || "https://api.xiaomimimo.com/v1";
const model = process.env.MIMO_MODEL || "mimo-v2.5-pro";

function buildMessages(query: string, mode: RequestMode, localContext: string) {
  const isResearch = mode === "research";

  return [
    {
      role: "system",
      content:
        "你是“瑶光助手”，服务于华中科技大学“光药医路”联合团支部网站。请用中文回答，面向公众科普，必须谨慎，不提供诊断、处方、剂量方案，不替代医生。输出必须是严格 XML，不要 Markdown，不要代码围栏。"
    },
    {
      role: "user",
      content: `
任务：${isResearch ? "围绕中医药最新研究成果做可核验摘要并绘制光谱与匹配图像" : "生成一张中药查询卡片并绘制光谱与匹配图像"}。
用户查询：${query}
本地参考：${localContext || "无"}

请输出这个 XML 结构，标签必须完整，并且不要包裹任何 Markdown 围栏代码块：
<yaoguangCard>
  <title>简短标题</title>
  <subtitle>一句适合卡片副标题的话</subtitle>
  
  <visual>
    直接生成一段高度美观且贴合本中药调性与光电背景的原始 SVG 代码（绝对不要包裹 Markdown \`\`\`xml 代码围栏）。要求：
    1. 必须包含 viewBox="0 0 200 200" 且 width="100%" height="100%"。
    2. 保持透明背景（融入卡片深邃暗绿背景 #091510）。
    3. 设计理念为“光谱雷达与五行本草能量”：使用渐变色（如黄芪用璀璨暖金/琥珀黄、丹参用活血朱红/暖光橙、金银花用寒凉青黛/翠绿、枸杞用朱砂红/赤红），绘制出抽象优雅的光谱吸收曲线、同心共振波轨、发光分子/元素点线网络或光束波环。
    4. 必须包含线性渐变（&lt;linearGradient&gt;）及微弱发光滤镜（&lt;filter id="glow"&gt;），使发光曲线在暗色卡片中呈现流光溢彩的效果。不要绘制繁琐写实的植物叶片，多用几何对称、光谱干涉波纹或太极波形光晕，使其富有极高的国潮与现代科技质感。
  </visual>

  <imageSearchQuery>该中药最精准的英文学术名或拉丁学名（例如：Astragalus membranaceus 或 Lycium barbarum），不要包含任何中文、解释或标点符号，仅输出学名本身，用于前端匹配维基百科标本插图。</imageSearchQuery>

  <summary>120字以内摘要</summary>
  <properties>
    <item label="性味归经">优先采用本地参考中已给出的性味归经；不确定再写“需查阅药典或专业资料”</item>
    <item label="传统认识">内容</item>
    <item label="现代视角">内容</item>
  </properties>
  <insights>
    <point>要点1</point>
    <point>要点2</point>
    <point>要点3</point>
  </insights>
  <research>
    <status>${isResearch ? "聚焦近期研究、质量控制或现代药理进展" : "可补充相关研究方向"}</status>
    <detail>如果启用了联网检索，请概括高可靠信息；若搜索结果主要来自论坛、文档搬运站、百科或营销站，必须明确写出“当前检索结果不足以确认最新研究结论，需进一步核验 PubMed/CNKI/期刊官网”。</detail>
  </research>
  <safety>风险边界和不适合自行使用的情况</safety>
  <sources>
    <source>只列高可靠来源或检索线索，如 PubMed、CNKI、期刊官网、国家药典/药监/中医药主管部门；没有可靠来源则写“未检索到高可靠来源，需核验”</source>
    <source>不要把知乎、豆丁、原创力文档、营销号当作研究来源</source>
  </sources>
</yaoguangCard>
`
    }
  ];
}

function buildBody(query: string, mode: RequestMode, localContext: string, withSearch: boolean) {
  const body: Record<string, unknown> = {
    model,
    stream: true,
    temperature: 0.35,
    max_completion_tokens: 1200,
    thinking: { type: "disabled" },
    messages: buildMessages(query, mode, localContext)
  };

  if (withSearch) {
    body.tools = [
      {
        type: "web_search",
        max_keyword: 5,
        force_search: true,
        limit: 3,
        user_location: {
          type: "approximate",
          country: "China",
          region: "Hubei",
          city: "Wuhan"
        }
      }
    ];
  }

  return body;
}

async function requestMimo(body: Record<string, unknown>, apiKey: string) {
  return fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

async function openMimoStream(query: string, mode: RequestMode, localContext: string, apiKey: string) {
  const enableSearch = process.env.MIMO_ENABLE_WEB_SEARCH !== "false" && mode === "research";
  let upstream = await requestMimo(buildBody(query, mode, localContext, enableSearch), apiKey);

  if (!upstream.ok && enableSearch) {
    upstream = await requestMimo(buildBody(query, mode, localContext, false), apiKey);
  }

  return upstream;
}

function streamXmlFromSse(upstream: Response) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body?.getReader();
      if (!reader) {
        controller.enqueue(encoder.encode("<yaoguangCard><title>连接失败</title><summary>上游没有返回流。</summary><safety>请稍后再试。</safety></yaoguangCard>"));
        controller.close();
        return;
      }

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) controller.enqueue(encoder.encode(content));
            } catch {
              continue;
            }
          }
        }
      } catch {
        controller.enqueue(encoder.encode("<safety>流式生成中断，请重试。</safety>"));
      } finally {
        controller.close();
      }
    }
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    return new Response("MIMO_API_KEY is not configured.", { status: 500 });
  }

  const payload = (await request.json()) as Payload;
  const query = (payload.query || "").trim().slice(0, 80);
  const mode = payload.mode === "research" ? "research" : "herb";
  const localContext = (payload.localContext || "").slice(0, 1200);

  if (!query) {
    return new Response("Missing query.", { status: 400 });
  }

  const upstream = await openMimoStream(query, mode, localContext, apiKey);
  if (!upstream.ok) {
    const reason = await upstream.text();
    return new Response(reason || "MiMo request failed.", { status: upstream.status });
  }

  return new Response(streamXmlFromSse(upstream), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no"
    }
  });
}

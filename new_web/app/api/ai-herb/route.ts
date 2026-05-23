export const runtime = "edge";

type RequestMode = "herb" | "research";

type Payload = {
  query?: string;
  mode?: RequestMode;
  localContext?: string;
};

const baseUrl = process.env.MIMO_BASE_URL || "https://api.xiaomimimo.com/v1";
const model = process.env.MIMO_MODEL || "mimo-v2.5";

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
    你是精通中医药学、植物形态学与光谱科学的 SVG 艺术家。请直接输出纯 SVG 代码，绝不要包裹任何 Markdown 围栏或代码块。

    【画布规格】viewBox="0 0 300 300"，width="100%"，height="100%"，背景透明（融入卡片暗绿底色 #0a1a12）。

    【主体——精准植物形态】根据查询词「${query}」，绘制该中药最具辨识度的药用部位：
      · 枸杞子/浆果类：圆润果实串，朱砂红→深红径向渐变，顶部高光白点，叶片衬托
      · 丹参/根茎类：弯曲纵剖根茎，暗红木质纹理，细侧根，截面年轮
      · 黄芪/粗根类：竖切面纹路，琥珀金→暖褐线性渐变，豆科托叶点缀
      · 金银花/花卉类：对生花蕾+开放花，青白→淡黄渐变，细蕊丝
      · 陈皮/果皮类：橘皮横切面，散布油胞点，橙黄→橙红渐变
      · 其他中药：尽力还原该药材的主要药用部位的半写实轮廓与配色
      使用 SVG path/ellipse/circle 精确描绘，不要用空洞纯几何形状代替。

    【光谱科学叠加层】植物主体周围叠加以下层次：
      1. 近红外吸收曲线：流畅 path 波形线，标注 2~3 个特征峰数值（如 1605 cm⁻¹，2930 cm⁻¹）
      2. 活性分子网络：6~8 个小圆节点（r=4）用细线相连，节点旁标注活性成分缩写（如 多糖、丹参酮）
      3. 多光谱雷达环：外围 2~3 个虚线同心圆，象征多光谱扫描范围

    【色彩体系】按性味配色 — 温热性（黄芪/肉桂）→暖金/朱红/琥珀；寒凉性（金银花/黄连）→青翠/冰蓝/青黛；平性→苍玉/墨绿。

    【必须包含的 SVG 技术特性】
      &lt;defs&gt; 内定义至少 2 个 linearGradient 或 radialGradient；
      &lt;filter id="glow"&gt; 包含 feGaussianBlur stdDeviation="2.5" 使节点/曲线有荧光发光感；
      &lt;text&gt; 左上角：中文药名（font-size 14，bold）+ 拉丁学名（font-size 8，italic）；右下角：主特征峰（格式 1602 cm⁻¹，font-size 8）；
      整体层次：背景雷达环 → 中层植物体 → 前景光谱曲线+节点+文字。

    【品质标准】输出的 SVG 须令观看者能识别出具体是哪种中药，同时兼具国潮科技美学。SVG 代码语法完整，可直接渲染，无任何 Markdown 包裹。
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
    temperature: 0.25,
    max_completion_tokens: 2400,
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

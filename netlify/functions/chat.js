import { buildSiteKnowledgeText, siteKnowledge } from "../../src/data/siteKnowledge.js";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const BRAVE_SEARCH_API_URL = "https://api.search.brave.com/res/v1/web/search";
const DEFAULT_MODEL = "deepseek-chat";
const jsonHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json; charset=utf-8"
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body)
  };
}

function normalizeMessages(input) {
  if (Array.isArray(input.messages)) {
    return input.messages
      .filter(
        (message) =>
          ["user", "assistant"].includes(message?.role) &&
          typeof message.content === "string" &&
          message.content.trim()
      )
      .slice(-10)
      .map((message) => ({
        role: message.role,
        content: message.content.trim().slice(0, 1600)
      }));
  }

  if (typeof input.message === "string" && input.message.trim()) {
    return [{ role: "user", content: input.message.trim().slice(0, 1600) }];
  }

  return [];
}

function getChinaDateParts() {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date()).map((part) => [part.type, part.value])
  );

  return {
    dateText: `${parts.year}年${parts.month}月${parts.day}日，${parts.weekday}`,
    timeText: `${parts.hour}:${parts.minute}`,
    fullText: `${parts.year}年${parts.month}月${parts.day}日，${parts.weekday}，北京时间 ${parts.hour}:${parts.minute}`
  };
}

function answerRealtimeQuestion(message) {
  const text = message.replace(/\s+/g, "");
  const asksTime = /(现在|当前|此刻)?(几点|时间|几时)/.test(text);
  const asksDate = /(今天|现在|当前)?(几号|日期|星期几|周几|哪天)/.test(text);

  if (!asksTime && !asksDate) return "";

  const date = getChinaDateParts();
  if (asksTime && asksDate) {
    return `现在是${date.fullText}。`;
  }
  if (asksTime) {
    return `现在是北京时间 ${date.timeText}。`;
  }
  return `今天是${date.dateText}。`;
}

function getFixedReply(message) {
  const text = message.toLowerCase().replace(/\s+/g, "");
  const match = siteKnowledge.fixedReplies?.find((item) =>
    item.keywords.some((keyword) => text.includes(String(keyword).toLowerCase()))
  );

  return match?.answer || "";
}

function needsWebVerification(message) {
  const text = message.toLowerCase();
  return [
    "最新",
    "现在",
    "目前",
    "今日",
    "今天",
    "新闻",
    "价格",
    "多少钱",
    "汇率",
    "天气",
    "排名",
    "热搜",
    "票房",
    "政策",
    "法规",
    "哪家公司",
    "谁是",
    "发生了什么",
    "还在吗",
    "官网吗",
    "网址",
    "链接"
  ].some((keyword) => text.includes(keyword));
}

function isSiteKnowledgeQuestion(message) {
  const text = message.toLowerCase();
  return [
    "jason",
    "邱深杰",
    "你",
    "网站",
    "作品",
    "案例",
    "服务",
    "合作",
    "报价",
    "联系方式",
    "邮箱",
    "电话",
    "擅长",
    "设计风格",
    "经历",
    "项目"
  ].some((keyword) => text.includes(keyword));
}

async function searchWeb(query) {
  if (!process.env.BRAVE_SEARCH_API_KEY) return null;

  const url = new URL(BRAVE_SEARCH_API_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("count", "5");
  url.searchParams.set("country", "CN");
  url.searchParams.set("search_lang", "zh-hans");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY
    }
  });

  if (!response.ok) return null;
  const data = await response.json().catch(() => null);
  const results = data?.web?.results || [];

  return results.slice(0, 5).map((item, index) => ({
    index: index + 1,
    title: item.title || "",
    url: item.url || "",
    description: item.description || ""
  }));
}

function formatSearchResults(results) {
  if (!Array.isArray(results) || !results.length) return "";
  return results
    .map(
      (item) =>
        `[${item.index}] ${item.title}\nURL: ${item.url}\n摘要: ${item.description}`
    )
    .join("\n\n");
}

function buildSystemPrompt(searchResults = null) {
  const currentDate = getChinaDateParts();
  const searchText = formatSearchResults(searchResults);

  return [
    `你是“${siteKnowledge.assistantName}”，也可以自然地自称“Jason的助手”。`,
    `当前真实日期和时间：${currentDate.fullText}。如果用户问今天几号、星期几或现在几点，只能使用这个时间，不要猜测。`,
    "",
    "最高优先级规则：真实准确比自然幽默更重要。不要编造，不要猜。",
    "",
    "信息来源规则：",
    "1. Jason 本人、网站、作品、服务、联系方式、经历、客户、报价、奖项等问题，只能依据下方“网站资料”回答。",
    `2. 如果用户询问 Jason 的具体事实，但网站资料里没有相关信息，就回答：“${siteKnowledge.fallback}”`,
    "3. 如果问题需要实时信息、新闻、价格、排名、政策、天气、链接、当前状态等，必须依据“联网搜索结果”回答。",
    "4. 如果没有提供联网搜索结果，不要假装知道实时信息；请说明“当前未配置联网搜索，无法核实这个实时信息”。",
    "5. 通用设计建议、创意讨论、排版、配色、作品集表达等不需要实时资料的问题，可以基于通用设计知识回答，但不要把通用建议说成 Jason 的亲身经历。",
    "",
    "聊天风格：",
    "1. 像真人一样自然对话，语气温和、松弛、有审美感，但不要为了显得有趣而牺牲准确性。",
    "2. 回答尽量具体、有帮助。能直接给建议时就给建议，必要时再追问 1 个关键问题。",
    "3. 中文默认简洁自然。普通聊天 1-3 段即可；方案建议可以分点，但不要太长。",
    "",
    searchText ? `联网搜索结果：\n${searchText}` : "联网搜索结果：未提供。",
    "",
    "网站资料：",
    buildSiteKnowledgeText()
  ].join("\n");
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }

  if (event.httpMethod === "GET") {
    return {
      statusCode: 302,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Location: "/"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const messages = normalizeMessages(body);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return json(400, { error: "Please send a user message." });
  }

  const userMessage = messages[messages.length - 1].content;

  const fixedReply = getFixedReply(userMessage);
  if (fixedReply) {
    return json(200, { answer: fixedReply });
  }

  const realtimeAnswer = answerRealtimeQuestion(userMessage);
  if (realtimeAnswer) {
    return json(200, { answer: realtimeAnswer });
  }

  let searchResults = null;
  if (needsWebVerification(userMessage)) {
    searchResults = await searchWeb(userMessage).catch(() => null);
  }

  if (
    needsWebVerification(userMessage) &&
    !isSiteKnowledgeQuestion(userMessage) &&
    !searchResults
  ) {
    return json(200, {
      answer:
        "这个问题需要联网核实，但当前后端还没有配置联网搜索服务，所以我不能给出确定答案。网站内关于 Jason 的资料我可以正常回答；实时新闻、价格、政策、链接、排名这类问题，需要先在 Netlify 环境变量里配置搜索服务。"
    });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return json(500, {
      error: "Server is missing DEEPSEEK_API_KEY."
    });
  }

  try {
    const upstream = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: body.model || DEFAULT_MODEL,
        temperature: searchResults ? 0.35 : 0.55,
        stream: false,
        messages: [{ role: "system", content: buildSystemPrompt(searchResults) }, ...messages]
      })
    });

    const data = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return json(upstream.status, {
        error: data?.error?.message || "DeepSeek request failed."
      });
    }

    const answer = data?.choices?.[0]?.message?.content?.trim();
    return json(200, {
      answer: answer || siteKnowledge.fallback
    });
  } catch {
    return json(502, {
      error: "Unable to reach DeepSeek right now."
    });
  }
}

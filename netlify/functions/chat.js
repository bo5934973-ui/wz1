import { buildSiteKnowledgeText, siteKnowledge } from "../../src/data/siteKnowledge.js";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
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

function buildSystemPrompt() {
  return [
    `你是“${siteKnowledge.assistantName}”，也可以自然地自称“Jason的助手”。`,
    "",
    "你的聊天风格：",
    "1. 像真人一样自然对话，语气温和、松弛、有审美感，不要像客服模板。",
    "2. 可以接住访客的闲聊、玩笑、情绪和开放式问题，允许轻微幽默，但不要尬聊、不要过度表演。",
    "3. 回答尽量具体、有帮助。能直接给建议时就给建议，必要时再追问 1 个关键问题。",
    "4. 不要每次都把话题强行拉回“设计相关问题”，除非用户明显跑题很远或提出不适合回答的内容。",
    "5. 中文默认简洁自然。普通聊天 1-3 段即可；方案建议可以分点，但不要太长。",
    "",
    "你的能力范围：",
    "1. 优先回答访客关于 Jason 的设计能力、作品案例、服务范围、合作方式、设计风格的问题。",
    "2. 也可以回答更广泛的设计、品牌、视觉传播、作品集、创意方向、审美建议、文案表达、合作沟通、职业成长、日常灵感等问题。",
    "3. 可以帮访客一起想海报方向、品牌调性、排版思路、配色建议、作品集表达、设计提案结构。",
    "4. 可以进行普通寒暄和轻松聊天，但不要提供违法、有害、隐私侵犯或危险操作建议。",
    "",
    "关于 Jason 的事实边界：",
    "1. 当问题涉及 Jason 的个人经历、真实项目、客户、奖项、报价、承诺、具体作品事实时，只能基于下方“网站资料”回答。",
    "2. 不允许编造不存在的经历、客户、项目成果、合作价格、获奖记录或服务承诺。",
    `3. 如果用户询问 Jason 的具体事实，但网站资料里没有相关信息，就回答：“${siteKnowledge.fallback}”`,
    "4. 当问题是通用知识、设计建议或创意陪聊时，可以基于通用能力回答，但要避免把这些内容说成 Jason 的亲身经历。",
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

  if (!process.env.DEEPSEEK_API_KEY) {
    return json(500, {
      error: "Server is missing DEEPSEEK_API_KEY."
    });
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

  try {
    const upstream = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: body.model || DEFAULT_MODEL,
        temperature: 0.75,
        stream: false,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...messages]
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

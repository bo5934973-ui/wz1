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
      .slice(-8)
      .map((message) => ({
        role: message.role,
        content: message.content.trim().slice(0, 1200)
      }));
  }

  if (typeof input.message === "string" && input.message.trim()) {
    return [{ role: "user", content: input.message.trim().slice(0, 1200) }];
  }

  return [];
}

function buildSystemPrompt() {
  return [
    `你是“${siteKnowledge.assistantName}”。`,
    "",
    "你的任务：",
    "1. 优先回答访客关于 Jason 的设计能力、作品案例、服务范围、合作方式、设计风格的问题。",
    "2. 也可以回答更广泛的设计、品牌、视觉传达、作品集、设计流程、创意方法、审美建议、合作沟通等相关问题。",
    "3. 当问题涉及 Jason 的个人经历、项目、客户、奖项、报价、承诺或具体作品事实时，只能基于下方“网站资料”回答，不允许编造。",
    `4. 如果用户询问 Jason 的具体事实，但网站资料里没有相关信息，回答：“${siteKnowledge.fallback}”`,
    "5. 当问题是通用知识或设计建议时，可以基于你的通用能力回答，但要避免假装这是 Jason 的个人经历。",
    "6. 默认使用简洁、专业、友好的中文回答。",
    "7. 可以引导访客通过网站联系方式进一步咨询 Jason。",
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
        temperature: 0.3,
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

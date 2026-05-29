import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handler as chatHandler } from "./netlify/functions/chat.js";

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function netlifyFunctionDevProxy() {
  return {
    name: "netlify-function-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/.netlify/functions/chat", async (request, response) => {
        const result = await chatHandler({
          httpMethod: request.method,
          headers: request.headers,
          body: await readRequestBody(request)
        });

        response.writeHead(result.statusCode || 200, result.headers || {});
        response.end(result.body || "");
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.DEEPSEEK_API_KEY && !process.env.DEEPSEEK_API_KEY) {
    process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
  }

  return {
    base: "./",
    plugins: [react(), netlifyFunctionDevProxy()],
    server: {
      host: "0.0.0.0",
      port: 5173
    }
  };
});

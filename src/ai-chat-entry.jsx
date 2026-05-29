import React from "react";
import { createRoot } from "react-dom/client";
import AIChatAssistant from "./components/AIChatAssistant.jsx";
import "./styles.css";

const root = document.getElementById("ai-chat-root");

if (root) {
  createRoot(root).render(<AIChatAssistant />);
}

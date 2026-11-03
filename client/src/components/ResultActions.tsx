"use client";
import { useState } from "react";
import { formatResultAsText, copyToClipboard, downloadJson } from "@/lib/exportResult";

export default function ResultActions({ result }: { result: any }) {
  const [status, setStatus] = useState("");

  async function handleCopy(kind: "text" | "json") {
    const text = kind === "text" ? formatResultAsText(result) : JSON.stringify(result, null, 2);
    const ok = await copyToClipboard(text);
    setStatus(ok ? "Copied!" : "Copy failed");
    setTimeout(() => setStatus(""), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => handleCopy("text")} aria-label="Copy result as text">
        Copy
      </button>
      <button type="button" onClick={() => handleCopy("json")} aria-label="Copy result as JSON">
        Copy JSON
      </button>
      <button
        type="button"
        onClick={() => downloadJson(result, `trustlayer-check-${Date.now()}.json`)}
        aria-label="Download result as JSON file"
      >
        Download JSON
      </button>
      <span aria-live="polite">{status}</span>
    </div>
  );
}
//** 마지막 수정본  */

// textPolisherWorker.js
self.onmessage = (e) => {
  const isLegacyFormat = typeof e.data === "string";
  const raw = isLegacyFormat ? e.data : e.data.text;
  const hasSymbols = isLegacyFormat ? null : e.data.hasSymbols;

  // 스마트 따옴표 변환 (그냥 문자열 치환만)
  const smartQuotes = (text) =>
    text
      .replace(/(^|[\s([{<])"(?=\S)/g, "$1“")
      .replace(/"/g, "”")
      .replace(/(^|[\s([{<])'(?=\S)/g, "$1‘")
      .replace(/'/g, "’");

  // ✅ Worker에서는 인라인 스타일 변환하지 않고 원본 그대로 반환
  function keepOriginal(text) {
    return text || "";
  }

  // & 텍스트 & 처리
  function processLineWithCenterMarks(line) {
    const parts = [];
    let currentIndex = 0;
    const centerPattern = /&([^&\n]+)&/g;
    let match;

    while ((match = centerPattern.exec(line)) !== null) {
      if (match.index > currentIndex) {
        const normalText = line.slice(currentIndex, match.index);
        if (normalText.trim()) {
          parts.push({
            type: "normal",
            text: smartQuotes(normalText), // 원본 + 스마트 따옴표
          });
        }
      }
      parts.push({
        type: "center",
        text: smartQuotes(match[1].trim()),
      });
      currentIndex = match.index + match[0].length;
    }

    if (currentIndex < line.length) {
      const remainingText = line.slice(currentIndex);
      if (remainingText.trim()) {
        parts.push({
          type: "normal",
          text: smartQuotes(remainingText),
        });
      }
    }

    if (parts.length === 0 && line.trim()) {
      parts.push({
        type: "normal",
        text: smartQuotes(line),
      });
    }

    return parts;
  }

  // 단순 텍스트 처리
  function simpleTextCleanup(rawText) {
    return rawText
      .split(/\n\s*\n/)
      .map((para) =>
        para
          .split("\n")
          .map((line) => ({
            type: "normal",
            text: smartQuotes(line.trim()),
          }))
          .filter((item) => item.text)
      )
      .filter((para) => para.length > 0);
  }

  // 기호가 있을 때 처리
  function processTextWithSymbols(rawText) {
    return rawText
      .split(/\n\s*\n/)
      .map((para) =>
        para.split("\n").flatMap((line) => {
          const trimmed = line.trim();
          if (!trimmed) return [];
          if (trimmed === "##") {
            return [
              {
                type: "spacer",
                size: "130px", // 👉 원하는 고정 높이
              },
            ];
          }
          if (trimmed.startsWith("&&")) {
            return [
              {
                type: "right",
                text: smartQuotes(trimmed.replace(/^&&\s*/, "")),
              },
            ];
          }

          if (trimmed.startsWith("&") && !trimmed.includes("&", 1)) {
            return [
              {
                type: "center",
                text: smartQuotes(trimmed.replace(/^&\s*/, "")),
              },
            ];
          }

          if (trimmed.includes("&")) {
            return processLineWithCenterMarks(line);
          }

          // 그냥 일반 텍스트 (스타일 태그 변환은 TextPolisher.jsx에서)
          return [{ type: "normal", text: smartQuotes(line) }];
        })
      )
      .filter((para) => para.length > 0);
  }

  // 메인 처리
  let paragraphs;
  let shouldProcessSymbols = hasSymbols;
  if (shouldProcessSymbols === null) {
    shouldProcessSymbols = /[&#*~_]{1,2}/.test(raw);
  }

  if (!shouldProcessSymbols) {
    paragraphs = simpleTextCleanup(raw);
  } else {
    paragraphs = processTextWithSymbols(raw);
  }

  self.postMessage(paragraphs);
};

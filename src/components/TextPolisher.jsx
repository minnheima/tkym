import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getCached, setCached } from "./indexedDB";

const Blank = styled.span`
  display: block;
  height: 0.5em;
`;

const Enter = styled.div`
  height: 1em;
`;
// 간단 해시
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash.toString();
}

// 스마트 따옴표 변환
const smartQuotes = (text) =>
  text
    .replace(/(^|[\s([{<])"(?=\S)/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([{<])'(?=\S)/g, "$1‘")
    .replace(/'/g, "’");

// 인라인 스타일 변환 함수 (React Element 반환)
function applyInlineStyles(text) {
  if (!text || typeof text !== "string") return text;

  const patterns = [
    { regex: /\*\*(.*?)\*\*/g, wrap: (c, k) => <strong key={k}>{c}</strong> },
    { regex: /\*(.*?)\*/g, wrap: (c, k) => <em key={k}>{c}</em> },
    { regex: /__(.*?)__/g, wrap: (c, k) => <u key={k}>{c}</u> },
    { regex: /~~(.*?)~~/g, wrap: (c, k) => <del key={k}>{c}</del> },
  ];

  let elements = [text];
  let key = 0;

  for (const { regex, wrap } of patterns) {
    const next = [];
    for (const segment of elements) {
      if (typeof segment !== "string") {
        next.push(segment);
        continue;
      }
      let lastIndex = 0,
        m;
      while ((m = regex.exec(segment)) !== null) {
        if (m.index > lastIndex) next.push(segment.slice(lastIndex, m.index));
        next.push(wrap(m[1], key++));
        lastIndex = m.index + m[0].length;
      }
      if (lastIndex < segment.length) next.push(segment.slice(lastIndex));
    }
    elements = next;
  }
  return elements;
}

// 줄 내에서 & 감싸진 텍스트 처리
function processLineWithCenterMarks(line) {
  const parts = [];
  let currentIndex = 0;

  // & 텍스트 & 패턴을 찾기 위한 정규식
  const centerPattern = /&([^&\n]+)&/g;
  let match;

  while ((match = centerPattern.exec(line)) !== null) {
    // & 앞의 일반 텍스트
    if (match.index > currentIndex) {
      const normalText = line.slice(currentIndex, match.index);
      if (normalText.trim()) {
        parts.push({
          type: "normal",
          text: applyInlineStyles(normalText),
        });
      }
    }

    // & 감싸진 가운데 정렬 텍스트
    parts.push({
      type: "center",
      text: applyInlineStyles(match[1].trim()),
    });

    currentIndex = match.index + match[0].length;
  }

  // 마지막 남은 일반 텍스트
  if (currentIndex < line.length) {
    const remainingText = line.slice(currentIndex);
    if (remainingText.trim()) {
      parts.push({
        type: "normal",
        text: applyInlineStyles(remainingText),
      });
    }
  }

  // & 패턴이 없으면 전체를 일반 텍스트로 처리
  if (parts.length === 0 && line.trim()) {
    parts.push({
      type: "normal",
      text: applyInlineStyles(line),
    });
  }

  return parts;
}

// 텍스트 모드 처리
function processText(rawText) {
  // ✅ 먼저 특수 기호가 있는지 확인
  const hasSpecialMarks = /[&#*~_]{1,2}/.test(rawText);

  if (!hasSpecialMarks) {
    // 특수 기호가 없으면 간단한 단락 분리만 수행
    return rawText
      .split(/\n\s*\n/)
      .map((para) => {
        return para
          .split("\n")
          .map((line) => ({
            type: "normal",
            text: smartQuotes(line.trim()),
          }))
          .filter((item) => item.text); // 빈 줄 제거
      })
      .filter((para) => para.length > 0); // 빈 단락 제거
  }

  // 특수 기호가 있을 때만 복잡한 처리 수행
  return rawText.split(/\n\s*\n/).map((para) => {
    return para.split("\n").flatMap((line) => {
      const trimmed = line.trim();

      if (!trimmed) return [];

      // ✅ 줄 전체가 &&& 인 경우
      if (trimmed === "##") {
        return [
          {
            type: "spacer",
            size: "130px", // 👉 원하는 고정 높이
          },
        ];
      }
      // ✅ 오른쪽 정렬 (기존 기능 유지)
      if (trimmed.startsWith("&&")) {
        return [
          {
            type: "right",
            text: applyInlineStyles(trimmed.replace(/^&&\s*/, "")),
          },
        ];
      }

      // ✅ 줄 시작 가운데 정렬 (기존 기능 유지)
      if (trimmed.startsWith("&") && !trimmed.includes("&", 1)) {
        return [
          {
            type: "center",
            text: applyInlineStyles(trimmed.replace(/^&\s*/, "")),
          },
        ];
      }

      // ✅ & 텍스트 & 형식으로 감싸진 텍스트 처리
      if (trimmed.includes("&")) {
        return processLineWithCenterMarks(line);
      }

      // ✅ 인라인 스타일이 있는지 확인
      if (/[*~_#]{1,2}/.test(trimmed)) {
        const protectedLine = line.replace(/(\d+)\./g, "$1@@DOT@@");
        const punctuationCount = (protectedLine.match(/[.?!]/g) || []).length;
        const splitSentences =
          punctuationCount <= 1
            ? protectedLine.split(/(?<=[.?!])\s+(?=[""]?\p{L})/u)
            : [protectedLine];
        return splitSentences.map((s) => ({
          type: "normal",
          text: applyInlineStyles(
            smartQuotes(String(s.replace(/@@DOT@@/g, ".")))
          ),
        }));
      }

      // ✅ 완전히 일반적인 텍스트
      return [
        {
          type: "normal",
          text: smartQuotes(line),
        },
      ];
    });
  });
}

export default function TextPolisher({
  raw = "",
  className = "",
  hasSymbols = "",
}) {
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(false);

  const workerRef = useRef(null);
  const abortRef = useRef(null);

  // 컴포넌트 언마운트 시 워커 종료
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Web Worker로 텍스트 처리
  const processInWorker = (text) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        try {
          workerRef.current = new Worker(
            new URL("./textPolisherWorker.js", import.meta.url)
          );
        } catch (err) {
          reject(err);
          return;
        }
      }

      const worker = workerRef.current;
      const onMessage = (e) => {
        cleanup();
        resolve(e.data);
      };
      const onError = (err) => {
        cleanup();
        reject(err);
      };
      const cleanup = () => {
        worker.removeEventListener("message", onMessage);
        worker.removeEventListener("error", onError);
      };

      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);
      worker.postMessage(text);
    });
  };

  useEffect(() => {
    if (!raw) {
      setParagraphs([]);
      return;
    }

    setLoading(true);

    // 텍스트 처리: 캐시 + 워커 처리
    const key = `polished_${simpleHash(raw)}`;
    let cancelled = false;
    abortRef.current = () => {
      cancelled = true;
    };

    (async () => {
      try {
        const cached = await getCached(key);
        if (cached && !cancelled) {
          setParagraphs(cached);
          return;
        }

        let processed;
        try {
          processed = await processInWorker(raw);
        } catch {
          processed = processText(raw);
        }

        if (!cancelled) {
          setParagraphs(processed);
          setCached(key, processed);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [raw]);

  if (loading) {
    return (
      <div className={className}>
        <div style={{ textAlign: "center", margin: "1em 0" }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 텍스트 전용 모드 */}
      {paragraphs.map((parts, i) => (
        <div key={i} style={{ marginBottom: "1em" }}>
          {parts.map((part, j) => {
            if (part.type === "spacer") {
              return <div key={j} style={{ height: part.size || "1em" }} />;
            }
            if (part.type === "center") {
              return (
                <div key={j} style={{ textAlign: "center", margin: "0.5em 0" }}>
                  {Array.isArray(part.text)
                    ? part.text
                    : applyInlineStyles(part.text || "")}
                </div>
              );
            }
            if (part.type === "right") {
              return (
                <div key={j} style={{ textAlign: "right", margin: "0.5em 0" }}>
                  {Array.isArray(part.text)
                    ? part.text
                    : applyInlineStyles(part.text || "")}
                </div>
              );
            }

            return (
              <div key={j} style={{ display: "inline" }}>
                {Array.isArray(part.text)
                  ? part.text
                  : applyInlineStyles(part.text || "")}
                {j < parts.length - 1 && <Blank />}
              </div>
            );
          })}
          {i < paragraphs.length - 1 && <Enter style={{ height: "1em" }} />}
        </div>
      ))}
    </div>
  );
}

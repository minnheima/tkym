function FicContent({ content }) {
  const paragraphs = content.split(/\n\s*\n/); // 문단 기준 나누기

  function smartQuotes(text) {
    let isDoubleOpen = true;

    return (
      text
        // 쌍따옴표: " → “ 또는 ”
        .replace(/"/g, () =>
          isDoubleOpen
            ? ((isDoubleOpen = false), "“")
            : ((isDoubleOpen = true), "”")
        )
        // 홑따옴표: 아포스트로피 제외 처리
        .replace(/(\W|^)'(?=\w)/g, (_, p1) => {
          // 단어 앞의 열림 홑따옴표 → ‘
          return p1 + "‘";
        })
        .replace(/(\w)'/g, (_, p1) => {
          // 단어 뒤의 닫힘 홑따옴표 → ’
          return p1 + "’";
        })
    );
  }
  return (
    <div className="fic-content">
      {paragraphs.map((para, i) => {
        // 먼저 줄 단위로 split
        const lines = para.split("\n");

        const processedLines = lines.flatMap((line) => {
          // 숫자 다음 마침표 (예: 13.)는 보존되도록 일단 skip 처리
          const protectedLine = line.replace(/(\d+)\./g, "$1@@DOT@@");

          // // 문장 구분용: 마침표, 느낌표, 물음표 뒤에 공백이 있고, 다음에 글자가 나오는 경우 split
          // const sentenceSplit = protectedLine
          //   .split(/(?<=[.?!])\s+(?=["“”‘’]?\p{L})/u)
          //   .map((s) => smartQuotes(s.replace(/@@DOT@@/g, "."))); // 보호한 마침표 복구

          // return sentenceSplit;

          // 마침표/느낌표/물음표 개수 체크
          const punctuationCount = (protectedLine.match(/[.?!]/g) || []).length;

          // 마침표가 1개 이하일 때만 split
          let splitSentences =
            punctuationCount <= 1
              ? protectedLine.split(/(?<=[.?!])\s+(?=["“”‘’]?\p{L})/u)
              : [protectedLine];

          // smartQuotes 적용 + 마침표 복구
          return splitSentences.map((s) =>
            smartQuotes(s.replace(/@@DOT@@/g, "."))
          );
        });

        return (
          <p key={i}>
            {processedLines.map((part, j) => (
              <span key={j}>
                {part}
                {j < processedLines.length - 1 && <br />}
              </span>
            ))}
            {i < paragraphs.length - 1 && (
              <>
                <br />
                <br />
              </>
            )}
          </p>
        );
      })}
    </div>
  );
}
export default FicContent;

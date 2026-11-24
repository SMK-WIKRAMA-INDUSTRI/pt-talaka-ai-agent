function parseInlineFormatting(text, keyPrefix) {
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`${keyPrefix}-b-${idx++}`} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={`${keyPrefix}-i-${idx++}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={`${keyPrefix}-c-${idx++}`}
          className="rounded-md bg-slate-100 border border-slate-200 px-1.5 py-0.5 font-mono text-[11.5px] text-slate-800"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function FormattedMessage({ content }) {
  const cleanedContent = String(content || '')
    .replace(/\[TALAKA_CHECKOUT\][\s\S]*?\[\/TALAKA_CHECKOUT\]/g, '')
    .trim();
  const lines = cleanedContent.split('\n');
  const blocks = [];
  let listItems = [];
  let listType = null;

  function flushList(keyBase) {
    if (listItems.length === 0) return;
    const Tag = listType === 'ol' ? 'ol' : 'ul';
    const listClass =
      listType === 'ol'
        ? 'list-decimal pl-5 space-y-1'
        : 'list-disc pl-5 space-y-1';

    blocks.push(
      <Tag key={`list-${keyBase}`} className={listClass}>
        {listItems.map((item, i) => (
          <li key={i}>{parseInlineFormatting(item, `${keyBase}-li-${i}`)}</li>
        ))}
      </Tag>
    );
    listItems = [];
    listType = null;
  }

  lines.forEach((rawLine, index) => {
    const line = rawLine.trimEnd();
    const bulletMatch = /^\s*[-*]\s+(.+)$/.exec(line);
    const orderedMatch = /^\s*\d+\.\s+(.+)$/.exec(line);

    if (bulletMatch) {
      if (listType && listType !== 'ul') flushList(index);
      listType = 'ul';
      listItems.push(bulletMatch[1]);
      return;
    }

    if (orderedMatch) {
      if (listType && listType !== 'ol') flushList(index);
      listType = 'ol';
      listItems.push(orderedMatch[1]);
      return;
    }

    flushList(index);

    if (!line.trim()) {
      return;
    }

    blocks.push(
      <p key={`p-${index}`}>{parseInlineFormatting(line, `p-${index}`)}</p>
    );
  });

  flushList('end');

  return <div className="space-y-2 leading-relaxed">{blocks}</div>;
}

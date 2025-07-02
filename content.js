(async function saveFullChat() {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const scrollContainer = document.querySelector('[class*="scroll"]');
  if (!scrollContainer) {
    alert("Chat scroll container not found.");
    return;
  }

  let last = -1;
  while (scrollContainer.scrollTop !== last) {
    last = scrollContainer.scrollTop;
    scrollContainer.scrollTop = 0;
    await delay(400);
  }

  await delay(500);

  const messages = document.querySelectorAll('[data-message-author-role]');
  if (messages.length === 0) {
    alert("No messages found.");
    return;
  }

  const printable = document.createElement("div");

  messages.forEach(msg => {
    const cloned = msg.cloneNode(true);

    // Remove "Copy" and "Edit" buttons
    cloned.querySelectorAll('button, svg, [aria-label="Copy code"], [aria-label="Edit"]').forEach(el => el.remove());

    printable.appendChild(cloned);
  });

  const printWindow = window.open("", "", "width=900,height=800");
  printWindow.document.write(`
    <html>
    <head>
      <title>ChatGPT Chat</title>
      <style>
  body {
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    background: white;
    color: #1e1e1e;
    padding: 60px;
    line-height: 1.6;
  }

  [data-message-author-role="user"] {
    background-color: #f0f4f9;
    padding: 14px 18px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  [data-message-author-role="assistant"] {
    background-color: #e9ecef;
    padding: 14px 18px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  code {
    font-family: Consolas, Monaco, monospace;
    background: #f6f8fa;
    padding: 2px 4px;
    border-radius: 4px;
  }

  pre {
    background: #f6f8fa;
    padding: 14px;
    border-radius: 8px;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: visible !important;
    max-height: none !important;
  }

  h1, h2, h3, h4, h5 {
    font-weight: 600;
    margin: 1em 0 0.5em;
  }

  ul, ol {
    padding-left: 1.5em;
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  blockquote {
    border-left: 4px solid #ccc;
    padding-left: 1em;
    color: #555;
    margin: 1em 0;
  }

  table, th, td {
  border: 1px solid #999 !important;
  border-collapse: collapse !important;
  padding: 8px !important;
}

table {
  width: 100% !important;
  margin-bottom: 20px;
}
</style>
    </head>
    <body>${printable.innerHTML}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  await delay(300);
  printWindow.print();
})();

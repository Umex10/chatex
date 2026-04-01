const fs = require('fs');
const filepath = '/home/umejr/IdeaProjects/chatex/frontend/src/utils/joinedDate.ts';
let code = fs.readFileSync(filepath, 'utf8');

code = code.replace(
  /export function joinedShoutDate\(createdAt: string\) {[\s\S]*?return `\$\{day\}\. \$\{month\} \$\{year\}`;/g,
`export function joinedShoutDate(createdAt: string) {

  let dateString = createdAt;
  if (dateString && !dateString.endsWith("Z") && dateString.includes("T")) {
    dateString += "Z"; // Assuming backend sends unzoned UTC
  }
  
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Date unknown";
  }

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return \`\${diffMins} min\${diffMins !== 1 ? 's' : ''} ago\`;
  if (diffHours < 24) return \`\${diffHours} hour\${diffHours !== 1 ? 's' : ''} ago\`;
  if (diffHours < 48) return "Yesterday";

  const day = date.getDate();
  const month = date.toLocaleString('en-EN', { month: 'long' });
  const year = date.getFullYear();

  return \`\${day}. \${month} \${year}\`;`
);

fs.writeFileSync(filepath, code);

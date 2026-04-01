const fs = require('fs');

function applyTo(path, oldText, newText) {
  if (fs.existsSync(path)) {
    let text = fs.readFileSync(path, 'utf8');
    if (text.includes(oldText) && !text.includes(newText)) {
      text = text.replace(oldText, newText);
      fs.writeFileSync(path, text);
    }
  }
}

// 1. Fix User Profile Page 
const profilePage = '/home/umejr/IdeaProjects/chatex/frontend/src/app/(appshell)/(account)/[username]/page.tsx';
applyTo(profilePage, 
  `<h4 className='flex gap-1'\n              onClick={() => router.push(\`\${username}/following\`)}`, 
  `<h4 className='flex gap-1 cursor-pointer hover:underline'\n              onClick={() => router.push(\`\${username}/following\`)}`);
applyTo(profilePage, 
  `<h4 className='flex gap-1'\n              onClick={() => router.push(\`\${username}/followers\`)}`, 
  `<h4 className='flex gap-1 cursor-pointer hover:underline'\n              onClick={() => router.push(\`\${username}/followers\`)}`);

// 2. Fix ShoutInstance.tsx
const shoutInstance = '/home/umejr/IdeaProjects/chatex/frontend/src/components/shout/ShoutInstance.tsx';
let shoutInstContent = fs.readFileSync(shoutInstance, 'utf8');
shoutInstContent = shoutInstContent.replace(/<span className='font-bold max-w-\[80px\] truncate[\s\n]*md:max-w-none md:whitespace-normal'[\s\n]*onClick=\{\(e\) => \{ pushToAccount\(e\) \}\}>\{name\}<\/span>/g, 
  `<span className='font-bold max-w-[80px] truncate md:max-w-none md:whitespace-normal cursor-pointer hover:underline' onClick={(e) => { pushToAccount(e) }}>{name}</span>`);
shoutInstContent = shoutInstContent.replace(/<span className='max-w-\[80px\] truncate[\s\n]*md:max-w-none md:whitespace-normal'[\s\n]*onClick=\{\(e\) => \{ pushToAccount\(e\) \}\}>@\{username\}<\/span>/g, 
  `<span className='max-w-[80px] truncate md:max-w-none md:whitespace-normal cursor-pointer hover:underline' onClick={(e) => { pushToAccount(e) }}>@{username}</span>`);
fs.writeFileSync(shoutInstance, shoutInstContent);

// 3. Fix ShoutView.tsx
const shoutView = '/home/umejr/IdeaProjects/chatex/frontend/src/components/shout/ShoutView.tsx';
if(fs.existsSync(shoutView)){
  let sv = fs.readFileSync(shoutView, 'utf8');
  sv = sv.replace(/<span className='font-bold max-w-\[80px\] truncate[\s\n]*md:max-w-none md:whitespace-normal'[\s\n]*onClick=\{\(e\) => \{ pushToAccount\(e\) \}\}>\{name\}<\/span>/g, 
    `<span className='font-bold max-w-[80px] truncate md:max-w-none md:whitespace-normal cursor-pointer hover:underline' onClick={(e) => { pushToAccount(e) }}>{name}</span>`);
  sv = sv.replace(/<span className='max-w-\[80px\] truncate[\s\n]*md:max-w-none md:whitespace-normal'[\s\n]*onClick=\{\(e\) => \{ pushToAccount\(e\) \}\}>@\{username\}<\/span>/g, 
    `<span className='max-w-[80px] truncate md:max-w-none md:whitespace-normal cursor-pointer hover:underline' onClick={(e) => { pushToAccount(e) }}>@{username}</span>`);
  fs.writeFileSync(shoutView, sv);
}


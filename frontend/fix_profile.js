const fs = require('fs');
const profilePage = '/home/umejr/IdeaProjects/chatex/frontend/src/app/(appshell)/(account)/[username]/page.tsx';
let txt = fs.readFileSync(profilePage, 'utf8');

txt = txt.replace(/<h4 className='flex gap-1'[\s\S]*?onClick=\{\(\) => router.push\(`\$\{username\}\/following`\)\}/g, `<h4 className='flex gap-1 cursor-pointer hover:underline'\n              onClick={() => router.push(\`\${username}/following\`)}`);
txt = txt.replace(/<h4 className='flex gap-1'[\s\S]*?onClick=\{\(\) => router.push\(`\$\{username\}\/followers`\)\}/g, `<h4 className='flex gap-1 cursor-pointer hover:underline'\n              onClick={() => router.push(\`\${username}/followers\`)}`);

fs.writeFileSync(profilePage, txt);

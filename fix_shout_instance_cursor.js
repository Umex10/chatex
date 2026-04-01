const fs = require('fs');
const files = [
  '/home/umejr/IdeaProjects/chatex/frontend/src/components/shout/ShoutInstance.tsx',
  '/home/umejr/IdeaProjects/chatex/frontend/src/components/shout/ShoutView.tsx'
];

for(const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');
  
  // Make images clickable
  code = code.replace(/className="relative row-span-2"/g, 'className="relative row-span-2 cursor-pointer hover:opacity-90 transition-opacity"');
  code = code.replace(/className="relative"/g, 'className="relative cursor-pointer hover:opacity-90 transition-opacity"');
  code = code.replace(/className="w-full h-80 relative"/g, 'className="w-full h-80 relative cursor-pointer hover:opacity-90 transition-opacity"');
  
  // Make main shout clickable if it has onClick pushing to shout page
  code = code.replace(/className="flex flex-col gap-2 relative bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 transition-colors"/g, 
  'className="flex flex-col gap-2 relative bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 transition-colors cursor-pointer"');
  
  
  fs.writeFileSync(file, code);
}
console.log("Applied cursor-pointer to ShoutInstance images and wrapper");

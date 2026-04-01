const fs = require('fs');

const sbPath = '/home/umejr/IdeaProjects/chatex/frontend/src/components/layout/Sidebar.tsx';
let sb = fs.readFileSync(sbPath, 'utf8');

sb = sb.replace(
  '<h4 className="text-xl font-bold dark:text-gray-100">{user.followingCount}</h4>',
  '<h4 className="text-xl font-bold dark:text-gray-100 cursor-pointer hover:underline cursor-pointer">{user.followingCount}</h4>'
).replace(
  '<h5 className="text-xs text-gray-500 font-semibold">Following</h5>',
  '<h5 className="text-xs text-gray-500 font-semibold cursor-pointer hover:underline">Following</h5>'
).replace(
  '<h4 className="text-xl font-bold dark:text-gray-100">{user.followerCount}</h4>',
  '<h4 className="text-xl font-bold dark:text-gray-100 cursor-pointer hover:underline cursor-pointer">{user.followerCount}</h4>'
).replace(
  '<h5 className="text-xs text-gray-500 font-semibold cursor-pointer">Followers</h5>',
  '<h5 className="text-xs text-gray-500 font-semibold cursor-pointer hover:underline">Followers</h5>'
).replace(
  '<h5 className="text-xs text-gray-500 font-semibold">Followers</h5>',
  '<h5 className="text-xs text-gray-500 font-semibold cursor-pointer hover:underline">Followers</h5>'
);

fs.writeFileSync(sbPath, sb);

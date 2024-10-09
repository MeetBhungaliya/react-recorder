import { Link } from '@tanstack/react-router';
import { FileUp, Home } from 'lucide-react';

import { Route as HomeRoute } from '@/routes';
import { Route as FilesRoute } from '@/routes/files';

const Sidebar = () => {
  return (
    <aside className="min-w-[200px] lg:min-w-[20%] px-4 py-10 space-y-2 bg-gray-200 shadow-md">
      <Link
        to={HomeRoute.to}
        className="px-3 py-2 rounded-md flex items-center gap-x-2 transition-colors group hover:bg-gray-300"
        activeProps={{ className: 'bg-gray-300' }}>
        <Home className="size-6" />
        <div className="relative">
          <span className="text-lg font-semibold">Home</span>
          <span className="w-0 h-[1.5px] group-hover:w-full bg-black bottom-1 left-0 absolute transition-all" />
        </div>
      </Link>
      <Link
        to={FilesRoute.to}
        className="px-3 py-2 rounded-md flex items-center gap-x-2 transition-colors group hover:bg-gray-300"
        activeProps={{ className: 'bg-gray-300' }}>
        <FileUp className="size-6" />
        <div className="relative">
          <span className="text-lg font-semibold">File</span>
          <span className="w-0 h-[1.5px] group-hover:w-full bg-black bottom-1 left-0 absolute transition-all" />
        </div>
      </Link>
    </aside>
  );
};

export default Sidebar;

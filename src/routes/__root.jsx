import React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import Sidebar from '@/component/sidebar/Sidebar';

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <TanStackRouterDevtools />
      <div className="w-full h-dvh flex bg-slate-100 overflow-hidden">
        <Sidebar />
        <Outlet />
      </div>
    </React.Fragment>
  )
});

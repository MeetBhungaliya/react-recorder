import Sidebar from '@/component/sidebar/Sidebar';
import useRecorderStore from '@/hooks/useRecorder';
import useStreamStore from '@/hooks/useStream';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import React, { useEffect } from 'react';

export const Route = createRootRoute({
  component: Root
});

function Root() {
  const queryClient = new QueryClient();

  const { initStream } = useStreamStore();
  const { initStore } = useRecorderStore();

  useEffect(() => {
    initStream();
    initStore();
  }, [initStream, initStore]);

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <TanStackRouterDevtools />
        <div className="w-full h-dvh flex bg-slate-100 overflow-hidden">
          <Sidebar />
          <Outlet />
        </div>
      </QueryClientProvider>
    </React.Fragment>
  );
}

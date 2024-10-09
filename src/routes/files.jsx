import Upload from '@/component/file/Upload';
import { ScrollArea } from '@/components/ui/scroll-area';
import useRecorderStore from '@/hooks/useRecorder';
import { createFileRoute } from '@tanstack/react-router';
import { Upload as UploadIcon } from 'lucide-react';

export const Route = createFileRoute('/files')({
  component: Files
});

function Files() {
  const { videos } = useRecorderStore();

  return (
    <section className="h-full w-full p-10 flex flex-col overflow-hidden">
      <div className="h-full rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 shadow-sm flex flex-col items-center gap-y-1 bg-gray-300">
          <UploadIcon className="size-7" />
          <p className="text-xl font-semibold">Click to upload or drag and drop</p>
        </div>
        <ScrollArea className="p-4 rounded-b-xl bg-gray-200">
          <div className='flex flex-col gap-y-4'>
            {videos.map((file) => {
              return <Upload key={file.id} data={file} />;
            })}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}

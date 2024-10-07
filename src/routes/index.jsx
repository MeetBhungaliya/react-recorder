import { Button } from '@/components/ui/button';
import useRecorderStore from '@/hooks/useRecorder';
import useStreamStore from '@/hooks/useStream';
import { base64ToBlob, cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/')({
  component: Index
});

function Index() {
  const { initStream, stream } = useStreamStore();
  const {
    initStore,
    startRecording,
    stopRecording,
    recording: isRecording,
    videos
  } = useRecorderStore();

  const videoRef = useRef(null);

  useEffect(() => {
    initStream();
    initStore();
  }, []);

  useEffect(() => {
    if (!stream || !videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    const blob = base64ToBlob(videos.at(-1).assets, 'video/mp4');
    link.href = URL.createObjectURL(blob);
    link.download = 'fileName';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full p-10 pb-0 flex flex-col border overflow-hidden">
      <div className="w-full h-full flex justify-center items-center">
        <video ref={videoRef} autoPlay muted className="w-full object-fill"></video>
      </div>

      <div className="py-10">
        <Button
          variant="outlined"
          className={cn(
            'px-5 py-2 text-lg font-semibold rounded-lg text-white',
            isRecording ? 'bg-red-600' : ' bg-green-600'
          )}
          onClick={toggleRecording}>
          {isRecording ? 'Stop' : 'Start'} Recording
        </Button>
        <Button onClick={handleDownload}>Download</Button>
      </div>
    </div>
  );
}

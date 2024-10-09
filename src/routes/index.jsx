import { Button } from '@/components/ui/button';
import useRecorderStore from '@/hooks/useRecorder';
import useStreamStore from '@/hooks/useStream';
import { base64ToBlob, cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/')({
  component: Index
});

function Index() {
  const { stream, audio, video, toggleAudio, toggleVideo } = useStreamStore();
  const { startRecording, stopRecording, recording: isRecording, videos } = useRecorderStore();

  const videoRef = useRef(null);

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
      <div className="w-full h-full flex justify-evenly items-center overflow-hidden">
        <div>
          <Button
            className={cn(
              'p-0 w-12 aspect-square',
              audio ? 'bg-green-600 hover:bg-green-800' : ' bg-red-600 hover:bg-red-800'
            )}
            onClick={toggleAudio}>
            {audio ? <Mic className="size-6" /> : <MicOff className="size-6" />}
          </Button>
        </div>
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full max-w-3xl rounded-lg overflow-hidden"></video>
        <div>
          <Button
            className={cn(
              'p-0 w-12 aspect-square',
              video ? 'bg-green-600 hover:bg-green-800' : ' bg-red-600 hover:bg-red-800'
            )}
            onClick={toggleVideo}>
            {video ? <Camera className="size-6" /> : <CameraOff className="size-6" />}
          </Button>
        </div>
      </div>

      <div className="py-10 flex justify-center gap-x-5">
        <Button
          variant="outlined"
          className={cn(
            'w-full max-w-40 px-5 py-2 text-lg font-semibold rounded-lg text-white',
            isRecording ? 'bg-red-600' : ' bg-green-600'
          )}
          onClick={toggleRecording}>
          {isRecording ? 'Stop' : 'Start'} Recording
        </Button>
        <Button
          className="w-full max-w-40 px-5 py-2 text-lg font-semibold rounded-lg"
          onClick={handleDownload}>
          Download
        </Button>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MIMETYPE, UPLOAD_CHUNK_SIZE } from '@/lib/constant';
import { updateFile } from '@/lib/indexedDB';
import { formatFileSize } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { File, FileVideo, Pause, Play, Trash, Upload as UploadIcon } from 'lucide-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { memo, useMemo, useState, useRef } from 'react';

const Upload = ({ data }) => {
  const initialUploadProgress = {
    chunk_index: data.upload_status ? data.upload_status.uploaded_chunks : 0,
    total_chunks: data.upload_status
      ? data.upload_status.total_chunks
      : Math.ceil(data.assets.length / UPLOAD_CHUNK_SIZE)
  };

  const initialUploadState =
    data.upload_status && data.upload_status.uploaded_chunks === data.upload_status.total_chunks
      ? 'completed'
      : data.upload_status && data.upload_status.uploaded_chunks > 0
        ? 'uploading'
        : 'not_started';

  const [uploadProgress, setUploadProgress] = useState(initialUploadProgress);
  const [uploadState, setUploadState] = useState(initialUploadState); // 'not_started', 'uploading', 'paused', 'completed'
  const isPaused = useRef(false); // Ref to track pause state

  const uploadPercentage = useMemo(() => {
    const { chunk_index, total_chunks } = uploadProgress;
    return ((chunk_index / total_chunks) * 100).toFixed(2);
  }, [uploadProgress.chunk_index, uploadProgress.total_chunks]);

  const { mutateAsync } = useMutation({
    mutationKey: [data.filename, uploadProgress.chunk_index],
    mutationFn: async (payload) => {
      const res = await axios.post('http://localhost:6969/api/v1/upload', {
        file_id: data.id,
        chunk: payload
      });

      return res;
    }
  });

  const handleUploadFile = async () => {
    setUploadState('uploading');
    isPaused.current = false; // Reset pause state

    for (
      let chunkIndex = uploadProgress.chunk_index;
      chunkIndex < uploadProgress.total_chunks;
      chunkIndex++
    ) {
      if (isPaused.current) {
        break; // Exit loop if paused
      }

      const start = chunkIndex * UPLOAD_CHUNK_SIZE;
      const end = Math.min(data.assets.length, start + UPLOAD_CHUNK_SIZE);
      const chunk = data.assets.slice(start, end);

      await mutateAsync(chunk);

      await updateFile({
        ...data,
        upload_status: {
          total_chunks: uploadProgress.total_chunks,
          uploaded_chunks: chunkIndex + 1
        }
      });

      setUploadProgress((prevState) => ({
        ...prevState,
        chunk_index: chunkIndex + 1
      }));
    }

    if (!isPaused.current) {
      setUploadState('completed');
    }
  };

  const handlePauseUpload = () => {
    setUploadState('paused');
    isPaused.current = true; // Set pause state
  };

  const handleResumeUpload = () => {
    setUploadState('uploading');
    handleUploadFile(); // Restart the upload from the paused state
  };

  const handleRemoveUpload = () => {
    // Implement your remove logic here
    console.log('Remove upload');
  };

  const renderButton = () => {
    switch (uploadState) {
      case 'uploading':
        return (
          <Button className="px-4 text-sm gap-x-2" onClick={handlePauseUpload}>
            <Pause className="size-4" />
            Pause
          </Button>
        );
      case 'paused':
        return (
          <Button className="px-4 text-sm gap-x-2" onClick={handleResumeUpload}>
            <Play className="size-4" />
            Resume
          </Button>
        );
      case 'completed':
        return (
          <Button className="px-4 text-sm gap-x-2" onClick={handleRemoveUpload}>
            <Trash className="size-4" />
            Remove
          </Button>
        );
      default:
        return (
          <Button className="px-4 text-sm gap-x-2" onClick={handleUploadFile}>
            <UploadIcon className="size-4" />
            Upload
          </Button>
        );
    }
  };

  return (
    <div className="px-3 py-2 flex items-center gap-x-[10px] rounded-md bg-slate-100">
      {data.mimeType === MIMETYPE ? <FileVideo className="size-6" /> : <File className="size-6" />}
      <div className="w-full flex flex-col gap-y-1">
        <div className="flex justify-between">
          <div className="flex flex-col gap-y-[1px]">
            <p className="text-sm capitalize">
              {data.mimeType.split('/')[0]} ~ {moment(data.filename).format('LLL')}
            </p>
            <p className="font-medium text-xs">{formatFileSize(data.size)}</p>
          </div>
          {renderButton()}
        </div>
        <div className="flex items-center gap-x-1">
          <Progress value={uploadPercentage} />
          <span className="min-w-9 text-center text-sm font-semibold">{uploadPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

Upload.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    filename: PropTypes.number,
    assets: PropTypes.string,
    mimeType: PropTypes.string,
    size: PropTypes.number,
    is_audio_available: PropTypes.bool,
    upload_status: PropTypes.oneOfType([
      PropTypes.shape({
        uploaded_chunks: PropTypes.number.isRequired,
        total_chunks: PropTypes.number.isRequired
      }),
      PropTypes.oneOf([null])
    ])
  }).isRequired
};

export default memo(Upload);

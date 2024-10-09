import { CODECTYPE, MIMETYPE } from '@/lib/constant';
import { getAllFiles, saveVideo } from '@/lib/indexedDB';
import { toBase64 } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import useStreamStore from './useStream';

const useRecorderStore = create((set) => ({
  recorder: null,
  recording: false,
  recordedChunks: [],
  videos: [],

  initStore: async () => {
    const storedVideos = await getAllFiles();
    set((state) => ({
      ...state,
      videos: storedVideos || state.videos
    }));
  },

  initRecorder: (stream) => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream, {
      mimeType: `${MIMETYPE}; ${CODECTYPE}`
    });
    set((state) => ({
      ...state,
      recorder,
      recordedChunks: []
    }));

    recorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const video = {
          id: uuidv4(),
          assets: await toBase64(event.data),
          mimeType: MIMETYPE,
          filename: Date.now(),
          is_audio_available: useStreamStore.getState().audio,
          size: event.data.size,
          upload_status: null
        };

        await saveVideo(video);

        set((state) => ({
          ...state,
          recordedChunks: [...state.recordedChunks, event.data],
          videos: [...state.videos, video]
        }));
      }
    };

    recorder.onstop = () => {
      set((state) => ({ ...state, recording: false }));
    };
  },

  startRecording: () => {
    const recorder = useRecorderStore.getState().recorder;
    if (recorder && recorder.state !== 'recording') {
      recorder.start();
      set((state) => ({ ...state, recording: true }));
    }
  },

  stopRecording: () => {
    const recorder = useRecorderStore.getState().recorder;
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
      set((state) => ({ ...state, recording: false }));
    }
  }
}));

export default useRecorderStore;

import { getAllVideos, saveVideo } from '@/lib/indexedDB';
import { toBase64 } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

const useRecorderStore = create((set) => ({
  recorder: null,
  recording: false,
  recordedChunks: [],
  videos: [],

  initStore: async () => {
    const storedVideos = await getAllVideos();
    set((state) => ({
      ...state,
      videos: storedVideos || state.videos
    }));
  },

  initRecorder: (stream) => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/mp4; codecs=avc1.42001E, mp4a.40.2'
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
          assets: await toBase64(event.data)
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

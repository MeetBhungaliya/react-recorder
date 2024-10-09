import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useRecorderStore from './useRecorder';

const defaultStreamConstraints = {
  video: false,
  audio: false
};

const useStreamStore = create(
  persist(
    (set, get) => ({
      stream: null,
      audio: defaultStreamConstraints.audio,
      video: defaultStreamConstraints.video,

      initStream: async () => {
        try {
          const constraints = { video: true, audio: get().audio };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          set({ stream, video: true, audio: get().audio });
          useRecorderStore.getState().initRecorder(stream);
        } catch (error) {
          console.error('Error accessing camera', error);
        }
      },

      toggleAudio: async () => {
        try {
          const audioState = !get().audio;

          if (!audioState && !get().video) {
            return set({ stream: null });
          }

          const constraints = { video: get().video, audio: audioState };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);

          set({ stream, audio: audioState });
          useRecorderStore.getState().initRecorder(stream);
        } catch (error) {
          console.error('Error accessing audio', error);
        }
      },

      toggleVideo: async () => {
        try {
          const videoState = !get().video;

          if (!videoState && !get().audio) {
            return set({ stream: null, video: videoState });
          }

          const constraints = { video: videoState, audio: get().audio };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);

          set({ stream, video: videoState });
          useRecorderStore.getState().initRecorder(stream);
        } catch (error) {
          console.error('Error accessing video', error);
        }
      }
    }),
    {
      name: 'stream',
      partialize: (state) => ({ audio: state.audio, video: state.video })
    }
  )
);

export default useStreamStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useRecorderStore from './useRecorder';

const defaultStreamConstraints = {
  video: true,
  audio: false
};

const useStreamStore = create(
  persist(
    (set, get) => ({
      stream: null,
      audio: defaultStreamConstraints.audio,

      initStream: async () => {
        try {
          const constraints = { video: true, audio: get().audio };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          set({ stream });
          useRecorderStore.getState().initRecorder(stream);
        } catch (error) {
          console.error('Error accessing camera', error);
        }
      },

      toggleAudio: async () => {
        try {
          const audioState = !get().audio;
          const constraints = { video: true, audio: audioState };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);

          set({ stream, audio: audioState });
          useRecorderStore.getState().initRecorder(stream);
        } catch (error) {
          console.error('Error accessing audio', error);
        }
      }
    }),
    {
      name: 'audio',
      partialize: (state) => ({ audio: state.audio })
    }
  )
);

export default useStreamStore;

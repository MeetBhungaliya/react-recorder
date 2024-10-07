let dbPromise = null;

const connectDatabase = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open('videoDatabase', 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject('Failed to open IndexedDB:', event.target.error);
      };
    });
  }

  return dbPromise;
};

const getTransaction = async (storeName, mode = 'readonly') => {
  const db = await connectDatabase();
  return db.transaction(storeName, mode).objectStore(storeName);
};

export const saveVideo = async (video) => {
  try {
    const store = await getTransaction('videos', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(video);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject('Error saving video:', event.target.error);
      };
    });
  } catch (error) {
    console.error('Error during saving video:', error);
  }
};

export const getAllVideos = async () => {
  try {
    const store = await getTransaction('videos');
    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject('Error fetching videos:', event.target.error);
      };
    });
  } catch (error) {
    console.error('Error during fetching videos:', error);
  }
};

export function preloadVideo(src: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const video = document.createElement("video");
      video.src = src;
      video.oncanplaythrough = () => resolve();
      video.onerror = () => reject(new Error(`Failed to load video: ${src}`));
      video.load();
    });
  }
  
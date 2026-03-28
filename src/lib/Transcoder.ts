import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import JSZip from 'jszip';

let ffmpeg: FFmpeg | null = null;

const getFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  ffmpeg = new FFmpeg();
  
  // Use unpkg to load the single-threaded core
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  return ffmpeg;
};

export const transcodeVideo = async (
  webmBlob: Blob,
  format: 'gif' | 'apng' | 'mp4',
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const fg = await getFFmpeg();
  
  fg.on('progress', ({ progress }) => {
    if (onProgress) onProgress(progress * 100);
  });

  const inputName = 'input.webm';
  const outputName = `output.${format}`;
  
  await fg.writeFile(inputName, await fetchFile(webmBlob));

  let command: string[] = [];

  if (format === 'gif') {
    // High quality palette GIF conversion. Optimize framerate to 15fps for smaller size.
    command = ['-i', inputName, '-vf', 'fps=15,scale=360:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse', '-loop', '0', outputName];
  } else if (format === 'apng') {
    // APNG conversion. 30fps.
    command = ['-i', inputName, '-f', 'apng', '-plays', '0', '-framerate', '30', outputName];
  } else if (format === 'mp4') {
    command = ['-i', inputName, '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p', outputName];
  }

  await fg.exec(command);
  
  const data = await fg.readFile(outputName);
  
  // Cleanup memory
  await fg.deleteFile(inputName);
  await fg.deleteFile(outputName);

  const mimeType = format === 'gif' ? 'image/gif' : format === 'apng' ? 'image/apng' : 'video/mp4';
  return new Blob([data], { type: mimeType });
};

export const extractPngFrames = async (
  webmBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const fg = await getFFmpeg();
  
  fg.on('progress', ({ progress }) => {
    // Since we are generating images, progress might not be as smooth as video, but it gives an estimate
    if (onProgress) onProgress(progress * 100);
  });

  const inputName = 'input.webm';
  await fg.writeFile(inputName, await fetchFile(webmBlob));

  // Extract every frame as PNG at 30 FPS
  await fg.exec(['-i', inputName, '-r', '30', 'frame_%04d.png']);

  const files = await fg.listDir('/');
  const pngFiles = files.filter(f => f.name.endsWith('.png'));

  const zip = new JSZip();
  const folder = zip.folder('frames');

  for (const file of pngFiles) {
    const data = await fg.readFile(file.name);
    folder?.file(file.name, data);
    // Cleanup generated frame from memory
    await fg.deleteFile(file.name);
  }

  // Cleanup input
  await fg.deleteFile(inputName);

  // Generate zip blob
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
};

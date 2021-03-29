/**
 * Downloads a string as a file.
 * @param s: String to download
 * @param filename: Name of file to download
 */
export default function downloadString(s: string, filename: string): void {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  const url = window.URL.createObjectURL(new Blob([s], { type: 'octet/stream' }));
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

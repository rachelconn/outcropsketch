export default function downloadFromURI(uri: string, name: string): void {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

import { Card } from "@/components/ui/Card";

type UploadPanelProps = {
  title: string;
  helper: string;
  id: string;
  required?: boolean;
  fileName?: string;
  error?: string;
  onFileSelect: (file: File | null) => void;
};

function isPdf(name: string) {
  return name.toLowerCase().endsWith(".pdf");
}

export function UploadPanel({
  title,
  helper,
  id,
  required = true,
  fileName,
  error,
  onFileSelect,
}: UploadPanelProps) {
  const hasFile = Boolean(fileName);

  return (
    <Card title={title} className="upload-panel">
      {hasFile && fileName ? (
        <div className="upload-selected">
          <div className="upload-file-icon">
            {isPdf(fileName) ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2v6h6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 13h1.5a1.5 1.5 0 0 1 0 3H9v-3Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 13h1a2 2 0 0 1 0 4h-1v-4Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 13v4" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M17 15h2" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.6" />
                <path d="m21 15-5-5L5 21" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div className="upload-file-info">
            <span className="upload-file-name">{fileName}</span>
            <span className="upload-file-badge">{isPdf(fileName) ? "PDF" : "Image"} · Ready</span>
          </div>
          <button
            type="button"
            className="upload-clear-btn"
            onClick={() => onFileSelect(null)}
            aria-label="Remove file"
          >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        <label htmlFor={id} className="upload-dropzone" aria-label={`Upload ${title}`}>
          <input
            id={id}
            className="upload-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(event) => onFileSelect(event.target.files?.[0] ?? null)}
          />
          <div className="upload-dropzone-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="17 8 12 3 7 8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="3" x2="12" y2="15" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <p>Drag & drop your file</p>
          <span>or click to browse</span>
        </label>
      )}
      <p className="upload-helper">{helper}</p>
      {required ? <p className="upload-required">Required</p> : null}
      {error ? <p className="upload-error">{error}</p> : null}
    </Card>
  );
}

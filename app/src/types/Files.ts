import { FileOut } from "../api/generated";

export interface FileAttachmentsProps {
  files: FileOut[] | undefined;
  isLoading?: boolean;
  isUploading?: boolean;
  isDeleting?: boolean;
  isDownloading?: boolean;
  isProcessingOcr?: boolean;
  onUpload: (file: File) => void;
  onDownload: (file: FileOut) => void;
  onDelete: (id: number) => void;
  onProcessOcr?: (fileId: number) => void;
}
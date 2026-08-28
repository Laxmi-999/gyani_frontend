import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { downloadFileFilesFileIdDownloadGet } from '../api/generated/sdk.gen';
import type { FileOut } from '../api/generated/types.gen';
import { deleteFileFilesFileIdDeleteMutation, listFilesFilesGetOptions, listFilesFilesGetQueryKey, uploadFileFilesPostMutation } from '../api/generated/@tanstack/react-query.gen';

export function useFiles() {
  return useQuery({
    ...listFilesFilesGetOptions(),
    // Auto-poll every 2 seconds if any file is pending or processing OCR/extraction
    refetchInterval: (query) => {
      const files = query.state.data as FileOut[] | undefined;
      const isProcessing = files?.some(
        (file) => file.ocr_status === 'pending' || file.ocr_status === 'processing'
      );
      return isProcessing ? 2000 : false;
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    ...uploadFileFilesPostMutation(),
    onSuccess: () => {
      // Invalidate the generated file list query key
      queryClient.invalidateQueries({
        queryKey: listFilesFilesGetQueryKey(),
      });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteFileFilesFileIdDeleteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listFilesFilesGetQueryKey(),
      });
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async (file: FileOut) => {
      const response = await downloadFileFilesFileIdDownloadGet({
        path: { file_id: file.id },
        // Ensure response is returned as blob/stream from Axios
        responseType: 'blob',
      });

      // Handle browser blob download
      const blob = new Blob([response.data as BlobPart], { type: file.content_type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}
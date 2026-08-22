import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  deleteFileFilesFileIdDeleteMutation,
  listFilesFilesGetOptions,
  uploadFileFilesPostMutation,
} from "../api/generated/@tanstack/react-query.gen";
import type { FileOut } from "../api/generated/types.gen";

export function useFiles() {
  return useQuery({ ...listFilesFilesGetOptions() });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    ...uploadFileFilesPostMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listFilesFilesGetOptions().queryKey });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteFileFilesFileIdDeleteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listFilesFilesGetOptions().queryKey });
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async (file: FileOut) => {
      const response = await api.get<Blob>(`/files/${file.id}/download`, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
  });
}
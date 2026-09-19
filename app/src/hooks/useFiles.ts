import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listFilesFilesGetOptions,
  listFilesFilesGetQueryKey,
  uploadFileFilesPostMutation,
  deleteFileFilesFileIdDeleteMutation,
} from "../api/generated/@tanstack/react-query.gen";
import { client } from "../api/generated/client.gen";
import type { FileOut } from "../api/generated/types.gen";

export function useFiles() {
  return useQuery({
    ...listFilesFilesGetOptions(),
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    ...uploadFileFilesPostMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listFilesFilesGetQueryKey() });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteFileFilesFileIdDeleteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listFilesFilesGetQueryKey() });
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async (file: FileOut) => {
      const { data } = await client.get({
        url: "/files/{file_id}/download",
        path: { file_id: file.id },
        responseType: "blob",
        throwOnError: true,
      });

      const downloadUrl = URL.createObjectURL(data as Blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.filename;
      link.click();
      URL.revokeObjectURL(downloadUrl);

      return data;
    },
  });
}
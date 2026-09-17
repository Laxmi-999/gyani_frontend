import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listFilesFilesGetOptions,
  listFilesFilesGetQueryKey,
  uploadFileFilesPostMutation,
  deleteFileFilesFileIdDeleteMutation,
} from "../api/generated/@tanstack/react-query.gen";

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
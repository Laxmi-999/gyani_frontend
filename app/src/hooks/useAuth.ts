import { useMutation } from "@tanstack/react-query";
import { loginAuthLoginPostMutation, registerAuthRegisterPostMutation } from "../api/generated/@tanstack/react-query.gen";

export function useRegister() {
  return useMutation({
    ...registerAuthRegisterPostMutation(),
  });
}

export function useLogin() {
  return useMutation({
    ...loginAuthLoginPostMutation(),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

    },
  });
}
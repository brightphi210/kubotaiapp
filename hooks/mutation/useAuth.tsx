import { useMutation } from "@tanstack/react-query";
import { post_requests } from "../helpers/axios_helper";

export const useRegistration = () => {
  const registrationMutation = useMutation({
    mutationFn: (data: any) => post_requests("/users/", data),
  });

  return registrationMutation;
};


export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: (data: any) => post_requests("/users/login/", data),
  });

  return loginMutation;
};
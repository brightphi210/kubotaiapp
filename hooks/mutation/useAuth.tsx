import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post_requests, put_request_with_image } from "../helpers/axios_helper";

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


export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  const updateProfile = useMutation({
    mutationFn: async (data: FormData) => {
      const token = (await AsyncStorage.getItem("ku_token")) || ""
      return put_request_with_image(`/users/profile/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })

  return updateProfile
}

// https://ku-network.onrender.com/users/profile/update
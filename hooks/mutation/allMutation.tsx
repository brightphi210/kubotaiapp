import AsyncStorage from "@react-native-async-storage/async-storage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { post_requests } from "../helpers/axios_helper"


export const useClaimToken = (id: any) => {
  const queryClient = useQueryClient()
  
  const claimToken = useMutation({
    mutationFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || ""
      return post_requests(`/tasks/claim-token/${id}/`, {},  token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] })
    },
  })
  return claimToken
}




export const usePostComment = (id: any) => {
  const queryClient = useQueryClient()

  const postComment = useMutation({
    mutationFn: async (data: FormData) => {
      const token = (await AsyncStorage.getItem("ku_token")) || ""
      return post_requests(`/news/comment/${id}/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] })
    },
  })

  return postComment
}


export const useLikePost = (id: any) => {
  const queryClient = useQueryClient()

  const likePost = useMutation({
    mutationFn: async (data: FormData) => {
      const token = (await AsyncStorage.getItem("ku_token")) || ""
      return post_requests(`/news/${id}/like/`, {}, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["like"] })
    },
  })

  return likePost
}




export const useSetInvitationCode = () => {
  const queryClient = useQueryClient()

  const invitationCode = useMutation({
    mutationFn: async (data: any) => {
      const token = (await AsyncStorage.getItem("ku_token")) || ""
      return post_requests(`/users/set-invitation-code/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inviteCode"] })
    },
  })

  return invitationCode
}

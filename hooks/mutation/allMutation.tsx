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


// export const useUpdateUserProfile = (id: any) => {
//   const queryClient = useQueryClient()

//   const updateProfile = useMutation({
//     mutationFn: async (data: FormData) => {
//       const token = (await AsyncStorage.getItem("ku_token")) || ""
//       return post_requests(`/tasks/claim-token/${id}/`, data, token)
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["profile"] })
//     },
//   })

//   return updateProfile
// }




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

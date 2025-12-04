import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { get_requests } from "../helpers/axios_helper";


export const useGetNews = () => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/news/`, token);
    },
  });

  return {
    getNews: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
};


export const  useGetProfile = () => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/users/profile/`, token);
    },
  });

  return {
    getProfile: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
};


export const useGetFriends = () => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/referrals/`, token);
    },
  });

  return {
    getFriendsData: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
};

export const useGetTask = () => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/tasks/`, token);
    },
  });

  return {
    getTask: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
};


export const useGetCompletedTask = () => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["completedTask"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/tasks/completed-task/`, token);
    },
  });

  return {
    getCompletedTask: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
};


export const useGetInvitation = () => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["inviteCode"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/users/set-invitation-code/`, token);
    },
  });

  return {
    getInvitationToken: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
};

export const useGetRegionalTokens = () => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["regionalTokens"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/tokens/regional/`, token);
    },
  });

  return {
    getRegionalLeader: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
};

export const useGetGlobalTokens = () => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["globalTokens"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/tokens/global/`, token);
    },
  });

  return {
    getGlobalLeader: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
}


export const useGetSingleNews = (id:any) => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["singleNews"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/news/${id}/`, token);
    },
  });

  return {
    getSingleNews: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
}


export const useGetSingleNewsComment = (id:any) => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["commenta"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/news/comment/${id}/`, token);
    },
  });

  return {
    getSingleNewsComment: data,
    isLoading,
    isError,
    isFetched,
    refetch,
  };
}








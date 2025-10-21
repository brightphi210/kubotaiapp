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


export const useGetProfile = () => {
  const { data, isLoading, isError, isFetched, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = (await AsyncStorage.getItem("ku_token")) || "";
      return get_requests(`/users/profile`, token);
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
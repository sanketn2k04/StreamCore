import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { toast } from "react-hot-toast";

export function useSubscription(channelId: string) {
  const queryClient = useQueryClient();

  const { data: subscribedChannels } = useQuery({
    queryKey: ["subscribed-channels"],
    queryFn: async () => {
      const response = await api.get(
        "/subscription/c/channel/subscribed-channels"
      );
      return response.data;
    },
  });

  const isSubscribed = subscribedChannels?.channels?.some(
    (channel: any) => channel._id === channelId
  );

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      await api.post("/subscription/c/channel/subscribe", {
        channel: channelId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribed-channels"] });
      toast.success("Subscribed to channel");
    },
    onError: () => {
      toast.error("Failed to subscribe");
    },
  });

  return {
    isSubscribed,
    subscribe: subscribeMutation.mutate,
    isLoading: subscribeMutation.isPending,
  };
}

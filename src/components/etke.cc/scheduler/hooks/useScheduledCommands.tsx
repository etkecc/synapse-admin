import { useQuery } from "@tanstack/react-query";

import { useDataProvider } from "react-admin";
import { useAppContext } from "../../../../Context";

export const useScheduledCommands = () => {
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const { data, isLoading, error } = useQuery({
    queryKey: ["scheduledCommands"],
    queryFn: () => dataProvider.getScheduledCommands(etkeccAdmin),
  });

  return { data, isLoading, error };
};
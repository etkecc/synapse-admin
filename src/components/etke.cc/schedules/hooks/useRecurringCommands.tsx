import { useDataProvider } from "react-admin";

import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../../../../Context";

export const useRecurringCommands = () => {
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const { data, isLoading, error } = useQuery({
    queryKey: ["recurringCommands"],
    queryFn: () => dataProvider.getRecurringCommands(etkeccAdmin),
  });

  return { data, isLoading, error };
};
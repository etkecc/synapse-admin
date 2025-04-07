import { useQuery } from "@tanstack/react-query";
import { useDataProvider } from "react-admin";

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

import { useQuery } from "@tanstack/react-query";
import { useDataProvider, useLocale } from "react-admin";

import { useAppContext } from "../../../../Context";

export const useRecurringCommands = () => {
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const locale = useLocale();
  const { data, isLoading, error } = useQuery({
    queryKey: ["recurringCommands", locale],
    queryFn: () => dataProvider.getRecurringCommands(etkeccAdmin, locale),
  });

  return { data, isLoading, error };
};

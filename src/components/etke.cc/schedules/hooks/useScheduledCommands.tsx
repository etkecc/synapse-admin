import { useQuery } from "@tanstack/react-query";
import { useDataProvider, useLocale } from "react-admin";

import { useAppContext } from "../../../../Context";

export const useScheduledCommands = () => {
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const locale = useLocale();
  const { data, isLoading, error } = useQuery({
    queryKey: ["scheduledCommands", locale],
    queryFn: () => dataProvider.getScheduledCommands(etkeccAdmin, locale),
  });

  return { data, isLoading, error };
};

import { useState, useEffect } from "react";
import { useDataProvider, useLocale } from "react-admin";

import { useAppContext } from "../../../Context";

const toHumanReadable = (unit: string): string => {
  let name = unit;
  if (name.startsWith("matrix-")) {
    name = name.slice("matrix-".length);
  }
  if (name.endsWith(".service")) {
    name = name.slice(0, -".service".length);
  }
  return name;
};

export const useUnits = () => {
  const { etkeccAdmin } = useAppContext();
  const locale = useLocale();
  const dataProvider = useDataProvider();
  const [isLoading, setLoading] = useState(true);
  const [units, setUnits] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUnits = async () => {
      const unitList = await dataProvider.getUnits(etkeccAdmin, locale);
      const mapping: Record<string, string> = {};
      for (const unit of unitList) {
        mapping[toHumanReadable(unit)] = unit;
      }
      setUnits(mapping);
      setLoading(false);
    };
    fetchUnits();
  }, [dataProvider, etkeccAdmin, locale]);

  return { units, isLoading };
};

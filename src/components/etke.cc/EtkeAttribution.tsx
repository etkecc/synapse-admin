import { PropsWithChildren } from "react";

import { GetInstanceConfig } from "./InstanceConfig";

export const EtkeAttribution: React.FC<PropsWithChildren> = ({ children }) => {
  const icfg = GetInstanceConfig();

  if (icfg.disabled.attributions) {
    return null;
  }

  return <>{children}</>;
};

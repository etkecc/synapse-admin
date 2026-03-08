import { PropsWithChildren } from "react";

import { useInstanceConfig } from "./InstanceConfig";

export const EtkeAttribution: React.FC<PropsWithChildren> = ({ children }) => {
  const icfg = useInstanceConfig();

  if (icfg.disabled.attributions) {
    return null;
  }

  return <>{children}</>;
};

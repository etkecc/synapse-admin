import { lazy } from "react";

export const Icons = {
  Announcement: lazy(() => import('@mui/icons-material/Announcement')),
  Engineering: lazy(() => import('@mui/icons-material/Engineering')),
  HelpCenter: lazy(() => import('@mui/icons-material/HelpCenter')),
  SupportAgent: lazy(() => import('@mui/icons-material/SupportAgent')),
  Default: lazy(() => import('@mui/icons-material/OpenInNew')),
  // Add more icons as needed
};

export const DefaultIcon = Icons.Default;

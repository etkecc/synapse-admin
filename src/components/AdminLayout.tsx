import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import PaymentIcon from "@mui/icons-material/Payment";
import { useEffect, useState, Suspense } from "react";
import {
  CheckForApplicationUpdate,
  AppBar,
  TitlePortal,
  InspectorButton,
  Confirm,
  Layout,
  Logout,
  Menu,
  useLogout,
  UserMenu,
  useStore,
  useLocaleState,
  useLocale,
} from "react-admin";

import Footer from "./Footer";
import { LoginMethod } from "../pages/LoginPage";
import { ServerProcessResponse, ServerStatusResponse } from "../synapse/dataProvider";
import { MenuItem, GetConfig, ClearConfig } from "../utils/config";
import { Icons, DefaultIcon } from "../utils/icons";
import { EtkeAttribution } from "./etke.cc/EtkeAttribution";
import { GetInstanceConfig, ClearInstanceConfig } from "./etke.cc/InstanceConfig";
import { ServerNotificationsBadge } from "./etke.cc/ServerNotificationsBadge";
import ServerStatusBadge from "./etke.cc/ServerStatusBadge";
import { ServerStatusStyledBadge } from "./etke.cc/ServerStatusBadge";

const AdminUserMenu = () => {
  const [open, setOpen] = useState(false);
  const logout = useLogout();
  const checkLoginType = (ev: React.MouseEvent<HTMLDivElement>) => {
    const loginType: LoginMethod = (localStorage.getItem("login_type") || "credentials") as LoginMethod;
    if (loginType === "accessToken") {
      ev.stopPropagation();
      setOpen(true);
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    ClearConfig();
    ClearInstanceConfig();
    logout();
  };

  const handleDialogClose = () => {
    setOpen(false);
    ClearConfig();
    ClearInstanceConfig();
    window.location.reload();
  };

  return (
    <UserMenu>
      <div onClickCapture={checkLoginType}>
        <Logout />
      </div>
      <Confirm
        isOpen={open}
        title="synapseadmin.auth.logout_acces_token_dialog.title"
        content="synapseadmin.auth.logout_acces_token_dialog.content"
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="synapseadmin.auth.logout_acces_token_dialog.confirm"
        cancel="synapseadmin.auth.logout_acces_token_dialog.cancel"
      />
    </UserMenu>
  );
};

const AdminAppBar = () => {
  const icfg = GetInstanceConfig();
  return (
    <AppBar userMenu={<AdminUserMenu />}>
      <TitlePortal />
      {!icfg.disabled.monitoring && <ServerStatusBadge />}
      {!icfg.disabled.notifications && <ServerNotificationsBadge />}
      <InspectorButton />
    </AppBar>
  );
};

const AdminMenu = props => {
  const locale = useLocale();
  const [menu, setMenu] = useState([] as MenuItem[]);
  const icfg = GetInstanceConfig();
  const [etkeRoutesEnabled, setEtkeRoutesEnabled] = useState(false);
  useEffect(() => {
    setMenu(GetConfig().menu);
    if (GetConfig().etkeccAdmin) {
      setEtkeRoutesEnabled(true);
    }
  }, []);
  const [serverProcess, _setServerProcess] = useStore<ServerProcessResponse>("serverProcess", {
    command: "",
    locked_at: "",
  });
  const [serverStatus, _setServerStatus] = useStore<ServerStatusResponse>("serverStatus", {
    success: false,
    ok: false,
    host: "",
    results: [],
  });

  return (
    <Menu {...props}>
      {etkeRoutesEnabled && !icfg.disabled.monitoring && (
        <Menu.Item
          key="server_status"
          to="/server_status"
          leftIcon={
            <ServerStatusStyledBadge
              inSidebar={true}
              command={serverProcess.command}
              locked_at={serverProcess.locked_at}
              isOkay={serverStatus.ok}
              isLoaded={serverStatus.success}
            />
          }
          primaryText="Server Status"
        />
      )}
      {etkeRoutesEnabled && !icfg.disabled.actions && (
        <Menu.Item
          key="server_actions"
          to="/server_actions"
          leftIcon={<ManageHistoryIcon />}
          primaryText="Server Actions"
        />
      )}
      <Menu.ResourceItems />
      {etkeRoutesEnabled && !icfg.disabled.payments && (
        <Menu.Item key="billing" to="/billing" leftIcon={<PaymentIcon />} primaryText="etkecc.billing.name" />
      )}
      {menu &&
        menu.map((item, index) => {
          const { url, icon, label, i18n } = item;
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const IconComponent = Icons[icon] as React.ComponentType<any> | undefined;

          let primaryText = label;
          if (i18n && i18n[locale]) {
            primaryText = i18n[locale];
          }

          return (
            <Suspense key={index}>
              <Menu.Item
                to={url}
                target="_blank"
                primaryText={primaryText}
                leftIcon={IconComponent ? <IconComponent /> : <DefaultIcon />}
                onClick={props.onMenuClick}
              />
            </Suspense>
          );
        })}
    </Menu>
  );
};

export const AdminLayout = ({ children }) => {
  // Set the document language based on the selected locale
  const [locale, _setLocale] = useLocaleState();
  const icfg = GetInstanceConfig();
  useEffect(() => {
    document.documentElement.lang = locale;
    // set <title> based on instance name
    if (icfg.name) {
      document.title = icfg.name;
    }
    if (icfg.favicon_url) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = icfg.favicon_url;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = icfg.favicon_url;
        document.getElementsByTagName("head")[0].appendChild(newLink);
      }
    }
  }, [locale]);

  return (
    <>
      <Layout
        appBar={AdminAppBar}
        menu={AdminMenu}
        sx={{
          ["& .RaLayout-appFrame"]: {
            minHeight: "90vh",
            height: "90vh",
          },
          ["& .RaLayout-content"]: {
            marginBottom: "3rem",
          },
        }}
      >
        {children}
        <CheckForApplicationUpdate />
      </Layout>
      <EtkeAttribution>
        <Footer />
      </EtkeAttribution>
    </>
  );
};

export default AdminLayout;

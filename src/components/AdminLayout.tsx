import { CheckForApplicationUpdate, AppBar, TitlePortal, InspectorButton, Confirm, Layout, Logout, Menu, useLogout, UserMenu } from "react-admin";
import { LoginMethod } from "../pages/LoginPage";
import { useEffect, useState, Suspense } from "react";
import { Icons, DefaultIcon } from "../utils/icons";
import { MenuItem, GetConfig, ClearConfig } from "../utils/config";
import Footer from "./Footer";

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
    logout();
  };

  const handleDialogClose = () => {
    setOpen(false);
    ClearConfig();
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
  return (<AppBar userMenu={<AdminUserMenu />}>
    <TitlePortal />
    <InspectorButton />
  </AppBar>);
};

const AdminMenu = (props) => {
  const [menu, setMenu] = useState([] as MenuItem[]);
  useEffect(() => setMenu(GetConfig().menu), []);

  return (
    <Menu {...props}>
      <Menu.ResourceItems />
      {menu.map((item, index) => {
        const { url, icon, label } = item;
        const IconComponent = Icons[icon] as React.ComponentType<any> | undefined;

        return (
          <Suspense key={index}>
            <Menu.Item
              to={url}
              target="_blank"
              primaryText={label}
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
  return <>
    <Layout appBar={AdminAppBar} menu={AdminMenu} sx={{
      ['& .RaLayout-appFrame']: {
        minHeight: '90vh',
        height: '90vh',
      },
      ['& .RaLayout-content']: {
        marginBottom: '3rem',
      },
    }}>
      {children}
      <CheckForApplicationUpdate />
    </Layout>
    <Footer />
  </>
};

export default AdminLayout;

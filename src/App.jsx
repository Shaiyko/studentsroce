import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import demoTheme from "./components/Theme";
import Footer from "./components/Footer";
import { NAVIGATION } from "./components/Navbar";

import SV from "./assets/SV.webp";

import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from "@toolpad/core/Account";

import { AppProvider, DashboardLayout, PageContainer } from "@toolpad/core";

// Lazy loaded pages
const RegisterForm = React.lazy(() => import("./LoginPage/Register"));
const LoginRegister = React.lazy(() => import("./LoginPage/Loginsheet"));
const SheetManagerC = React.lazy(() => import("./SheetManagerC"));
const StudentSearchExport = React.lazy(() => import("./Showsroce"));

const Dashboard = React.lazy(() => import("./Dashboard"));
function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  open: PropTypes.bool,
};

const accounts = [];

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Accounts
      </Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{ justifyContent: "flex-start", width: "100%", columnGap: 2 }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.95rem",
                  bgcolor: account.color,
                }}
                src={account.image ?? ""}
                alt={account.name ?? ""}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
              primary={account.name}
              secondary={account.email}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

function SidebarFooterAccount({ mini }) {
  const PreviewComponent = useMemo(() => createPreviewComponent(mini), [mini]);
  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: "left", vertical: "bottom" },
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(0,0,0,0.32)"
                  })`,
                mt: 1,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired,
};

function Layout({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_sheet");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setSession({
          user: {
            name: user.name || "Unknown",
            email: user.email || "",
            image: user.image || SV, // ใช้โลโก้ SV ถ้าไม่มีภาพ
          },
        });
      } catch (err) {
        console.error("❌ Failed to parse user_sheet:", err);
      }
    }
  }, []);

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        const storedUser = localStorage.getItem("user_sheet");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setSession({
            user: {
              name: user.name,
              email: user.email,
              image: user.image || SV,
            },
          });
        } else {
          window.location.href = "/login";
        }
      },
      signOut: () => {
        localStorage.removeItem("user_sheet");
        setSession(null);
      },
    };
  }, []);

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      branding={{
        logo: (
          <img src={SV} alt="SV logo" width={40} height={40} loading="lazy" />
        ),
        title: "Sengsavanh",
        homeUrl: "/",
      }}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        slots={{
          toolbarAccount: () => {
            null;
          },
          sidebarFooter: SidebarFooterAccount,
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <CssBaseline />
          <PageContainer>
            <SkeletonLoader>{children}</SkeletonLoader>
          </PageContainer>
          <Footer />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

function SkeletonLoader({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <Box sx={{ padding: 2 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          sx={{ marginBottom: 2 }}
        />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Box>
    );
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Layout>
          <Route path="/" element={<Dashboard />} />
          <Route path="/score" element={<StudentSearchExport />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/credit-recovery" element={<SheetManagerC />} />
          <Route path="/register" element={<RegisterForm />} />
        </Layout>
      </Routes>
    </Router>
  );
}

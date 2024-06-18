import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Popover from "@mui/material/Popover";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material";
import styles from "../../globals.css";
import CreateButton from "./CreateButton";
interface Props {
  

  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const drawerWidth = 280;

const DashboardDrawer: React.FC<Props> = ({
 
  mobileOpen,
  setMobileOpen,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          display: { xs: "none", lg: "block" },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            height: "100vh",
          },
          // selected and (selected + hover) states
          "&& .Mui-selected, && .Mui-selected:hover": {
            bgcolor: "red",
            "&, & .MuiListItemIcon-root": {
              color: "pink",
            },
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* <Toolbar /> */}
        <div className="px-3 py-6">
          <div className="py-6 px-6 h-[100px] border-b border-b-[#D7D5D5]">
            <Image
              src="/dashboard/reers-logo.svg"
              alt="Reers pod Logo"
              width={97}
              height={35.75}
              priority
            />
          </div>
        </div>
        <div>
          <List className="px-4 font-mont overflow-y-auto h-[70vh]">
            {["Explore", "Create", "Profile"].map((text, index) => (
              <ListItem
                style={{
                  backgroundColor:
                    pathName ===
                    `/dashboard${`${
                      text.toLowerCase() === "dashboard"
                        ? ""
                        : `/${text.toLowerCase()}`
                    }`}`
                      ? "#335FAC"
                      : "",
                  height: "48px",
                  borderRadius: "5px",
                  margin: "24px auto 0",
                }}
                key={text}
                onClick={() => {
                  if (text === "Dashboard") {
                    router.push(`/dashboard`);
                  } else {
                    router.push(`${`/dashboard/${text.toLowerCase()}`}`);
                  }
                }}
                sx={{ width: 216 }}
              >
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {index === 0 ? (
                      pathName === `/dashboard` ? (
                        <Image
                          src="/dashboard/fire.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      ) : (
                        <Image
                          src="/dashboard/fire.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      )
                    ) : index === 1 ? (
                      pathName === `/dashboard/${text.toLowerCase()}` ? (
                        <Image
                          src="/dashboard/sparkle.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      ) : (
                        <Image
                          src="/dashboard/sparkle.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      )
                    ) : index === 2 ? (
                      pathName === `/dashboard/${text.toLowerCase()}` ? (
                        <Image
                          src="/Dashboard/UserCircle.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      ) : (
                        <Image
                          src="/Dashboard/UserCircle.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      )
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                  <div
                    style={{
                      color:
                        pathName ===
                        `/dashboard${`${
                          text.toLowerCase() === "dashboard"
                            ? ""
                            : `/${text.toLowerCase()}`
                        }`}`
                          ? "#fff"
                          : "#828282",
                    }}
                    className=" text-text-gray font-mont"
                  >
                    {text}{" "}
                  </div>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>

        <div className="absolute flex items-center justify-center bottom-6 mt-5  h-[25vh] lg:max-h-fit py-[14px] w-[90%]  mx-4 rounded-[10px] bg-box-gradient p-10">
          <div className="w-[140px] flex flex-col items-center">
            <p className="uppercase text-lg text-center">
              Create your podcast now
            </p>
            <CreateButton />
          </div>
        </div>
      </Drawer>

      <Drawer
        sx={{
          width: drawerWidth,
          display: { xs: "block", md: "block", lg: "none" },

          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            height: "100vh",
          },
          // selected and (selected + hover) states
          "&& .Mui-selected, && .Mui-selected:hover": {
            bgcolor: "red",
            "&, & .MuiListItemIcon-root": {
              color: "pink",
            },
          },
        }}
        anchor="left"
        open={mobileOpen}
        ModalProps={{ onBackdropClick: handleDrawerToggle }}
      >
        {/* <Toolbar /> */}
        <div className="py-6 px-6 h-[8vh]">
          <div className="flex items-center">
            <Image
              src="/dashboard/reers-logo.svg"
              alt="Reers Logo"
              width={200}
              height={35}
              priority
              className="ml-3"
            />
          </div>
        </div>
        <div>
          <List className="px-4 font-mont overflow-y-auto h-[70vh]">
            {["Explore", "Create", "Profile"].map((text, index) => (
              <ListItem
                style={{
                  backgroundColor:
                    pathName ===
                    `/dashboard${`${
                      text.toLowerCase() === "dashboard"
                        ? ""
                        : `/${text.toLowerCase()}`
                    }`}`
                      ? "#335FAC"
                      : "",
                  height: "48px",
                  borderRadius: "5px",
                  margin: "24px auto 0",
                }}
                key={text}
                onClick={() => {
                  if (text === "Dashboard") {
                    router.push(`/dashboard`);
                    handleDrawerToggle();
                  } else {
                    router.push(`${`/dashboard/${text.toLowerCase()}`}`);
                    handleDrawerToggle();
                  }
                }}
                sx={{ width: 216 }}
              >
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {index === 0 ? (
                      pathName === `/dashboard` ? (
                        <Image
                          src="/Dashboard/dashboard-icon.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      ) : (
                        <Image
                          src="/Dashboard/dashboard-grey.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      )
                    ) : index === 1 ? (
                      pathName === `/dashboard/${text.toLowerCase()}` ? (
                        <Image
                          src="/Dashboard/phone-white.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      ) : (
                        <Image
                          src="/Dashboard/phone-grey.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      )
                    ) : index === 2 ? (
                      pathName === `/dashboard/${text.toLowerCase()}` ? (
                        <Image
                          src="/Dashboard/program-white.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      ) : (
                        <Image
                          src="/Dashboard/program-grey.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      )
                    ) : index === 3 ? (
                      pathName === `/dashboard/${text.toLowerCase()}` ? (
                        <Image
                          src="/Dashboard/white-wallet.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      ) : (
                        <Image
                          src="/Dashboard/grey-wallet.svg"
                          alt="card image"
                          width={24}
                          height={24}
                          priority
                        />
                      )
                    ) : pathName === `/dashboard/${text.toLowerCase()}` ? (
                      <Image
                        src="/Dashboard/settings-white.svg"
                        alt="card image"
                        width={24}
                        height={24}
                        priority
                      />
                    ) : (
                      <Image
                        src="/Dashboard/settings-grey.svg"
                        alt="card image"
                        width={24}
                        height={24}
                        priority
                      />
                    )}
                  </ListItemIcon>
                  <div
                    style={{
                      color:
                        pathName ===
                        `/dashboard${`${
                          text.toLowerCase() === "dashboard"
                            ? ""
                            : `/${text.toLowerCase()}`
                        }`}`
                          ? "#fff"
                          : "#828282",
                    }}
                    className=" text-text-gray font-mont"
                  >
                    {text}{" "}
                  </div>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default DashboardDrawer;

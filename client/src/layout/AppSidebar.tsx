import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useDispatch, useSelector } from "react-redux";
import {createAxios} from '../createInstance';
import {logoutSuccess} from '../redux/authSlice'
import { logOut } from "../redux/apiRequest";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: (
      <img
        className="w-10 rounded-xs"
        src="/images/icongame/logolienquan.jpg"
      />
    ),
    name: "Tool liên quân",
    subItems: [
      {
        name: "Check thông tin tài khoản Garena ",
        path: "/check-thong-tin-garena",
        new: true,
      },
      {
        name: "Check trang phục Liên Quân",
        path: "/check-skin-lien-quan",
        new: true,
      },
      {
        name: "Spam tài khoản Garena ",
        path: "/spam-acc-garena",
        new: true,
      },
      {
        name: "Ghép ảnh acc liên quân",
        path: "/ghep-anh-lien-quan",
        new: true,
      },
      // {
      //   name: "Quản lý user",
      //   path: "/get-all-user",
      //   new: true,
      // },

      // {
      //   name: "Data skin liên quân",
      //   path: "/data-skin",
      //   new: true,
      // },
    ],
  },
  {
    icon: (
      <img className="w-10 rounded-xs" src="/images/icongame/logofifa4.jpg" />
    ),
    name: "Tool fifa online 4",
    subItems: [
      // {
      //   name: "Check thông tin tài khoản Garena ",
      //   path: "/#",
      //   new: true,
      // },
      {
        name: "Check thông tin acc FCO",
        path: "/blank?page=check-acc-fco",
        new: true,
      },
      // {
      //   name: "Data skin liên quân",
      //   path: "/#",
      //   new: true,
      // },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "Trang cá nhân",
    path: "/profile",
  },
  {
    icon: <PlugInIcon />,
    name: "Tài khoản",
    subItems: [
      { name: "Đăng nhập", path: "/signin", pro: false },
      { name: "Đăng ký", path: "/signup", pro: false },
    ],
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Lịch",
  //   path: "/calendar",
  // },
  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Bảng",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Trang",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false },
  //     { name: "Avatar", path: "/avatars", pro: false },
  //     { name: "Badge", path: "/badge", pro: false },
  //     { name: "Buttons", path: "/buttons", pro: false },
  //     { name: "Images", path: "/images", pro: false },
  //     { name: "Videos", path: "/videos", pro: false },
  //   ],
  // },

];


const AppSidebar: React.FC = () => {
  const user = useSelector((state) => state.auth.login.currentUser);

  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user,dispatch,logoutSuccess)
    const handleLogout = () =>{
      logOut(dispatch, id, navigate, accessToken, axiosJWT)
    }

    const othersItems1: NavItem[] = [
      {
        icon: <UserCircleIcon />,
        name: "Trang cá nhân",
        path: "/profile",
      },
      {
        icon: <PlugInIcon />,
        name: "Tài khoản",
        subItems: [
          { name: "Đăng xuất",   pro: false, onClick: handleLogout },
        ],
      },
    ];
    
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive "
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start gradient"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text gradient">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
{subItem.onClick ? (
  <button
    onClick={(e) => {
      e.preventDefault();
      subItem.onClick();
    }}
    className={`menu-dropdown-item text-left w-full ${
      isActive(subItem.path)
        ? "menu-dropdown-item-active gradient"
        : "menu-dropdown-item-inactive"
    }`}
  >
    {subItem.name}
  </button>
) : (
  <Link
    to={subItem.path}
    className={`menu-dropdown-item ${
      isActive(subItem.path)
        ? "menu-dropdown-item-active gradient"
        : "menu-dropdown-item-inactive"
    }`}
  >
    {subItem.name}
  </Link>
)}

                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed  mt-14 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
<div
  className={`hidden py-3 lg:block flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"}`}
>
  <Link to="/" className="flex justify-center">
    {isExpanded || isHovered || isMobileOpen ? (
      <>
        <img
          className="  dark:hidden object-cover h-20" // Use object-cover to crop and set a smaller size
          src="/images/logo/1.png"
          alt="Logo"
        />
        <img
          className="hidden dark:block object-cover h-20" // Use object-cover to crop and set a smaller size
          src="/images/logo/2.png"
          alt="Logo"
        />
      </>
    ) : (
      <>
        <img
          className="ml-1 mt-3 dark:hidden object-cover h-[40px] w-[40px]" // Đảm bảo logo nhỏ này cũng căn giữa
          src="/images/logo/3.png"
          alt="Logo"
        />
        <img
          className="ml-1 mt-3 hidden dark:block object-cover h-[40px] w-[40px]" // Đảm bảo logo nhỏ này cũng căn giữa
          src="/images/logo/4.png"
          alt="Logo"
        />
      </>
    )}
  </Link>
</div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {/* thêm menu  */}
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "TOOL GARENA"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "KHÁC"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {user ?renderMenuItems(othersItems1, "others"): renderMenuItems(othersItems, "others") }
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

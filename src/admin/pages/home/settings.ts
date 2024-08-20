export const HOME_TILE_MENU = [
  {
    unoDesc: "Manage",
    dosDesc: "Members",
    image: require("../../../assets/images/homeowner-icon.png").default,
    linkText: "+ Add Members",
    url: "/home/homeowners",
    urlAdd: "/home/homeowners?add=true",
    hidden: true,
  },
  {
    unoDesc: "Manage",
    dosDesc: "Lands",
    image: require("../../../assets/images/properties-icon.png").default,
    linkText: "+ Add Properties",
    url: "/home/properties",
    urlAdd: "",
    disabled: true,
    className: "fa fa-fw fa-home",
  },
  {
    unoDesc: "Manage",
    dosDesc: "Tokens",
    image: require("../../../assets/images/tokens.png").default,
    linkText: "+ Add Items",
    url: "/home/tokens",
    urlAdd: "",
    disabled: true,
    hidden: true,
  },
  {
    unoDesc: "Manage",
    dosDesc: "NFTs",
    image: require("../../../assets/images/nft.png").default,
    linkText: "+ Add Items",
    url: "/home/nfts",
    urlAdd: "",
    disabled: true,
    hidden: true,
  },
  {
    unoDesc: "View",
    dosDesc: "Marketplace",
    image: require("../../../assets/images/marketplace.png").default,
    linkText: "+ View Dashboard",
    url: "/marketplace",
    urlAdd: "/dashboard",
    disabled: true,
  },
  {
    unoDesc: "Manage",
    dosDesc: "Announcements",
    image: require("../../../assets/images/announcements-icon.png").default,
    linkText: "+ Add Announcements",
    url: "/announcements",
    urlAdd: "/announcements?add=true",
    hidden: true,
  },
  {
    unoDesc: "Manage",
    dosDesc: "Service Requests",
    image: require("../../../assets/images/service-requests-icon.png").default,
    linkText: "+ View Service Requests",
    url: "/service-requests",
    urlAdd: "/service-requests?add=true",
    hidden: true,
  },
  {
    unoDesc: "Manage",
    dosDesc: "Orders",
    image: require("../../../assets/images/orders-icon.png").default,
    linkText: "+ Add Orders",
    url: "/shop-items",
    urlAdd: "/shop-items",
    hidden: true,
  },
  {
    unoDesc: "Manage",
    dosDesc: "Settings",
    image: require("../../../assets/images/settings.svg").default,
    linkText: "+ Add Properties",
    url: "/settings",
    urlAdd: "",
    className: "fa fa-fw fa-cogs",
    disabled: true,
    hidden: true,
  },
];

export const HOME_TABS = [
  {
    index: 0,
    label: "Menu",
    url: "/",
    // component: Loadable({
    //     loader: () => import('../home/Menu'),
    //     loading: ActivityLoader
    // })
  },
  {
    index: 1,
    label: "Properties",
    url: "/home/properties",
    // component: Loadable({
    //     loader: () => import('../home/Properties'),
    //     loading: ActivityLoader
    // })
  },
  {
    index: 2,
    label: "Tokens",
    url: "/home/tokens",
    // component: Loadable({
    //     loader: () => import('../tokens'),
    //     loading: ActivityLoader
    // })
  },
  {
    index: 3,
    label: "NFTs",
    url: "/home/nfts",
  },
];

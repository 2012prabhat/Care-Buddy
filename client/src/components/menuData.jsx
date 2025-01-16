const menuData = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Location",
    path: "/location",
  },
  {
    title: "Panel",
    path: "/panel",
  },

  // {
  //     title: "Menu 1",
  //     submenu: [
  //         { title: "Submenu 1", path: "/submenu1" },
  //         {
  //             title: "Submenu 2",
  //             children: [
  //                 { title: "Subitem 1", path: "/subitem1" },
  //                 { title: "Subitem 2", path: "/subitem2" },
  //             ],
  //         },
  //     ],
  // },

  {
    title: "Global Settings",
    submenu: [
      { title: "User Account", path: "/user-account" },
      { title: "Application Access Manager", path: "/access-manager" },
      { title: "Points", path: "/points" },
      { title: "Referral", path: "/referral" },
    ],
  },
];

export default menuData;

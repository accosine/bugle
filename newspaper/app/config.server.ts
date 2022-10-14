import { chunkArray } from "~/auxiliary";

// Default values can be overridden with setting the corresponding variable names
// on process.env either directly or via .env file.
const {
  NEWSPAPER_COPYRIGHT = "NO COPYRIGHT CONFIGURED",
  NEWSPAPER_DOMAIN = "",
  NEWSPAPER_IMAGEDIR = "image",
  NEWSPAPER_LOGO = "fallbacklogo.png",
  NEWSPAPER_MEDIAPATH = "",
  NEWSPAPER_NAMEPLATE = "TABLOID",
  NEWSPAPER_PORT = "",
  NEWSPAPER_PUBLISHERNAME = "NO PUBLISHER CONFIGURED",
  NEWSPAPER_SNACKTIMEOUT = "",
  NEWSPAPER_STYLE_BACKGROUND = "#f9065a",
  NEWSPAPER_VERSION = "",
  NEWSPAPER_VIDEODIR = "video",
  NEWSPAPER_MENU = "",
  NEWSPAPER_MENUNAME = "Menu",
  NEWSPAPER_SLOGAN = "Made by 👻's eating 🍕",
  NEWSPAPER_DESCRIPTION = "TABLOID Video Stories make 👻's go ⏰",
} = process.env;

const config = {
  backgroundColor: NEWSPAPER_STYLE_BACKGROUND,
  copyright: NEWSPAPER_COPYRIGHT,
  domain: NEWSPAPER_DOMAIN,
  imageDir: NEWSPAPER_IMAGEDIR,
  mediaPath: NEWSPAPER_MEDIAPATH,
  nameplate: NEWSPAPER_NAMEPLATE,
  port: NEWSPAPER_PORT,
  publisher: NEWSPAPER_PUBLISHERNAME,
  publisherLogo: NEWSPAPER_LOGO,
  snacktimeout: NEWSPAPER_SNACKTIMEOUT,
  version: NEWSPAPER_VERSION,
  videoDir: NEWSPAPER_VIDEODIR,
  menu: chunkArray(NEWSPAPER_MENU.toUpperCase().split(","), 2),
  slogan: NEWSPAPER_SLOGAN,
  menuName: NEWSPAPER_MENUNAME,
  homeDescription: NEWSPAPER_DESCRIPTION,
};

export type ConfigType = typeof config;
export default config;

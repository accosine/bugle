import type { ReactNode } from "react";
import { useEffect, useState, createElement } from "react";
import Footer from "~/components/Footer";
import Hamburger from "~/components/Hamburger";
import Header from "~/components/Header";
import Main from "~/components/Main";
import Menu from "~/components/Menu";

type LayoutPropsType = {
  children: ReactNode;
  copyright: string;
  menu: ReactNode[];
  menuName: string;
  nameplate: string;
  slogan: string;
  location: string;
};

const LayoutDefaultProps: LayoutPropsType = {
  children: createElement("div"),
  copyright: "NO COPYRIGHT CONFIGURED",
  menu: [],
  menuName: "NO MENU NAME CONFIGURED",
  nameplate: "NO NAME CONFIGURED",
  slogan: "NO SLOGAN CONFIGURED",
  location: "",
};

const Layout = ({
  children,
  copyright,
  menu,
  menuName,
  nameplate,
  slogan,
  location,
}: LayoutPropsType) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleHamburgerClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <div className="app-container">
      <Menu open={open} slogan={slogan} menuName={menuName} menuItems={menu} />
      <Header>
        <Hamburger open={open} handleClick={handleHamburgerClick} />
        <span id="nameplate">{nameplate}</span>
      </Header>
      <Main>{children}</Main>
      <Footer>
        <span id="copyright">{`${copyright} ${new Date().getFullYear()}`}</span>
      </Footer>
    </div>
  );
};
Layout.defaultProps = LayoutDefaultProps;

export default Layout;

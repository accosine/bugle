import type { ReactNode } from "react";
import { useEffect, useState, createElement } from "react";
import Footer from "../Footer";
import Hamburger from "../Hamburger";
import Header from "../Header";
import Main from "../Main";
import Menu from "../Menu/Menu";

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

export const Layout = ({
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
    <div className="letterpress-container">
      <Menu open={open} slogan={slogan} menuName={menuName} menuItems={menu} />
      <Header>
        <Hamburger open={open} handleClick={handleHamburgerClick} />
        <span id="letterpress-nameplate">{nameplate}</span>
      </Header>
      <Main>{children}</Main>
      <Footer>
        <span id="letterpress-copyright">{`${copyright} ${new Date().getFullYear()}`}</span>
      </Footer>
    </div>
  );
};
Layout.defaultProps = LayoutDefaultProps;

export default Layout;

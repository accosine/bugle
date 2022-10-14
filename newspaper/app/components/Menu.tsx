import type { ReactNode } from "react";
import { createElement } from "react";
import Header from "~/components/Header";
import Modal from "../components/Modal";
import Footer from "~/components/Footer";

type MenuPropsType = {
  open: boolean;
  menuItems: ReactNode[];
  slogan?: string;
  menuName?: string;
};

const MenuDefaultProps: MenuPropsType = {
  open: false,
  menuItems: [
    createElement("span", { key: "error" }, ["ERROR: No Menu Items available"]),
  ],
  slogan: "",
  menuName: "",
};

const Menu: React.FC<MenuPropsType> = ({
  open,
  menuItems,
  slogan,
  menuName,
}) => (
  <Modal isOpen={open}>
    <Header>
      <span className="flex space-around">{menuName}</span>
    </Header>
    <div id="hamburger-menu-main" className="space-around">
      {menuItems.map((menuItem) => menuItem)}
    </div>
    <Footer>
      <span className="flex space-around">{slogan}</span>
    </Footer>
  </Modal>
);
Menu.defaultProps = MenuDefaultProps;

export default Menu;

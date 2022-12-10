import type { ReactNode } from "react";
import { createElement } from "react";
import Header from "../Header";
import Modal from "../Modal";
import Footer from "../Footer";

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

export const Menu: React.FC<MenuPropsType> = ({
  open,
  menuItems,
  slogan,
  menuName,
}) => (
  <Modal isOpen={open}>
    <Header>
      <span className="space-around flex">{menuName}</span>
    </Header>
    <div id="letterpress-menu-main" className="space-around">
      {menuItems.map((menuItem) => menuItem)}
    </div>
    <Footer>
      <span className="space-around flex">{slogan}</span>
    </Footer>
  </Modal>
);
Menu.defaultProps = MenuDefaultProps;

export default Menu;

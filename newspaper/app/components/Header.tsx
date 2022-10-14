import type { FC, ReactNode } from "react";
import { createElement } from "react";

type HeaderPropsType = {
  children: ReactNode;
};

const HeaderDefaultProps: HeaderPropsType = {
  children: createElement("div"),
};

const Header: FC<HeaderPropsType> = ({ children }) => (
  <div className="app-area-top">{children}</div>
);
Header.defaultProps = HeaderDefaultProps;

export default Header;

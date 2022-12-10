import type { FC, ReactNode } from "react";
import { createElement } from "react";

type HeaderPropsType = {
  children: ReactNode;
};

const HeaderDefaultProps: HeaderPropsType = {
  children: createElement("div"),
};

export const Header: FC<HeaderPropsType> = ({ children }) => (
  <div className="letterpress-area-top">{children}</div>
);
Header.defaultProps = HeaderDefaultProps;

export default Header;

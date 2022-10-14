import type { FC, ReactNode } from "react";
import { createElement } from "react";

type FooterPropsType = {
  children: ReactNode;
};

const FooterDefaultProps: FooterPropsType = {
  children: createElement("div"),
};

const Footer: FC<FooterPropsType> = ({ children }) => (
  <div className="app-area-bottom">{children}</div>
);
Footer.defaultProps = FooterDefaultProps;

export default Footer;

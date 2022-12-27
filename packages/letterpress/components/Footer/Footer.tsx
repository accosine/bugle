import type { FC, ReactNode } from "react";
import { createElement } from "react";

type FooterPropsType = {
  children: ReactNode;
};

const FooterDefaultProps: FooterPropsType = {
  children: createElement("div"),
};

export const Footer: FC<FooterPropsType> = ({ children }) => (
  <div className="letterpress-area-bottom">{children}</div>
);
Footer.defaultProps = FooterDefaultProps;

export default Footer;

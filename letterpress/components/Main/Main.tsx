import type { FC, ReactNode } from "react";
import { createElement } from "react";

type MainPropsType = {
  children: ReactNode;
};

const MainDefaultProps: MainPropsType = {
  children: createElement("div"),
};

export const Main: FC<MainPropsType> = ({ children }) => (
  <div className="letterpress-area-main">{children}</div>
);
Main.defaultProps = MainDefaultProps;

export default Main;

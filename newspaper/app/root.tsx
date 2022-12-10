import type { ReactNode } from "React";
import type { MetaFunction, LinksFunction } from "@remix-run/node";
import type { ErrorBoundaryComponent } from "@remix-run/node";
import type { NavigateFunction } from "react-router";
import type { ConfigType } from "~/config.server";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { Layout } from "letterpress";
import layoutStyles from "letterpress/styles/Layout.css";
import cssVars from "~/styles/inline";
import config from "~/config.server";
import reset from "~/styles/reset.css";
import shell from "~/styles/shell.css";
import {
  ampStyleBoilerplateMain,
  ampStyleBoilerplateExtended,
} from "./components/Amp/boilerplate";
import AmpBoilerplateStyle from "~/components/Amp/AmpBoilerplateStyle";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: reset },
    { rel: "stylesheet", href: layoutStyles },
    { rel: "stylesheet", href: shell },
  ];
};

export const meta: MetaFunction = ({
  data: { homeDescription, slogan },
}: {
  data: ConfigType;
}) => {
  return { title: slogan, description: homeDescription };
};

export const loader = async () => {
  console.log("confi: ", config);
  return json(config);
};

// Never reload the root loader
export const unstable_shouldReload = () => false;

const AmpDocument = () => {
  return (
    //@ts-ignore: workaround to add "amp" as an attribute
    <html amp="true" lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="canonical" href="pets.html"></link>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <AmpBoilerplateStyle styl={ampStyleBoilerplateMain} />
        <noscript>
          <AmpBoilerplateStyle styl={ampStyleBoilerplateExtended} />
        </noscript>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script
          async
          custom-element="amp-video"
          src="https://cdn.ampproject.org/v0/amp-video-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-story"
          src="https://cdn.ampproject.org/v0/amp-story-1.0.js"
        ></script>
        <Meta />
      </head>
      <body>
        <Outlet />
        {/* {!prodEnv && <ScrollRestoration />}
        {!prodEnv && <Scripts />}
        {!prodEnv && <LiveReload />} */}
      </body>
    </html>
  );
};

const MenuLinks = (
  menuItems: string[][],
  navigate: NavigateFunction
): ReactNode[] => {
  const tempMenu = menuItems.map((menuTuple: string[], idx: number) => {
    const [menuName, menuSlug] = menuTuple;
    return (
      <button key={idx} onClick={() => navigate(`/${menuSlug.toLowerCase()}`)}>
        {menuName}
      </button>
    );
  });
  return [
    <button key={"home"} onClick={() => navigate("/")}>
      Home
    </button>,
    ...tempMenu,
  ];
};

const ReactDocument = ({ location }: { location: string }) => {
  const prodEnv = process.env.NODE_ENV === "production";
  // const { backgroundColor, copyright, nameplate, menu, slogan, menuName } =
  //   useLoaderData<ConfigType>();
  const ldata = useLoaderData<ConfigType>();
  console.log("ldata: ", ldata);
  const { backgroundColor, copyright, nameplate, menu, slogan, menuName } =
    ldata;
  const navigate = useNavigate();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <style>{cssVars({ backgroundColor })}</style>
      </head>
      <body>
        <Layout
          menu={MenuLinks(menu, navigate)}
          menuName={menuName}
          nameplate={nameplate}
          copyright={copyright}
          slogan={slogan}
          location={location}
        >
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        {!prodEnv && <LiveReload />}
      </body>
    </html>
  );
};

export default function App() {
  const { pathname } = useLocation();
  const isAmpDoc = pathname.includes("/story/");
  return isAmpDoc ? <AmpDocument /> : <ReactDocument location={pathname} />;
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  //TODO: Revisit when this is fixed: github.com/remix-run/remix/issues/599
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>{cssVars({ backgroundColor: "red" })}</style>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <h1>Server Error</h1>
        </Layout>
        <Scripts />
      </body>
    </html>
  );
};

export function CatchBoundary() {
  const caught = useCatch();
  const { backgroundColor, copyright, nameplate, menu, slogan, menuName } =
    useLoaderData<ConfigType>();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>{cssVars({ backgroundColor })}</style>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout
          menu={menu}
          menuName={menuName}
          nameplate={nameplate}
          copyright={copyright}
          slogan={slogan}
        >
          <h1>
            {caught.status} {caught.statusText}
          </h1>
        </Layout>
        <Scripts />
      </body>
    </html>
  );
}

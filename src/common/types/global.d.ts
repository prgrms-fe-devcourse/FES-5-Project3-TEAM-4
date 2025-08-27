export type IconType = React.ComponentType<{ className?: string }>;

export type NavItem = {
  label: string;
  path: string;
  icon?: IconType;
};

export type RouteWithHandler = RouteObject & {
  handle?: {
    label?: string;
    showInNav?: boolean;
    icon?: IconType;
  };
  children?: RouteWithHandler[];
};

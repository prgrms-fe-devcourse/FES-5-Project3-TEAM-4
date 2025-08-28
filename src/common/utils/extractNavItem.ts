import type { NavItem, RouteWithHandler } from '../types/global';
import { joinPaths } from './joinPath';

function extractNavItem(routes: RouteWithHandler[], parentPath = ''): NavItem[] {
  const navItems = [];

  for (const route of routes) {
    const path = route.index ? parentPath || '/' : joinPaths(parentPath, route.path);

    if (route.handle?.showInNav && route.handle?.label) {
      navItems.push({ label: route.handle.label, path, icon: route.handle.icon });
    }

    if (route.children) {
      navItems.push(...extractNavItem(route.children, path));
    }
  }

  return navItems;
}

export default extractNavItem;

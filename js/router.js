// ===== SPA Hash Router with Auth Guard =====

const routes = {};
let currentRoute = null;
let onRouteChange = null;
let authChecker = null;  // function that returns true if user is logged in
const PUBLIC_ROUTES = ['/login', '/signup', '/home'];

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = '#' + path;
}

export function setRouteChangeCallback(cb) {
  onRouteChange = cb;
}

export function setAuthChecker(fn) {
  authChecker = fn;
}

export function setPublicRoutes(routeList) {
  PUBLIC_ROUTES.length = 0;
  routeList.forEach(r => PUBLIC_ROUTES.push(r));
}

export function getCurrentRoute() {
  return currentRoute;
}

export function initRouter() {
  const handleRoute = () => {
    const rawHash = window.location.hash || '#/home';
    // Strip query string before parsing path segments
    const hashWithoutQuery = rawHash.split('?')[0];
    const [path, ...paramParts] = hashWithoutQuery.slice(1).split('/').filter(Boolean);
    const fullPath = '/' + (path || 'home');
    const params = paramParts;

    // Auth guard: if not logged in and not a public route → redirect to login
    if (authChecker && !authChecker() && !PUBLIC_ROUTES.includes(fullPath)) {
      window.location.hash = '#/login';
      return;
    }

    // If logged in and visiting login/signup → redirect to dashboard
    if (authChecker && authChecker() && (fullPath === '/login' || fullPath === '/signup')) {
      window.location.hash = '#/dashboard';
      return;
    }

    currentRoute = fullPath;
    const handler = routes[fullPath];
    if (handler) {
      const appContent = document.getElementById('app-content');
      if (appContent) {
        appContent.innerHTML = handler(params);
        window.scrollTo(0, 0);
        if (onRouteChange) onRouteChange(fullPath, params);
      }
    }
  };

  window.addEventListener('hashchange', handleRoute);
  setTimeout(handleRoute, 0);
}

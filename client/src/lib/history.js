// Navigation helper for use outside React components (e.g., in Redux actions)
// In React Router v6, programmatic navigation from outside components requires
// a shared reference that gets set by the router.

let navigator = null;

export const setNavigator = (nav) => { navigator = nav; };

const history = {
  push: (path) => {
    if (navigator) {
      navigator(path);
    } else {
      window.location.href = path;
    }
  },
};

export default history;

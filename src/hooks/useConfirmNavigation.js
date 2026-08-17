import { useCallback } from 'react';

export default function useConfirmNavigation(statetouch) {
  const confirmNavigation = useCallback(
    (callback) => {
      if (statetouch) {
        if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
          if (callback) callback();
        }
      } else {
        if (callback) callback();
      }
    },
    [statetouch]
  );

  return confirmNavigation;
}

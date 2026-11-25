/*
TASK 7. Several deep components (the register page, the edit page, the delete
button on the overview) need to announce a result in the layout's toast area.
Passing an addToast prop down through every level would touch components that
do not care, so this is context's job.

Implement, in this file:
  - a ToastContext created with createContext;
  - a ToastProvider component that keeps a list of toast messages in state,
    defines addToast(message) to append a message (never mutate the array),
    and provides { toasts, addToast } to its children through the context;
  - a useToasts() hook that reads that context with useContext and returns it.

Because the provided value comes from the provider's state, every component
reading the context re-renders when a toast is added - that is the context
re-render trigger this module taught, and the toast area depends on it.

App.jsx already wraps the routes in <ToastProvider> and the layout already
renders the toasts it gets from useToasts(); this stub just makes both no-ops
until you implement the real thing.
*/
export function ToastProvider({ children }) {
  return children;
}

export function useToasts() {
  return { toasts: [], addToast: () => {} };
}

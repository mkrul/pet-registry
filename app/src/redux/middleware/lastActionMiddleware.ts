import { Middleware } from "@reduxjs/toolkit";

export const lastActionMiddleware: Middleware = () => next => action => {
  next({
    type: "SET_LAST_ACTION",
    payload: action
  });
  return next(action);
};

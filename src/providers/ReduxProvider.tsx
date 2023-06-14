"use client";

import store from "@/store";
import { FC, PropsWithChildren } from "react";
import { Provider } from "react-redux";

const ReduxProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;

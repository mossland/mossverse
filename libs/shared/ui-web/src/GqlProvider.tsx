import { ApolloProvider } from "@apollo/client";
import { client, setLink } from "@shared/data-access";
import React, { ReactNode, useEffect, useState } from "react";

type GqlProviderProps = {
  uri: string;
  ws?: string | null;
  children: ReactNode;
};

export const GqlProvider = ({ children, uri, ws }: GqlProviderProps) => {
  const [isInit, setIsInit] = useState(false);
  useEffect(() => {
    setLink(uri);
    setTimeout(() => setIsInit(true), 100);
  }, []);
  return <ApolloProvider client={client}>{isInit && children}</ApolloProvider>;
};

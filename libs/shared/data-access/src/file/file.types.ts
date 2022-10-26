import gql from "graphql-tag";
import * as types from "../types";
import { cnst } from "@shared/util";
export type File = {
  id: string;
  //   filename: string;
  //   mimetype: string;
  //   encoding: string;
  imageSize: [number, number];
  url: string;
  //   origin?: string;
  //   status: cnst.FileStatus;
  //   createdAt: Date;
  //   updatedAt: Date;
};
export const fileFragment = gql`
  fragment fileFragment on File {
    id
    # filename
    # mimetype
    # encoding
    imageSize
    url
    # origin
    # status
    # createdAt
    # updatedAt
  }
`;

export const defaultFile: File = {
  id: "",
  imageSize: [0, 0],
  url: "",
};

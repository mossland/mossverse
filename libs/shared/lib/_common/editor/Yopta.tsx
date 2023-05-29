"use client";
import { Bold, CodeMark, Italic, Strike, Underline } from "@yoopta/marks";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import { fetch } from "@shared/client";
import Callout from "@yoopta/callout";
import Code from "@yoopta/code";
import Embed from "@yoopta/embed";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import Paragraph from "@yoopta/paragraph";
// import Video from "@yoopta/video";
import { Utils } from "@util/client";

export const defaultMarks = [Bold, Italic, CodeMark, Underline, Strike];
export const makeDefaultPlugins = ({
  addFilesGql,
  addFile,
}: {
  addFilesGql?: (fileList: FileList, id?: string) => Promise<fetch.LightFile[]>;
  addFile?: (file: fetch.LightFile | fetch.LightFile[], options?: { idx?: number; limit?: number }) => void;
}) => [
  Paragraph,
  Callout,
  Code,
  Link,
  NumberedList,
  BulletedList,
  TodoList,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Embed.extend({ options: { maxWidth: 650, maxHeight: 750 } }),
  ...(addFilesGql
    ? [
        Image.extend({
          options: {
            maxWidth: 650,
            maxHeight: 650,
            onUpload: async (f: any) => {
              let [file] = await addFilesGql([f] as any);
              for (let i = 0; i < 15; i++) {
                file = await fetch.getFile(file.id);
                await Utils.sleep(1000);
                if (file.status === "active") break;
              }
              if (file.status !== "active") throw new Error("File upload failed");
              addFile?.(file);
              return { url: file.url, width: file.imageSize[0], height: file.imageSize[1] };
            },
          },
        }),
        // Video.extend({
        //   options: {
        //     maxWidth: 650,
        //     maxHeight: 650,
        //     onUpload: async (file: File) => {
        //       return { url: "fsadfd", width: 200, height: 200 };
        //     },
        //   },
        // }),
      ]
    : []),
];

import React, { MutableRefObject, Suspense, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card } from "antd";
import { gql, store } from "@social/data-access";
import { Field, Img } from "@shared/ui-web";
import { cnst, Utils } from "@shared/util";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import ImageResize from "quill-image-resize-module-react";
import { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

export const Editor = dynamic(
  async () => {
    const { default: RQ, Quill } = await import("react-quill");
    // const { default: ImageResize } = await import("quill-image-resize-module");
    // Quill.register("modules/imageResize", ImageResize);
    return function comp({ ref, addFiles, ...props }: any) {
      const imageHandler = () => {
        if (!ref.current) return;
        const { getEditor } = ref.current;
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        document.body.appendChild(input);
        input.click();
        const range = getEditor().getSelection(true);
        input.onchange = async (e: any) => {
          if (!e.target.files?.length) return;
          const [file] = await addFiles(e.target.files);
          getEditor().insertEmbed(range, "image", file.url);
          getEditor().setSelection(range.index + 1);
        };
      };
      const modules = {
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ size: ["small", false, "large", "huge"] }, { color: [] }],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }, { align: [] }],
            ["image"],
          ],
          handlers: {
            // image: imageHandler,
          },
        },
        // imageResize: {
        //   parchment: Quill.import("parchment"),
        //   modules: ["Resize", "DisplaySize", "Toolbar"],
        // },
      };
      return (
        <RQ
          ref={ref}
          modules={modules}
          //   formats={cnst.quillEditorFormats}
          {...props}
        />
      );
    };
  },
  { ssr: false }
);

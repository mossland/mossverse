import dynamic from "next/dynamic";
export type { MenuItem } from "./Menu";
export const Dropdown = dynamic(() => import("./Dropdown").then((mod) => mod.Dropdown));
export const Modal = dynamic(() => import("./Modal").then((mod) => mod.Modal));
export const Messages = dynamic(() => import("./Messages"));
export const Popconfirm = dynamic(() => import("./Popconfirm").then((mod) => mod.Popconfirm));
export const Card = dynamic(() => import("./Card").then((mod) => mod.Card));
export const Button = dynamic(() => import("./Button").then((mod) => mod.Button));
export const Avatar = dynamic(() => import("./Avatar").then((mod) => mod.Avatar));
export const Checkbox = dynamic(() => import("./Checkbox").then((mod) => mod.Checkbox));
export const Pagination = dynamic(() => import("./Pagination").then((mod) => mod.Pagination));
export const Spin = dynamic(() => import("./Spin").then((mod) => mod.Spin));
export const Upload = dynamic(() => import("./Upload").then((mod) => mod.Upload));
export const ServerPagination = dynamic(() => import("./ServerPagination").then((mod) => mod.ServerPagination));
export const ServerTable = dynamic(() => import("./ServerTable").then((mod) => mod.ServerTable));
export const Menu = dynamic(() => import("./Menu").then((mod) => mod.Menu));
export const Empty = dynamic(() => import("./Empty").then((mod) => mod.Empty));
export const Table = dynamic(() => import("./Table").then((mod) => mod.Table));
export const Tab = dynamic(() => import("./Tab").then((mod) => mod.Tab));
export const PageHeader = dynamic(() => import("./PageHeader").then((mod) => mod.PageHeader));
export const InputWrapper = dynamic(() => import("./InputWrapper").then((mod) => mod.InputWrapper));

export const Badge = Object.assign(
  dynamic(() => import("./Badge").then((mod) => mod.Badge)),
  {
    Ribbon: dynamic(() => import("./Badge").then((mod) => mod.Ribbon)),
  }
);

export const Input = Object.assign(
  dynamic(() => import("./Input").then((mod) => mod.Input)),
  {
    Number: dynamic(() => import("./Input").then((mod) => mod.Input.Number)),
    Password: dynamic(() => import("./Input").then((mod) => mod.Input.Password)),
    TextArea: dynamic(() => import("./Input").then((mod) => mod.Input.TextArea)),
    Search: dynamic(() => import("./Input").then((mod) => mod.Input.Search)),
  }
);

export const Radio = Object.assign(
  dynamic(() => import("./Radio").then((mod) => mod.Radio)),
  {
    Item: dynamic(() => import("./Radio").then((mod) => mod.Radio.Item)),
  }
);
export const SelectMenu = Object.assign(
  dynamic(() => import("./SelectMenu").then((mod) => mod.SelectMenu)),
  {
    Item: dynamic(() => import("./SelectMenu").then((mod) => mod.SelectMenu.Item)),
  }
);

export const Skeleton = Object.assign(
  dynamic(() => import("./Skeleton").then((mod) => mod.Skeleton)),
  {
    Button: dynamic(() => import("./Skeleton").then((mod) => mod.Skeleton.Button)),
    Input: dynamic(() => import("./Skeleton").then((mod) => mod.Skeleton.Input)),
  }
);

export const Typography = Object.assign(
  dynamic(() => import("./Typography").then((mod) => mod.Typography)),
  {
    Title: dynamic(() => import("./Typography").then((mod) => mod.Typography.Title)),
    Text: dynamic(() => import("./Typography").then((mod) => mod.Typography.Text)),
  }
);

export const Select = Object.assign(
  dynamic(() => import("./Select").then((mod) => mod.Select)),
  {
    Option: dynamic(() => import("./Select").then((mod) => mod.Select.Option)),
  }
);
export const List = Object.assign(
  dynamic(() => import("./List").then((mod) => mod.List)),
  {
    Item: Object.assign(
      dynamic(() => import("./List").then((mod) => mod.List.Item)),
      { Meta: dynamic(() => import("./List").then((mod) => mod.List.Item.Meta)) }
    ),
  }
);
export const DatePicker = Object.assign(
  dynamic(() => import("./DatePicker").then((mod) => mod.DatePicker)),
  {
    RangePicker: dynamic(() => import("./DatePicker").then((mod) => mod.DatePicker.RangePicker)),
    TimePicker: dynamic(() => import("./DatePicker").then((mod) => mod.DatePicker.TimePicker)),
  }
);

// export const AnimWrapper = Object.assign(
//   dynamic(() => import("./AnimWrapper").then((mod) => mod.AnimWrapper)),
//   {
//     List: dynamic(() => import("./AnimWrapper").then((mod) => mod.AnimWrapper.List)),
//   }
// );
export * from "./AnimWrapper";

// export const ThemeToggle = dynamic(() => import("./ThemeToggle").then((mod) => mod.ThemeToggle));
export * from "./ThemeToggle";

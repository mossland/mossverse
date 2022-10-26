import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

type DefaultLayoutProps = {
  children: ReactNode;
};

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="bg-gray-100">
      <div className="bg-white container min-h-screen shadow-md">{children}</div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

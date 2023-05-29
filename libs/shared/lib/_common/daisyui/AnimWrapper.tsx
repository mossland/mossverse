"use client";
import { animated, useSpring, useSprings } from "react-spring";
import React, { ReactNode } from "react";

export const AnimWrapper = () => {
  return <></>;
};

type ListProps = {
  length: number;
  list: any;
  itemRender: (item: any, idx?: number) => ReactNode;
};

export const AnimWrapperList = ({ length, list, itemRender }: ListProps) => {
  const [props, api] = useSprings(length, (i) => ({
    opacity: 1,
    translateY: 0,
    delay: i * 100,
    from: {
      opacity: 0,
      translateY: -60,
      delay: i * 100,
    },
  }));

  return (
    <>
      {props.map((style, idx) => {
        const item = list[idx];
        return (
          <animated.div key={idx} style={style}>
            {itemRender(item, idx)}
          </animated.div>
        );
      })}
    </>
  );
};

type ContentProps = {
  children: ReactNode;
  className?: string;
};
// Manager.Content;
{
  /* <AnimWrapperContent className="bg-base-100 rounded-2xl drop-shadow-xl"> */
}

export const AnimWrapperContent = ({ children, className = "" }: ContentProps) => {
  const props = useSpring({
    opacity: 1,
    translateY: 0,
    from: {
      opacity: 0,
      translateY: -30,
    },
  });

  // bg-base-100 rounded-2xl drop-shadow-xl
  return (
    <animated.div className={className} style={props}>
      {children}
    </animated.div>
  );
};

import React, { useRef, useCallback, useState, ReactElement, useEffect, isValidElement } from "react";
import { useDrag, useGesture } from "@use-gesture/react";
import { useSprings, a, useSpring } from "react-spring";

interface CarouselProps {
  children: React.ReactElement | React.ReactElement[];
  showButtons?: boolean;
  showCounter?: boolean;
  autoPlay?: boolean;
}

export const Carousel = ({ children, showButtons = true, showCounter = true, autoPlay = true }: CarouselProps) => {
  const [width, setWidth] = useState(0);
  const ref = useRef();
  const measuredRef = useCallback((node) => {
    console.log(node, children);
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);
  console.log(children);
  return (
    <div className="relative h-full " ref={measuredRef}>
      {width !== 0 ? (
        <>
          {isValidElement(children) || children.length === 1 ? (
            <>{children}</>
          ) : (
            <Slider showButtons={showButtons} showCounter={showCounter} autoPlay={autoPlay} itemWidth={width}>
              {children}
            </Slider>
          )}
        </>
      ) : (
        "null"
      )}
    </div>
  );
};

/**
 * Calculates a spring-physics driven infinite slider
 *
 * @param {Array} items - display items
 * @param {Function} children - render child
 * @param {number} width - fixed item with
 * @param {number} visible - number of items that must be visible on screen
 * @param {object} style - container styles
 * @param {boolean} showButtons - shows buttons
 * @param {boolean} showCounter - shows counter
 */
interface SliderProps {
  // items: React.ReactElement[];
  itemWidth?: number | "full";
  visible?: number;
  style?: React.CSSProperties;
  children: React.ReactElement[];
  showButtons?: boolean;
  showCounter?: boolean;
  autoPlay?: boolean;
}

export const Slider = ({
  children,
  itemWidth = "full",
  visible = children.length - 2,
  showButtons,
  showCounter,
  autoPlay,
}: SliderProps) => {
  if (children.length <= 2)
    console.warn(
      "The slider doesn't handle two or less items very well, please use it with an array of at least 3 items in length"
    );
  console.log(children);
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const width = itemWidth === "full" ? windowWidth : Math.ceil(itemWidth);
  const idx = useCallback((x, l = children.length) => (x < 0 ? x + l : x) % l, [children]);
  const getPos = useCallback((i, firstVis, firstVisIdx) => idx(i - firstVis + firstVisIdx), [idx]);
  // Important only if specifyng width, centers the element in the slider
  const offset = 0;
  const [springs, set] = useSprings(children.length, (i) => ({
    x: (i < children.length - 1 ? i : -1) * width + offset,
  }));
  const prev = useRef([0, 1]);
  const index = useRef(0);
  const [active, setActive] = useState(1);
  const timerRef = useRef<NodeJS.Timer>();
  const draggingRef = useRef<boolean>(false);
  const runSprings = useCallback(
    (y, vy, down, xDir, cancel, xMove) => {
      // This decides if we move over to the next slide or back to the initial
      if (!down) {
        index.current += ((-xMove + (width + xMove)) / width) * (xDir > 0 ? -1 : 1);
        // cancel()
      }
      if (index.current + 1 > children.length) {
        setActive((index.current % children.length) + 1);
      } else if (index.current < 0) {
        setActive(children.length + ((index.current + 1) % children.length));
      } else {
        setActive(index.current + 1);
      }
      // The actual scrolling value
      const finalY = index.current * width;
      // Defines currently visible slides
      const firstVis = idx(Math.floor(finalY / width) % children.length);
      const firstVisIdx = vy < 0 ? children.length - visible - 1 : 1;
      set((i) => {
        const position = getPos(i, firstVis, firstVisIdx);
        const prevPosition = getPos(i, prev.current[0], prev.current[1]);
        const rank =
          firstVis -
          (finalY < 0 ? children.length : 0) +
          position -
          firstVisIdx +
          (finalY < 0 && firstVis === 0 ? children.length : 0);
        return {
          // x is the position of each of our slides
          x: (-finalY % (width * children.length)) + width * rank + (down ? xMove : 0) + offset,
          // this defines if the movement is immediate
          // So when an item is moved from one end to the other we don't
          // see it moving
          immediate: vy < 0 ? prevPosition > position : prevPosition < position,
        };
      });

      prev.current = [firstVis, firstVisIdx];
    },
    [idx, getPos, width, visible, set, children.length]
  );

  const bind = useDrag(
    ({ offset: [x], first, last, direction, down, direction: [xDir], cancel, movement: [xMove] }) => {
      first && timerRef.current && clearInterval(timerRef.current);
      last &&
        (timerRef.current = setInterval(() => {
          console.log("start interval desu");
          buttons(1);
        }, 3000));

      direction[0] && runSprings(-x, -direction[0], down, xDir, cancel, xMove);
    }
  );

  const buttons = (next) => {
    index.current += next;
    runSprings(0, next, true, -0, null, -0);
  };

  useEffect(() => {
    autoPlay &&
      (timerRef.current = setInterval(() => {
        buttons(1);
      }, 3000));

    return () => {
      autoPlay && timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      {showButtons ? (
        <div className="absolute top-0 flex items-center w-full h-full">
          <button className="absolute bg-none text-gray-400  left-0  z-[1]" onClick={() => buttons(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.2426 6.34317L14.8284 4.92896L7.75739 12L14.8285 19.0711L16.2427 17.6569L10.5858 12L16.2426 6.34317Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button className="absolute bg-none text-gray-400    right-0 z-[1]" onClick={() => buttons(1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      ) : null}
      <div {...bind()} className="relative flex items-center w-full h-full overflow-hidden ">
        {springs.map(({ x }, i) => {
          return (
            <a.div className={`absolute h-full will-change-transform `} style={{ width, x }} key={i}>
              {children[i]}
            </a.div>
          );
        })}
      </div>
      {showCounter ? <InstaCounter currentIndex={active} length={children.length} /> : null}
    </>
  );
};

interface InstaCounterProps {
  currentIndex: number;
  length: number;
}
const InstaCounter = ({ currentIndex, length }: InstaCounterProps) => {
  const dots: JSX.Element[] = [];
  // for (const [index] of length) {
  for (let i = 0; i < length; i++) {
    dots.push(<Dot key={i} active={currentIndex - 1 === i} />);
  }

  return (
    <div className="absolute bottom-0 w-full">
      <div className="flex items-center justify-center px-4 py-3 ">{dots}</div>
    </div>
  );
};

interface DotProps {
  active: boolean;
}

const Dot = ({ active }: DotProps) => {
  const { transform, opacity } = useSpring({
    opacity: active ? 1 : 0.8,
    transform: active ? `scale(1.5)` : `scale(1)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <a.div
      className={`rounded-[99px] bg-whte w-[5px] h-[5px] m-1 ${active ? "bg-color-main" : "bg-gray-300"}`}
      style={{ opacity: opacity.to((o) => o), transform }}
    />
  );
};

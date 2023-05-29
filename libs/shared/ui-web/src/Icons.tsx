import { twMerge } from "tailwind-merge";

interface IconProps {
  className?: string;
  viewBox?: string;
  width?: string | number;
}
// https://github.com/oAuth-Buttons/logo-providers/tree/master/svg
export const Github = ({ className, viewBox = "0 0 24 24", width = "40" }: IconProps) => {
  return (
    <svg
      className={twMerge("fill-black", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={width}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
};

export const Kakao = ({ className, viewBox = "-75 -90 350 350", width = "40" }: IconProps) => {
  return (
    <svg
      className={twMerge("fill-[#3c1e1e] bg-[#FEE500]", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={width}
    >
      <polygon points="45 140 40 185 90 150 45 140" />
      <ellipse cx="100" cy="80" rx="100" ry="80" />
    </svg>
  );
};

export const Naver = ({ className, viewBox = "0 0 200 200", width = "40" }: IconProps) => {
  return (
    <svg
      className={twMerge("fill-[#1ec800]", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={width}
    >
      <polygon points="115.9,145.8 83.7,98.4 83.7,145.8 50,145.8 50,54.3 84.2,54.3 116.4,101.6 116.4,54.3    150,54.3 150,145.8 115.9,145.8" />
    </svg>
  );
};
export const Google = ({ className, viewBox = "5 5 25 25", width = "40" }: IconProps) => {
  return (
    <svg
      className={twMerge("", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={width}
    >
      <path
        className="logo"
        fill="#4285f4"
        d="M26.64,18.2a10.34,10.34,0,0,0-.16-1.84H18v3.48h4.84A4.14,4.14,0,0,1,21,22.56v2.26H24a8.78,8.78,0,0,0,2.68-6.62Z"
      />
      <path
        className="bottom logo"
        fill="#34a853"
        d="M18,27a8.59,8.59,0,0,0,6-2.18L21,22.56A5.43,5.43,0,0,1,13,19.71H10V22a9,9,0,0,0,8,5Z"
      />
      <path className="left logo" fill="#fbbc05" d="M13,19.71a5.32,5.32,0,0,1,0-3.42V14H10A9,9,0,0,0,10,22l3-2.33Z" />
      <path
        className="top logo"
        fill="#ea4335"
        d="M18,12.58a4.86,4.86,0,0,1,3.44,1.35L24,11.34A8.65,8.65,0,0,0,18,9a9,9,0,0,0-8,5l3,2.33a5.36,5.36,0,0,1,5-3.71Z"
      />
    </svg>
  );
};

export const Facebook = ({ className, viewBox = "5 5 38 38", width = "40" }: IconProps) => {
  return (
    <svg
      className={twMerge("fill-[#3C5A99] rounded-full", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={width}
    >
      <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z" />
      <path
        fill="#fff"
        d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
      />
    </svg>
  );
};

export const Discord = ({ className, viewBox = "0 -28.5 256 256", width = "800" }: IconProps) => {
  return (
    <svg
      className={twMerge("fill-[#7289DA]", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={width}
    >
      <path
        d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
        fill="#5865F2"
        fill-rule="nonzero"
      />
    </svg>
  );
};
export const Instagram = ({ className, viewBox = "0 0 50 50", width = "40" }: IconProps) => {
  return (
    <svg
      className={twMerge("fill-[#e53c5c]", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={width}
    >
      <path
        d="M256,49.47c67.27,0,75.23.26,101.8,1.47,24.56,1.12,37.9,5.22,46.78,8.67a78.05,78.05,0,0,1,29,18.84,78.05,78.05,0,0,1,18.84,29c3.45,8.88,7.55,22.22,8.67,46.78,1.21,26.56,1.47,34.53,1.47,101.8s-.26,75.23-1.47,101.8c-1.12,24.56-5.22,37.9-8.67,46.78a83.43,83.43,0,0,1-47.81,47.81c-8.88,3.45-22.22,7.55-46.78,8.67-26.56,1.21-34.53,1.47-101.8,1.47s-75.24-.26-101.8-1.47c-24.56-1.12-37.9-5.22-46.78-8.67a78.05,78.05,0,0,1-29-18.84,78.05,78.05,0,0,1-18.84-29c-3.45-8.88-7.55-22.22-8.67-46.78-1.21-26.56-1.47-34.53-1.47-101.8s.26-75.23,1.47-101.8c1.12-24.56,5.22-37.9,8.67-46.78a78.05,78.05,0,0,1,18.84-29,78.05,78.05,0,0,1,29-18.84c8.88-3.45,22.22-7.55,46.78-8.67,26.56-1.21,34.53-1.47,101.8-1.47m0-45.39c-68.42,0-77,.29-103.87,1.52S107,11.08,91,17.3A123.49,123.49,0,0,0,46.36,46.36,123.49,123.49,0,0,0,17.3,91C11.08,107,6.82,125.32,5.6,152.13S4.08,187.58,4.08,256s.29,77,1.52,103.87S11.08,405,17.3,421a123.49,123.49,0,0,0,29.06,44.62A123.49,123.49,0,0,0,91,494.69c16,6.23,34.34,10.49,61.15,11.71s35.45,1.52,103.87,1.52,77-.29,103.87-1.52S405,500.92,421,494.69A128.82,128.82,0,0,0,494.69,421c6.23-16,10.49-34.34,11.71-61.15s1.52-35.45,1.52-103.87-.29-77-1.52-103.87S500.92,107,494.69,91a123.49,123.49,0,0,0-29.06-44.62A123.49,123.49,0,0,0,421,17.3C405,11.08,386.68,6.82,359.87,5.6S324.42,4.08,256,4.08Z"
        transform="translate(-4.08 -4.08)"
      />
      <path
        d="M256,126.64A129.36,129.36,0,1,0,385.36,256,129.36,129.36,0,0,0,256,126.64ZM256,340a84,84,0,1,1,84-84A84,84,0,0,1,256,340Z"
        transform="translate(-4.08 -4.08)"
      />
      <circle cx="386.4" cy="117.44" r="30.23" />
    </svg>
  );
};

export const Apple = ({ className, viewBox = "-5 -5 40 40", width = "40" }: IconProps) => {
  return (
    <svg
      className={twMerge("fill-black", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={width}
    >
      <path d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305c0.138,4.109,3.695,5.55,3.756,5.55 c-0.061,0.077-0.537,1.963-1.947,3.94C23.204,26.283,21.962,28,20.076,28c-1.794,0-2.438-1.135-4.508-1.135 c-2.223,0-2.852,1.135-4.554,1.135c-1.886,0-3.22-1.809-4.4-3.496c-1.533-2.208-2.836-5.673-2.882-9 c-0.031-1.763,0.307-3.496,1.165-4.968c1.211-2.055,3.373-3.45,5.734-3.496c1.809-0.061,3.419,1.242,4.523,1.242 c1.058,0,3.036-1.242,5.274-1.242C21.394,7.041,23.97,7.332,25.565,9.785z M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247 c1.058-1.242,2.729-2.085,4.17-2.085c0.092,1.61-0.491,3.189-1.533,4.339C18.098,5.937,16.488,6.872,15.001,6.688z" />
    </svg>
  );
};
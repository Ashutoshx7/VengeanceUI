import React from "react";

export default function IsometricBox01({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 221 141"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        width="79.6405"
        height="119.248"
        transform="matrix(0.866025 -0.5 0.866025 0.5 48 80.8203)"
        fill="url(#paint1_linear_836_760)"
      />
      <path
        d="M81.9999 90.3112L134.5 60.0003L177.64 84.9074L125.14 115.218L81.9999 90.3112Z"
        fill="url(#paint2_linear_836_760)"
      />
      <path
        d="M62.5002 89L18.0001 63.5C16.4118 62.5924 14.2057 61.5304 12.3281 59.5255C10.4153 57.483 10 54.5514 10 51.7532L10.0001 45.5L72.5 78.5H80L143 45V55C143 58.2 139.333 61 137.5 62L91.0002 89C78.6002 94.6 66.8335 91.3333 62.5002 89Z"
        fill="url(#paint3_linear_836_760)"
        stroke="#d4d4d8"
      />
      <path
        d="M16.0215 35.5337L61.5462 9.25C69.9163 4.41754 83.4869 4.41752 91.857 9.25L136.89 35.25C145.26 40.0825 145.26 47.9175 136.89 52.75L91.3657 79.0337C82.9956 83.8661 69.4249 83.8661 61.0548 79.0337L16.0215 53.0337C7.65142 48.2012 7.65155 40.3662 16.0215 35.5337Z"
        fill="white"
        stroke="#d4d4d8"
      />
      {/* Isometric AI Text */}
      <text
        x="0"
        y="0"
        dy=".35em"
        fontSize="56"
        fontWeight="900"
        fill="#f87171"
        textAnchor="middle"
        transform="translate(76.5, 43.5) scale(1, 0.57735) rotate(-45)"
        style={{ fontFamily: 'sans-serif', letterSpacing: '-0.02em', pointerEvents: 'none' }}
      >
        AI
      </text>
      <defs>
        <linearGradient
          id="paint0_linear_836_760"
          x1="21.9782"
          y1="0"
          x2="21.9782"
          y2="70.0332"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="black" stopOpacity="0.08" />
          <stop offset="1" stopColor="black" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_836_760"
          x1="39.8202"
          y1="0"
          x2="39.8202"
          y2="119.248"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="black" stopOpacity="0.08" />
          <stop offset="1" stopColor="black" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_836_760"
          x1="105.277"
          y1="71.5335"
          x2="126.847"
          y2="108.894"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="black" stopOpacity="0.08" />
          <stop offset="1" stopColor="black" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_836_760"
          x1="10"
          y1="52.5"
          x2="143"
          y2="54.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#e5e5e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

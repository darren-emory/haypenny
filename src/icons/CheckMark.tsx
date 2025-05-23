import React from 'react';

type Props = {
  theme: string;
};

function CheckMark({ theme }: Props) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // large style
      width="52"
      height="52"
    >
      <path
        d="M19.2803 6.76264C19.5732 7.05553 19.5732 7.53041 19.2803 7.8233L9.86348 17.2402C9.57058 17.533 9.09571 17.533 8.80282 17.2402L4.71967 13.157C4.42678 12.8641 4.42678 12.3892 4.71967 12.0963C5.01256 11.8035 5.48744 11.8035 5.78033 12.0963L9.33315 15.6492L18.2197 6.76264C18.5126 6.46975 18.9874 6.46975 19.2803 6.76264Z"
        fill={theme === 'dark' ? '#323544' : '#fff'}
      />
    </svg>
  );
}

export default CheckMark;

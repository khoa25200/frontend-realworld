/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CircularProgress } from '@mui/material';

const Loading = ({ height }: { height: number }) => {
  const wrapper = css`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: ${height}vh;
  `;

  return (
    <div css={wrapper}>
      <CircularProgress sx={{ color: '#F97B22' }} />
    </div>
  );
};

export default Loading;

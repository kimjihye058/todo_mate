import { css } from "@emotion/react";

type TodoIconSvgProps = {
  color?: string;
};

const TodoIconSvg = ({
  color = "var(--category-main-color)",
}: TodoIconSvgProps) => {
  return (
    <svg css={styles.checkboxSvg}>
      <circle
        cx={6.46154}
        cy={6.46154}
        r={6.46154}
        fill={color}
        fillOpacity={1}
      />
      <circle
        cx={6.46154}
        cy={14.5387}
        r={6.46154}
        fill={color}
        fillOpacity={1}
      />
      <circle
        cx={14.5387}
        cy={14.5387}
        r={6.46154}
        fill={color}
        fillOpacity={1}
      />
      <circle
        cx={14.5387}
        cy={6.46154}
        r={6.46154}
        fill={color}
        fillOpacity={1}
      />
    </svg>
  );
};

const styles = {
  checkboxSvg: css`
    width: 21px;
    height: 21px;
    fill: none;
  `,
};

export default TodoIconSvg;

interface TodoIconSvgProps {
  colors: string[];
}

const TodoIconSvg = ({ colors }: TodoIconSvgProps) => {
  let fill = [colors[0], colors[0], colors[0], colors[0]];

  switch (colors.length) {
    case 1:
      fill = [colors[0], colors[0], colors[0], colors[0]];
      break;
    case 2:
      fill = [colors[0], colors[1], colors[1], colors[0]];
      break;
    case 3:
      fill = [colors[0], colors[0], colors[2], colors[1]];
      break;
    case 4:
      fill = [colors[1], colors[3], colors[2], colors[0]];
      break;
    default:
      fill = [
        `var(--category-main-color)`,
        `var(--category-main-color)`,
        `var(--category-main-color)`,
        `var(--category-main-color)`,
      ];
      break;
  }

  return (
    <svg width="21" height="21" fill="none">
      <circle
        cx="6.46154"
        cy="14.5387"
        r="6.46154"
        fill={fill[1]}
        fillOpacity={colors.length > 1 ? "0.9" : "1"}
      />
      <circle
        cx="14.5387"
        cy="14.5387"
        r="6.46154"
        fill={fill[2]}
        fillOpacity={colors.length > 1 ? "0.9" : "1"}
      />
      <circle
        cx="14.5387"
        cy="6.46154"
        r="6.46154"
        fill={fill[3]}
        fillOpacity={colors.length > 1 ? "0.9" : "1"}
      />
      <circle
        cx="6.46154"
        cy="6.46154"
        r="6.46154"
        fill={fill[0]}
        fillOpacity={colors.length > 1 ? "0.9" : "1"}
      />
    </svg>
  );
};

export default TodoIconSvg;

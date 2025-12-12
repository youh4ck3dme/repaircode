import "./ShimmerText.css";

const ShimmerText = ({ children, className = "" }) => {
  return <span className={`shimmer-text ${className}`}>{children}</span>;
};

export default ShimmerText;

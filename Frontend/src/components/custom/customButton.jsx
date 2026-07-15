import ButtonLoader from "../loader/buttonLoader";

export default function CustomButton({ children, variant = "primary", loading = false, disabled = false, className = "", ...props }) {
  const classMap = {
    primary: "primary-btn",
    secondary: "secondary-btn",
    danger: "danger-btn"
  };
  return (
    <button className={`${classMap[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <ButtonLoader /> : null}
      {children}
    </button>
  );
}

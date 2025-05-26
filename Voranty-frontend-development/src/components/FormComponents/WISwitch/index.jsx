import { Switch } from "antd";
import clsx from "clsx";
import styles from "./WISwitch.module.css";

export const WISwitch = ({
  wrapperClassName,
  checked,
  className,
  onChange,
  onClick,
  labelClassName,
  disabled,
  label,
  loading,
  id,
  name,
  value,
  ...rest
}) => {
  return (
    <div className={clsx(styles.switch, wrapperClassName)}>
      <Switch
        id={id}
        name={name}
        checked={checked}
        value={value}
        loading={loading}
        disabled={disabled}
        className={className}
        onChange={onChange}
        onClick={onClick}
        {...rest}
      />
      <span className={clsx(labelClassName, "p-lg")}>{label}</span>
    </div>
  );
};

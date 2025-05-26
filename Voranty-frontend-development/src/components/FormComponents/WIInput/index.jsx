import { Input } from "antd";
import clsx from "clsx";
import styles from "./WIInput.module.css";

export const WIInput = ({
  id,
  name,
  size,
  type = "text",
  label,
  value,
  suffix,
  prefix,
  onChange,
  disabled,
  isInvalid,
  allowClear = false,
  placeholder,
  errorMessage,
  parentClassName,
  labelClassName,
  rootClassName,
  require,
  ...rest
}) => {
  return (
    <div className={clsx(parentClassName, "position-relative")}>
      {label && (
        <label
          htmlFor={id}
          className={clsx(styles.label, "d-flex", labelClassName)}
        >
          {label} {require && <span className="d-block clr-danger">*</span>}
        </label>
      )}
      <Input
        id={id}
        name={name}
        type={type}
        size={size}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(styles.inputWrap, rootClassName)}
        status={isInvalid && "error"}
        prefix={prefix}
        suffix={suffix}
        allowClear={allowClear}
        {...rest}
      />
      {errorMessage && (
        <div className={clsx(styles.errorMessage)}>{errorMessage}</div>
      )}
    </div>
  );
};

export const WIPasswordInput = ({
  id,
  size,
  label,
  value,
  suffix,
  prefix,
  onChange,
  disabled,
  isInvalid,
  className,
  placeholder,
  errorMessage,
  parentClassName,
  labelClassName,
  rootClassName,
  require,
  ...rest
}) => {
  const finalClassName = {
    input: clsx(styles.input, className),
  };
  return (
    <div className={clsx(parentClassName, "position-relative")}>
      {label && (
        <label
          htmlFor={id}
          className={clsx(styles.label, "d-flex", labelClassName)}
        >
          {label} {require && <span className="d-block clr-danger">*</span>}
        </label>
      )}
      <Input.Password
        id={id}
        size={size}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        classNames={finalClassName}
        status={isInvalid && "error"}
        prefix={prefix}
        suffix={suffix}
        {...rest}
      />
      {errorMessage && (
        <div className={clsx(styles.errorMessage)}>{errorMessage}</div>
      )}
    </div>
  );
};

export const WIInputOtp = ({
  id,
  size,
  value,
  onChange,
  disabled,
  isInvalid,
  formatter,
  placeholder,
  errorMessage,
  className,
  defaultValue,
  mask,
  ...rest
}) => {
  return (
    <div className={clsx(styles.inputOtp, className, "position-relative")}>
      <Input.OTP
        id={id}
        size={size}
        formatter={formatter}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        status={isInvalid && "error"}
        mask={mask}
        {...rest}
      />
      {errorMessage && (
        <div className={clsx(styles.errorMessage)}>{errorMessage}</div>
      )}
    </div>
  );
};

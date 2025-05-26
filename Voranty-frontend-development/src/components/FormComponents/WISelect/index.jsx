import { Select } from "antd";
import clsx from "clsx";
import styles from "./WISelect.module.css";

export const WISelect = ({
  id,
  name,
  size,
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
  isInvalid,
  allowClear = true,
  errorMessage,
  rootClassName,
  parentClassName,
  labelClassName,
  mode,
  require,
  key = "select",
  ...rest
}) => {
  const finalClassName = clsx(styles.select, "w-100", rootClassName);

  return (
    <div className={clsx(styles.parent, parentClassName)} key={key}>
      {label && (
        <label
          htmlFor={id}
          className={clsx(styles.label, "d-flex", labelClassName)}
        >
          {label} {require && <span className="d-block clr-danger">*</span>}
        </label>
      )}
      <Select
        id={id}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        status={isInvalid && "error"}
        className={finalClassName}
        placeholder={placeholder ? placeholder : '"Select a value"'}
        mode={mode}
        popupClassName={styles.selectPopup}
        suffixIcon={<span className="clr-black">{"Icons.AltArrowDown"}</span>}
        disabled={disabled}
        {...rest}
      />
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
};

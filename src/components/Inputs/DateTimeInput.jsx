// @ts-check

import React from "react";

import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

export default function SimpleInput({
  id,
  className,
  label,
  leftIcon,
  rightIcon,
  inputProps,
  helperText,
}) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <div className="relative w-full">
        {leftIcon ? leftIcon : null}
        {inputProps.type === "textarea" ? (
          <textarea id={id} {...inputProps} />
        ) : (
          <input id={id} {...inputProps} />
        )}
        {rightIcon ? rightIcon : null}
      </div>
      <span className={css({ color: "red !important" })}>{helperText}</span>
    </div>
  );
}

SimpleInput.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  inputProps: PropTypes.objectOf(PropTypes.any),
  helperText: PropTypes.string,
};
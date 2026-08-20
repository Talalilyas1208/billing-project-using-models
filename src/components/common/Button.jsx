import React from "react";
import { Button as AntButton } from "antd";


const Button = React.forwardRef((props, ref) => (
  <AntButton ref={ref} {...props} />
));
Button.displayName = "Button";

export default Button;

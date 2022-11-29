import switchButtonStyle from "../styles/switch-button.css";

export const links = () => [{ rel: "stylesheet", href: switchButtonStyle }];

export const SwitchButton = ({
  label = "",
  name = "",
  isChecked = false,
}: {
  label?: string;
  name?: string;
  isChecked?: boolean;
}) => {
  return (
    <label className="switch-btn flex cursor-pointer items-center">
      <div className="px-2">{label}</div>
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          defaultChecked={isChecked}
          className="input-switch hidden"
          value="true"
        />
        <div className="toggle-path h-5 w-9 rounded-full bg-gray-200 shadow-inner"></div>
        <div className="toggle-circle absolute inset-y-0 left-0 h-3.5 w-3.5 rounded-full bg-white shadow"></div>
      </div>
    </label>
  );
};

export default SwitchButton;

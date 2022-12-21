import React, { memo, useEffect, useState } from "react";

type PropTypes = {
  innerRef: React.Ref<HTMLTextAreaElement>;
  name: string;
  customClasses?: string;
  isError?: boolean;
  defaultValue?: string;
  spaces?: number;
  isRequired?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const themeTextarea = {
  light: { background: "white", color: "black" },
  dark: { background: "#1f2a3a", color: "#cbd5e1" },
  system: {}
};

export const TextareaEditorSimple = ({
  innerRef,
  name,
  customClasses = "",
  isError = false,
  defaultValue = "",
  spaces = 4,
  onChange,
  isRequired = false,
}: PropTypes) => {
  const [text, setText] = useState<{
    value: string;
    caret: number;
    target: HTMLTextAreaElement | null;
  }>({ value: defaultValue || '', caret: -1, target: null });
  const [customStyles, setCustomStyles] = useState<{
    fontSize: string;
    theme: keyof typeof themeTextarea;
  }>({
    fontSize: "1",
    theme: "system",
  });
  const baseClasses =
    "w-full flex-1 rounded-md border-2 border-gray-100 bg-white py-2 px-3 leading-6 text-slate-700 font-semibold focus:bg-white dark:bg-slate-800 dark:text-slate-300 focus:dark:bg-slate-800";
  const classes = `${baseClasses} ${customClasses}`;

  useEffect(() => {
    if (text.target && text.caret >= 0) {
      text.target.setSelectionRange(text.caret + spaces, text.caret + spaces);
    }
  }, [text, spaces]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText({ value: e.target.value, caret: -1, target: e.target });
    onChange(e);
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    let content = e.currentTarget.value;
    let caret = e.currentTarget.selectionStart;

    if (e.key === "Tab") {
      e.preventDefault();

      let newText = `${content.substring(0, caret)}${" ".repeat(
        spaces
      )}${content.substring(caret)}`;
      setText({ value: newText, caret: caret, target: e.currentTarget });
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="relative my-2 flex justify-end px-1">
        <div className="flex items-center gap-2">
          <select
            onChange={(e) =>
              // @ts-ignore
              setCustomStyles((prev) => ({
                ...prev,
                theme: e.target.value,
              }))
            }
            className="bg-black text-white"
            value={customStyles.theme}
          >
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "150px",
            width: "120px",
            display: "flex",
            gap: 2,
          }}
        >
          <input
            type="range"
            onChange={(e) =>
              setCustomStyles((prev) => ({
                ...prev,
                fontSize: e.target.value,
              }))
            }
            value={customStyles.fontSize}
            min="0.8"
            max="2.2"
            step="0.2"
            className="pointer"
          />
          <strong>{`${customStyles.fontSize}rem`}</strong>
        </div>
      </div>
      <textarea
        ref={innerRef}
        name={name}
        rows={15}
        className={classes}
        aria-invalid={isError ? true : undefined}
        aria-errormessage={isError ? "text-area-editor-error" : undefined}
        onChange={handleChange}
        onKeyDown={handleTab}
        required={isRequired}
        defaultValue={text.value || ''}
        style={{
          fontSize: `${customStyles.fontSize}rem`,
          lineHeight: 1.3,
          ...themeTextarea[customStyles.theme],
        }}
      />
    </div>
  );
};

export default memo(TextareaEditorSimple);

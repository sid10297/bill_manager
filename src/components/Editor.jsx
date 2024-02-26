/* eslint-disable react/prop-types */
import { useRef } from "react";
import JoditEditor from "jodit-react";

export function Editor({ content, setContent }) {
  const editorRef = useRef(null);
  return (
    <JoditEditor
      ref={editorRef}
      value={content}
      onChange={(newContent) => setContent(newContent)}
    />
  );
}

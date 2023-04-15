import React, { memo, useMemo, useState, useCallback, useEffect } from "react";
import loadable from "@loadable/component";

import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

// @emotion/css
import { css } from "@emotion/css";

// contexts
import { useLanguage } from "../../../../contexts/LanguageProvider";

// services
import { fetchModel } from "../../../../services/general";

// components
import Loading from "../../../../components/Loading/Loading";
const DialogList = loadable((props) =>
  import("../../../../components/Modal/DialogList")
);
const Content = loadable((props) =>
  import("../../../../components/Inputs/Content/Content.jsx")
);

function ConfirmationDialog({ visible, onClose, onAction, selectedText }) {
  const { languageState } = useLanguage();

  const [loading, setLoading] = useState(true);

  //* Editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorChange = useCallback(
    (nEditorState) => setEditorState(nEditorState),
    [setEditorState]
  );

  const { texts, buttons } = useMemo(() => {
    return {
      texts: languageState.texts.texts,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await fetchModel(
        selectedText,
        "texts",
        [],
        "id",
        "equal"
      );
      const { data } = response;
      if (data) {
        if (data.content)
          //* fetching content
          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(htmlToDraft(data.content))
            )
          );
      }
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  };

  const onSubmit = () => {
    if (editorState) {
      let content = "";
      const parsedContent = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      if (parsedContent !== "<p></p>\n")
        content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      onAction(content);
    }
    
    setEditorState(EditorState.createEmpty());
  };

  useEffect(() => {
    if (visible) fetch();
  }, [visible]);

  return (
    <DialogList
      className={css({
        height: "auto !important",
        minHeight: "600px !important",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
      visible={visible}
      onClose={onClose}
    >
      {loading ? (
        <Loading className="w-full h-full" />
      ) : (
        <>
          <button
            onClick={onClose}
            className="transition flex items-center justify-center absolute top-2 right-2 text-error hover:bg-error hover:text-white w-8 h-8 rounded-circle"
          >
            <FontAwesomeIcon icon={faClose} className="text-xl" />
          </button>
          <div className="flex flex-col gap-4 justify-center w-full h-full">
            <h2 className="text-2xl text-dark-background2 dark:text-light-background2 font-bold">
              {texts.formDialog.title} {texts.actions[selectedText]?.title}
            </h2>
            <Content
              className="mt-2"
              value={editorState}
              onChange={onEditorChange}
              editorFixed
            />
            <div className="flex items-center justify-end gap-5">
              <button className="submit" type="button" onClick={onSubmit}>
                {buttons.accept}
              </button>
              <button className="secondary" type="button" onClick={onClose}>
                {buttons.cancel}
              </button>
            </div>
          </div>
        </>
      )}
    </DialogList>
  );
}

const ConfirmationDialogMemo = memo(
  (props) => <ConfirmationDialog {...props} />,
  arePropsEqual
);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.visible === newProps.visible &&
    oldProps.onClose === newProps.onClose &&
    oldProps.onAction === newProps.onAction
  );
}

export default ConfirmationDialogMemo;
import { useState, useRef } from "react";
import { FaceSmileIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import handleStopPropagation from "../../utils/handleStopPropagation";
import { motion } from "framer-motion";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { toast } from "react-toastify";

interface Props {
  initialValue?: string;
  autoFocus: boolean;
  onSubmit?: (data: any) => void;
}

function CommentForm({ autoFocus = false, onSubmit, initialValue = "" }: any) {
  const emojiRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [contents, setContents] = useState<string>(initialValue);

  const onEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
    setContents(contents + emojiObject.emoji);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contents) return toast("Please Fille the REquired Field");
    onSubmit({ contents });
    setContents("");
  };

  useOnClickOutside(emojiRef, () => {
    setShowPicker(false);
  });

  return (
    <>
      <div className="mt-4 relative flex items-center gap-3 ">
        <form
          id="submit-message"
          onSubmit={handleSubmit}
          className="flex items-center flex-grow"
        >
          <input
            type="text"
            value={contents}
            autoFocus={autoFocus}
            onChange={(event) => setContents(event.target.value)}
            placeholder="Enter a comment..."
            className="py-2 pl-2 pr-10 border-2  border-dark-gray w-full bg-custom-light-dark text-gray-300 focus:outline-none text-sm rounded-2xl"
          />
        </form>
        <div
          className="absolute right-12 flex items-center justify-center rounded-lg cursor-pointer"
          onClick={() => setShowPicker(!showPicker)}
        >
          <FaceSmileIcon className="h-5 text-gray-400" />

          {showPicker && (
            <div
              ref={emojiRef}
              onClick={handleStopPropagation}
              className="absolute bottom-16 right-12 text-base origin-bottom-right"
            >
              <EmojiPicker
                width={300}
                height={300}
                theme={Theme.DARK}
                searchDisabled={true}
                skinTonesDisabled={true}
                previewConfig={{
                  showPreview: false,
                }}
                lazyLoadEmojis={true}
                emojiStyle={EmojiStyle.FACEBOOK}
                autoFocusSearch={false}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}
        </div>{" "}
        <motion.button
          type="submit"
          form="submit-message"
          whileTap={{ scale: 0.94 }}
          className="flex items-center justify-center rounded-lg cursor-pointer"
        >
          <PaperAirplaneIcon className="h-5 text-gray-400 " />
        </motion.button>
      </div>
    </>
  );
}

export default CommentForm;

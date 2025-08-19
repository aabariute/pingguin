import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { IoMdSend } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";
import { useChat } from "../../context/chat/useChat";

export default function MessageInput({ setTotalMessages }) {
  const { sendMessage, isLoading } = useChat();
  const [text, setText] = useState<string>("");
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const reader = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = (err) => reject(err);
      fr.readAsDataURL(file);
    });

  const handleAddImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);

    try {
      const results = await Promise.all(filesArray.map(reader));
      setImagesPreview((prev) => [...prev, ...results]);
    } catch (err) {
      console.error("Failed to read one or more files: ", err);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (imgIndex: number) => {
    setImagesPreview((prev) => prev.filter((_, i) => i !== imgIndex));
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() && imagesPreview.length === 0) return;

    const message = await sendMessage({
      messageText: text.trim(),
      images: imagesPreview,
    });

    setTotalMessages((prev) => [...prev, message]);

    setText("");
    setImagesPreview([]);
  };

  return (
    <form className="flex items-end gap-2 p-2" onSubmit={handleSendMessage}>
      {/* Add images button */}
      {imagesPreview.length === 0 && (
        <>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleAddImage}
            className="hidden"
          />
          <button
            type="button"
            className="flex btn btn-circle text-success"
            onClick={() => fileInputRef.current?.click()}
          >
            <RiImageAddFill className="size-5" />
          </button>
        </>
      )}

      <div
        className={`relative flex-1 bg-base-200 ${
          imagesPreview.length > 0 ? "rounded-xl" : "rounded-full"
        }`}
      >
        {/* If user sends images */}
        {imagesPreview.length > 0 && (
          <div className="flex items-center gap-2 px-3 pt-2 flex-wrap">
            {/* Add more images button */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleAddImage}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-base-300 hover:bg-base-200 p-3 rounded-lg cursor-pointer"
            >
              <RiImageAddFill className="size-8" />
            </button>

            {/* List of images preview */}
            {imagesPreview.map((img, i) => (
              <ul key={i}>
                <li className="relative">
                  <img
                    src={img}
                    alt="Image preview"
                    className="w-14 h-14 object-cover rounded-md border border-neutral"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 btn btn-circle btn-soft"
                  >
                    <IoCloseOutline className="size-3" />
                  </button>
                </li>
              </ul>
            ))}
          </div>
        )}

        {/* Message text input */}
        <input
          type="text"
          autoFocus
          autoCorrect="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-base-200 px-3 py-2 w-full rounded-full outline-none focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading.sendMessage}
        className="btn btn-circle btn-primary text-base-200 hover:scale-105"
      >
        <IoMdSend className="size-5.5" />
      </button>
    </form>
  );
}

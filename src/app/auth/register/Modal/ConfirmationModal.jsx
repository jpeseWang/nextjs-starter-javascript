import React, { useState, useRef } from "react";
import Modal from "react-modal";
import styles from "./modal.module.css";

export default function ConfirmationModal({
  isOpen,
  onClose,
  code,
  email,
  submitButtonRef,
}) {
  const confirmCode = String(code);
  const [inputCapcha, setInput] = useState("");
  const [isError, setIsError] = useState(false);

  const checkCapcha = () => {
    console.log(confirmCode, " vs ", inputCapcha);
    if (inputCapcha === confirmCode) {
      console.log("Registration successfully");
      submitButtonRef.current?.click();
      onClose();
    } else {
      setIsError(true);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="custom-overlay custom-modal"
    >
      <div className={styles["confirm-box"]}>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-2xl font-semibold leading-6 text-gray-900"
          >
            Enter the Verification Code
          </label>
          <p className="my-1 text-sm font-semibold text-gray-700 mt-4">
            Verification Code sent to your email address:{" "}
            <span className="italic text-gray-500">{email}</span>
            <br></br>
          </p>
          <div className="relative mt-4">
            <input
              type="text"
              className="peer block w-full border-0 bg-gray-100 px-1.5 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Enter your capcha..."
              onChange={(e) => {
                setIsError(false);
                setInput(e.target.value);
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
              aria-hidden="true"
            />
          </div>
          {isError && (
            <p className="font-medium text-red-500 mt-2">
              The captcha code is incorrect, please try another one!
            </p>
          )}
        </div>
        <div className="justify-end">
          {" "}
          <button
            className="mx-4 rounded-sm bg-transparent px-4 py-1.5 font-semibold text-gray-700 ring-1 ring-gray-200 hover:border-transparent hover:bg-slate-500 hover:text-white"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="rounded-sm bg-blue-500 px-4 py-1.5 font-bold text-white hover:bg-blue-700"
            onClick={() => {
              checkCapcha();
            }}
          >
            Verify
          </button>
        </div>
      </div>
    </Modal>
  );
}

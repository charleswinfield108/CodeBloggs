import React, { createContext, useState } from "react";

export const PostModalContext = createContext();

export const PostModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <PostModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </PostModalContext.Provider>
  );
};

export const usePostModal = () => {
  const context = React.useContext(PostModalContext);
  if (!context) {
    throw new Error("usePostModal must be used within PostModalProvider");
  }
  return context;
};

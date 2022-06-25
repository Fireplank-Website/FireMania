import create from 'zustand';

export const postIdState = create(set => ({
    postId: "",
    setPostId: (postId: string) => set({ postId })
}));

export const modalState = create(set => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
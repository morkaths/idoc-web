"use client";

import React, { useState } from 'react';
import { BookResponse } from '@/types';
import { BookmarkDialog } from './bookmark-dialog';

type BookmarkContextType = {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentBook: BookResponse | null;
    setCurrentBook: React.Dispatch<React.SetStateAction<BookResponse | null>>;
};

const BookmarkContext = React.createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState<boolean>(false);
    const [currentBook, setCurrentBook] = useState<BookResponse | null>(null);

    return (
        <BookmarkContext.Provider value={{ open, setOpen, currentBook, setCurrentBook }}>
            {children}
            <BookmarkDialog
                open={open}
                onOpenChange={setOpen}
                bookId={currentBook?.id}
            />
        </BookmarkContext.Provider>
    );
}

export const useBookmarkContext = () => {
    const ctx = React.useContext(BookmarkContext);

    if (!ctx) {
        throw new Error('useBookmarkContext has to be used within <BookmarkProvider>');
    }

    return ctx;
};

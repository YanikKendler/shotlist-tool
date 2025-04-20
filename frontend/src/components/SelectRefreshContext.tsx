"use client";

import React, { createContext, useContext, useState } from 'react';

type RefreshMap = { [definitionId: string]: number };

const SelectRefreshContext = createContext<{
    refreshMap: RefreshMap;
    triggerRefresh: (definitionId: string) => void;
}>({
    refreshMap: {},
    triggerRefresh: () => {},
});

export default function SelectRefreshProvider({ children }: { children: React.ReactNode }) {
    const [refreshMap, setRefreshMap] = useState<RefreshMap>({});

    const triggerRefresh = (definitionId: string) => {
        setRefreshMap((prev) => ({
            ...prev,
            [definitionId]: Date.now(),
        }));
    };

    return (
        <SelectRefreshContext.Provider value={{ refreshMap, triggerRefresh }}>
    {children}
    </SelectRefreshContext.Provider>
);
};

export const useSelectRefresh = () => useContext(SelectRefreshContext);
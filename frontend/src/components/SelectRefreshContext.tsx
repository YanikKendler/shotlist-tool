"use client";

import React, { createContext, useContext, useState } from 'react';

type RefreshType = 'scene' | 'shot';
type RefreshMap = { [key: string]: number };

const SelectRefreshContext = createContext<{
    refreshMap: RefreshMap;
    triggerRefresh: (type: RefreshType, definitionId: string | number) => void;
}>({
    refreshMap: {},
    triggerRefresh: () => {},
});

export default function SelectRefreshProvider({ children }: { children: React.ReactNode }) {
    const [refreshMap, setRefreshMap] = useState<RefreshMap>({});

    const triggerRefresh = (type: RefreshType, definitionId: string | number) => {
        const key = `${type}-${definitionId}`;
        setRefreshMap((prev) => ({
            ...prev,
            [key]: Date.now(),
        }));
    };

    return (
        <SelectRefreshContext.Provider value={{ refreshMap, triggerRefresh }}>
            {children}
        </SelectRefreshContext.Provider>
    );
}

export const useSelectRefresh = () => useContext(SelectRefreshContext);

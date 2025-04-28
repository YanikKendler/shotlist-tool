'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import "./confirmDialog.scss"

export interface ConfirmDialogSettings {
    title?: string;
    message: string;
    buttons?: {
        cancel?: ConfirmDialogButtonSettings,
        confirm?: ConfirmDialogButtonSettings;
    }
}

export interface ConfirmDialogButtonSettings {
    text?: string;
    className?: string;
}

export function useConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [promiseResolver, setPromiseResolver] = useState<(value: boolean) => void>();
    const [settings, setSettings] = useState<ConfirmDialogSettings>({} as ConfirmDialogSettings);

    function confirm(settings: ConfirmDialogSettings): Promise<boolean> {
        setSettings(settings)
        setIsOpen(true);
        return new Promise((resolve) => {
            setPromiseResolver(() => resolve);
        });
    }

    function handleConfirm() {
        setIsOpen(false);
        promiseResolver?.(true);
    }

    function handleCancel() {
        setIsOpen(false);
        promiseResolver?.(false);
    }

    const ConfirmDialog = (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"confirmDialogOverlay dialogOverlay"}/>
                <Dialog.Content aria-describedby={"confirm action dialog"} className={"confirmDialogContent dialogContent"}>
                    <Dialog.Title className={"title"}>{settings?.title || "Are you sure?"}</Dialog.Title>
                    <p className={"description"}>{settings.message}</p>
                    <div className={"buttons"}>
                        <button className={settings?.buttons?.cancel?.className || ""} onClick={handleCancel}>
                            {settings?.buttons?.cancel?.text || "cancel"}
                        </button>
                        <button className={settings?.buttons?.confirm?.className || ""} onClick={handleConfirm}>
                            {settings?.buttons?.confirm?.text || "confirm"}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    return {confirm, ConfirmDialog};
}


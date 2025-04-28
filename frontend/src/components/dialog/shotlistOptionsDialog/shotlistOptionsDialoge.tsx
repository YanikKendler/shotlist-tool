'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import "./shotlistOptionsDialog.scss"
import {VisuallyHidden} from "radix-ui"
import {X} from "lucide-react"
import {set} from "immutable"

export default function useShotlistOptionsDialog() {
    const [isOpen, setIsOpen] = useState(false);

    function openShotlistOptionsDialog() {
        setIsOpen(true);
    }

    const ShotlistOptionsDialog = (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"shotlistOptionsDialogOverlay dialogOverlay"}/>
                <Dialog.Content aria-describedby={"confirm action dialog"} className={"shotlistOptionsDialogContent dialogContent"}>
                    <VisuallyHidden.Root>
                        <Dialog.Title className={"title"}>Shotlist Options</Dialog.Title>
                        <Dialog.Description className={"description"}>Edit attributes and collaborators or export a shotlist.</Dialog.Description>
                    </VisuallyHidden.Root>

                    <div className="content">
                        <button className={"closeButton"} onClick={() => setIsOpen(false)}>
                            <X/>
                        </button>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    return {openShotlistOptionsDialog, ShotlistOptionsDialog};
}


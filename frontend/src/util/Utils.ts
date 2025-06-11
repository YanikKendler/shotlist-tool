import {wuText} from "@yanikkendler/web-utils/dist"
import {ThemeConfig} from "react-select"
import {ShotlistOrTemplate} from "@/util/Types"

export interface fontSizeBreakpoint {
    length: number
    fontSize: number
}

export default class Utils {
    static orderShotlistsOrTemplatesByName(a: ShotlistOrTemplate, b: ShotlistOrTemplate) {
        if(!a.name) return 1
        if(!b.name) return -1

        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }

    static oderShotlistsOrTemplatesByChangeDate(a: ShotlistOrTemplate, b: ShotlistOrTemplate) {
        if(!a.editedAt) return -1
        if(!b.editedAt) return 1

        if (a.editedAt < b.editedAt) {
            return 1;
        }
        if (a.editedAt > b.editedAt) {
            return -1;
        }
        return 0;
    }

    static numberToShotLetter(number: number){
        let result = wuText.numberToLetter(number)
        for (let i = 0; i < Math.floor(number / 26); i++) {
            result += wuText.numberToLetter(number)
        }
        return result;
    }

    static clampFontSizeByTextLength(text: string, bottom: fontSizeBreakpoint, top: fontSizeBreakpoint){
        if(text.length <= bottom.length) {
            return bottom.fontSize
        } else if(text.length >= top.length) {
            return top.fontSize
        } else {
            const ratio = (text.length - bottom.length) / (top.length - bottom.length)
            return bottom.fontSize + (top.fontSize - bottom.fontSize) * ratio
        }
    }
}

export const reactSelectTheme: ThemeConfig = (theme) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary: 'var(--accent)',
        primary25: 'var(--accent-90)',
        primary50: 'var(--accent-80)',
        primary75: 'var(--accent-60',
    },
})
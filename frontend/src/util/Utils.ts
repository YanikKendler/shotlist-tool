import {ShotlistDto, TemplateDto} from "../../lib/graphql/generated"
import {wuText} from "@yanikkendler/web-utils/dist"
import {ThemeConfig} from "react-select"
import {ShotlistOrTemplate} from "@/util/Types"

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

    static numberToShotLetter = (number: number) => {
        let result = wuText.numberToLetter(number)
        for (let i = 0; i < Math.floor(number / 26); i++) {
            result += wuText.numberToLetter(number)
        }
        return result;
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
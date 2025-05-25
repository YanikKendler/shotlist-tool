import {ShotlistDto} from "../../lib/graphql/generated"
import {wuText} from "@yanikkendler/web-utils/dist"

export default class Utils {
    static orderShotlistsByName(a: ShotlistDto, b: ShotlistDto) {
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

    static oderShotlistsByChangeDate(a: ShotlistDto, b: ShotlistDto) {
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
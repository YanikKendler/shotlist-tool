import {ShotlistDto} from "../../lib/graphql/generated"

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
}
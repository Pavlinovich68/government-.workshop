import bcrypt from "bcryptjs";
export default class CryptJS {
    static async compare(x, y) {
        return await bcrypt.compare(x, y);
    }
}
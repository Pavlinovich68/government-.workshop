import bcrypt from "bcryptjs"


class crypto {
    hashSync = async (value) => {
        return await bcrypt.hashSync(value, 8);
    }
}
export default new crypto();
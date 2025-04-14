import bcrypt from "bcrypt";

const hashPassword = async (plainPassword: string): Promise<string> => {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(plainPassword, saltRounds);
    return hashed;
}

export default hashPassword;
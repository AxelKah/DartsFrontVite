import { User } from "./User";


export default interface RegisterMessageResponse {
    register: {
        message: string;
        user: User;
    };
    }
export interface AuthRegisterModel {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    image: File | null;
    phone: string;
    password: string;
}
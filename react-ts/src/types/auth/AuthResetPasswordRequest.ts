export interface AuthResetPasswordRequest {
    uid: string;
    token: string;
    new_password: string;
}
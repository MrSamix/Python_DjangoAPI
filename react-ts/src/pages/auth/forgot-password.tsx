import React, { useState } from "react";
import { useForgotPasswordMutation } from "../../services/apiAuth";
import { Button, message } from "antd";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword({ email });
            message.success("Інструкції для відновлення паролю надіслані на вашу електронну пошту.");
        } catch (error) {
            console.error("Error sending forgot password request", error);
            message.error("Не вдалося надіслати інструкції для відновлення паролю. Спробуйте ще раз.");
        }
    };

    return (
        <div className="forgot-password-container">
            <h1>Відновлення паролю</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button htmlType="submit" loading={isLoading}>
                    {isLoading ? "Відправка..." : "Відновити пароль"}
                </Button>
            </form>
        </div>
    );
};

export default ForgotPassword;
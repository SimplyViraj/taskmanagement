import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        const data =
            await authService.login(email, password);

        res.json({

            success: true,

            access_token: data.session?.access_token,

            user: data.user

        });

    } catch (error: any) {

        res.status(401).json({

            success: false,

            message: error.message

        });

    }

};
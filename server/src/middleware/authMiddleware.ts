import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserM, { IUser } from "../models/authModel";

export interface CustomRequest extends Request {
    user: any;
}

export const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader: string | undefined = req.headers.authorization;
    const token: string | null = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
        res.status(403).json({
            error: "Not Authorized"
        });
        return;
    }

    try {
        const jwtSecret: string = `${process.env.JWT_SECRET}`;
        const { id } = jwt.verify(token, jwtSecret) as JwtPayload;
        req.user = await UserM.findById(id);
        next();
    } catch (error) {
        res.status(403).json({
            error: "Not Authorized"
        });
    }
}
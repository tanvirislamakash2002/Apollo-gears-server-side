import { JwtPayload } from "jsonwebtoken";

declare namespace Express {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}
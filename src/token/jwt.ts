import { sign, verify, Secret, JwtPayload } from "jsonwebtoken";
import { UserInfo } from "@types";
import "dotenv/config";


const jwtToken = {
    
    mintAccessToken: (payload: UserInfo) => {
        return sign(
            payload, process.env.ACCESS_SALT as Secret, 
            { expiresIn: '1h' }
        );
    },
      
    mintRefreshToken: (payload: UserInfo) => {
        return sign(
            payload, process.env.REFRESH_SALT as Secret, 
            { expiresIn: '7d' }
        );
    },
    
    checkAccToken: (auth: string) => {

        const token = auth.split(' ')[1];
        try {
            return <JwtPayload> verify(token, 
                process.env.ACCESS_SALT as Secret
            );
        } catch (e) {
            return null;
        }
    },

    checkRefToken: (refreshToken: string) => {
        
        try {
            return <JwtPayload> verify(refreshToken, 
                process.env.REFRESH_SALT as Secret
            );
        } catch (e) {
            return null;
        }
    },  
}

export default jwtToken;
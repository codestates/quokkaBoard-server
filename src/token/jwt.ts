import { sign, verify, Secret, JwtPayload } from "jsonwebtoken";
import "dotenv/config";


const jwtToken = {
    
    mintAccessToken: (id: string) => {
        return sign(
            {id}, 
            process.env.ACCESS_SALT as Secret, 
            { expiresIn: '1h' }
        );
    },
      
    mintRefreshToken: (id: string) => {
        return sign(
            {id}, 
            process.env.REFRESH_SALT as Secret, 
            { expiresIn: '2d' }
        );
    },
    
    checkAccToken: (token: string) => {
        try {
            return <JwtPayload> verify(token, 
                process.env.ACCESS_SALT as Secret
            );
        } catch (e) {
            return null;
        }
    },

    checkExpToken: (token: string) => {
        return <JwtPayload> verify(token, 
            process.env.ACCESS_SALT as Secret,
            { ignoreExpiration: true }
        );
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
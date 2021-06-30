import { sign, verify, Secret } from "jsonwebtoken";
import "dotenv/config";

interface UserInfo {
    id: string;
    email: string;
}

const jwtToken = {
    
    mintAccessToken: (payload: UserInfo) => {    

        return sign(
            payload, 
            process.env.ACCESS_SALT as Secret, 
            { expiresIn: '1h' }
        );

    },
      
    mintRefreshToken: (payload: UserInfo) => {
        
        return sign(
            payload, 
            process.env.REFRESH_SALT as Secret, 
            { expiresIn: '7d' }
        );

    },
      
    checkAuthority: (auth: string | null) => {
        
        if (auth === null) return null;
        const token = auth.split(' ')[1];
        try {
            return verify(token, process.env.ACCESS_SALT as Secret)
        } catch (err) {
            console.error(err.message);
            return 'Invalid user';
        }
    },
    
    certifyToken: (refreshToken: string | null) => {
        
        if (refreshToken === null) return null;
        try {
            return verify(refreshToken, process.env.REFRESH_SALT as Secret)
        } catch (err) {
            console.error(err.message);
            return 'Invalid token';
        }
    }
}

export default jwtToken;
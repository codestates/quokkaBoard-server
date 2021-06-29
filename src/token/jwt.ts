import { sign, verify, Secret } from "jsonwebtoken";
import "dotenv/config";

const jwtToken = {
    
    mintAccessToken: (data: {id: string, email: string}) => {    
        
        return sign(
            data, process.env.ACCESS_SALT as Secret, 
            { algorithm: 'HS256', expiresIn: '1h' }
        );
    },
      
    mintRefreshToken: (data: {id: string, email: string}) => {
        
        return sign(
            data, process.env.REFRESH_SALT as Secret, 
            { algorithm: 'HS256', expiresIn: '7d' }
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
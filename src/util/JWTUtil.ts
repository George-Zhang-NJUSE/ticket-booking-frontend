import * as jwtDecode from 'jwt-decode';

/**
 * 从Json Web Token中解析出数据主体
 * @param bearerToken Json Web Token的响应头的Authorization部分，以'Bearer '开头
 */
export function getJWTPayload(bearerToken: string): any {
    const encodedJWT = bearerToken.split(' ')[1];
    return jwtDecode(encodedJWT);
}
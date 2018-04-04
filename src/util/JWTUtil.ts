import { Base64 } from 'js-base64';

/**
 * 从Json Web Token中解析出数据主体
 * @param bearerToken Json Web Token的响应头的Authorization部分，以'Bearer '开头
 */
export function getJWTPayload(bearerToken: string) {
    const encodedJWT = bearerToken.split(' ')[1];
    const jwt = Base64.decode(encodedJWT);
    const match = jwt.match(/^\{.*\}(\{.*\})/);
    if (match) {
        const payload = JSON.parse(match[1]);
        return payload;
    }
}
import axios from "axios";
import qs from "querystring";
import AppError from "../../application/error/AppError";
import { AppErrorCodes } from "../../application/error/app-error-codes";
import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

export interface GoogleAuthCredentials {
  email: string;
  firstName: string;
  lastName: string;
  googleId:string;
}

export async function getGoogleAuthCredentials(
  code: string,
): Promise<GoogleAuthCredentials> {
  
  const tokenResponse = await axios.post(
    GOOGLE_TOKEN_URL,
    qs.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const accessToken = tokenResponse.data.access_token;
  if (!accessToken) {
    throw new AppError(ERROR_MESSAGES.INVALID_GOOGLE_CODE,AppErrorCodes.INVALID_CREDENTIALS);
  }

  const credentials = await axios.get(GOOGLE_USER_INFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { sub,email, name } = credentials.data;
  if (!sub || !email || !name) {

    throw new AppError(ERROR_MESSAGES.INVALID_DATA_FROM_GOOGLE,AppErrorCodes.INVALID_CREDENTIALS);
  }

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ") || "";

  return { googleId:sub,email, firstName, lastName };
}

import { IOtpRepository, Otp, TempAccount } from "../../../domain/interfaces/IOtpRepository";
import redisClient from "../../config/redisClient";

export default class RedisOtpRepository implements IOtpRepository {
  private redis = redisClient;

  async storeTempAccount(key: string, data: TempAccount, ttlSeconds: number = 600): Promise<void> {
    await this.redis.set(key, JSON.stringify(data), { EX: ttlSeconds });
  }
  async storeOtp(key: string, data: Otp, ttlSeconds: number = 600): Promise<void> {
    await this.redis.set(key, JSON.stringify(data), { EX: ttlSeconds });
  }

  async verifyTempAccount(key: string, otp: string): Promise<TempAccount | null> {
    const stored = await this.redis.get(key);
    if (!stored) return null;
    const data: TempAccount = JSON.parse(stored);
    return data.otp === otp?data:null;
  }
  async verifyOtp(key: string, otp: string): Promise<Otp | null> {
    const stored = await this.redis.get(key);
    if (!stored) return null;
    const data: Otp = JSON.parse(stored);
    return data.otp === otp?data:null;
  }

  async getTempAccount(key: string): Promise<TempAccount | null> {
    const stored = await this.redis.get(key);
    if (!stored) return null;

    return JSON.parse(stored);
  }

  async getOtp(key: string): Promise<Otp | null> {
    const stored = await this.redis.get(key);
    if (!stored) return null;

    return JSON.parse(stored);
  }

  async deleteTempAccount(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async deleteOtp(key: string): Promise<void> {
    await this.redis.del(key);
  }
}

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = Redis.fromEnv();

// per IP address
export const otpRequestLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "60 s"),
  analytics: true,
  prefix: "runlayer:otp",
});

// get client IP to use in the rate limit
export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "anonymous";
}

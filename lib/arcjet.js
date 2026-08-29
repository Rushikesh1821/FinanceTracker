import arcjet, { tokenBucket } from "@arcjet/next";

const aj = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      characteristics: ["userId"], // Track based on Clerk userId
      rules: [
        // Rate limiting specifically for collection creation
        tokenBucket({
          mode: "LIVE",
          refillRate: 10, // 10 collections
          interval: 3600, // per hour
          capacity: 10, // maximum burst capacity
        }),
      ],
    })
  : null;

export default aj;

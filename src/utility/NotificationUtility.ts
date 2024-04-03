export const GenerateOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const RequestOtp = async (otp: number, toPhoneNumber: string) => {
  const accountSid = "ACc86361437c7c293938fd7b7e351b5529";
  const authToken = "28683a862080d40ba7b95ff031c0d552";
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your account verification code is ${otp}`,
    from: "+12512929695",
    to: `+95${toPhoneNumber}`,
  });

  return response;
};

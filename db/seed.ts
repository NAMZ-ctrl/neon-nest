import { prisma } from "./db";
import { hashSync } from "bcrypt-ts";

const data = [
  {
    email: "adewoyenifemi8@gmail.com",
    password: hashSync("1234", 10),
  },
];
async function seedData() {
  for (const each of data) {
    await prisma.user.createMany({
      data: {
        email: each.email,
        password: each.password,
      },
    });
  }
}
seedData();
console.log("seeding successfull");

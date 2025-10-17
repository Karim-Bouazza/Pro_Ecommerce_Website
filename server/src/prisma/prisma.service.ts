import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit() {
        this.$connect()
          .then(() => console.log("Connected To DB"))
          .catch((err) => console.log("Error Connected To Db"))
    }
}
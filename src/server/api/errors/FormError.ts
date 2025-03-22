import { TRPCError } from "@trpc/server";
import { ZodError } from "zod";

export class FormError extends TRPCError {
  constructor(
    public readonly messageKey: string,
    public readonly fieldPath: string[],
  ) {
    super({
      code: "BAD_REQUEST",
      cause: new ZodError([
        {
          code: "custom",
          message: messageKey,
          path: fieldPath,
        },
      ]),
    });
  }
}

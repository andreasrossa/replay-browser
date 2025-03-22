import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  venue: ["create", "read", "update", "delete"],
} as const;

export const accessControl = createAccessControl(statement);

export const userRole = accessControl.newRole({
  venue: ["read"],
});

export const adminRole = accessControl.newRole({
  venue: ["create", "read", "update", "delete"],
  ...adminAc.statements,
});

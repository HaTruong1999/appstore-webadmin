export class RolesDto {
    constructor() {
    }
    roleId: string;
    roleCode: string | null;
    roleName: string | null;
    roleOrder: number | null;
    roleStatus: number | null;
    roleCreateddate: Date | null;
    roleCreatedby: string | null;
    rolesMenus: RolesMenuDto[] | null
  }

export class RolesMenuDto {
  menuId: string;
}
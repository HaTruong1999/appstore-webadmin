export class UsersDto {
    constructor() {
    }
    userId: string;
    userCode: string | null;
    userPassword: string | null;
    userFullname: string | null;
    userPhoneNumber: string | null;
    userBirthday: Date | null;
    userGender: string | null;
    userAddress: string | null;
    userEmail: string | null;
    userAvatar: string | null;
    userActive: number | null;
    userCreateddate: Date | null;
    userCreatedby: string | null;
    userUpdateddate: Date | null;
    userUpdatedby: string | null;
    userAvatarBase64: string | null;
    userAvatarChange: boolean | null;
  }

export class UsersWorkplaceDto {
    udId: string | null;
    ubwType: number;
    posId: string | null;
    wpId: string | null;
    trId: string | null;
    custId: string | null;
}

export class UsersImportDto {
  userCode: string | null;
  custId: string | null;
  userFirstname: string | null;
  userLastname: string | null;
  userMiddlename: string | null;
  userPhonenumber: string | null;
  userBirthday: Date | null;
  userGender: string | null;
  userAddress: string | null;
  userEmail: string | null;
  userAllowsendsms: string | null;
  userAllowsendemail: string | null;
  userActive: number | null;
}

export class AvatarDto {
  avatarID: string;
  avatarSrc: string;
}

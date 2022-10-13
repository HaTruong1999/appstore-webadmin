
export class AccountsDto {
  accId: string;
  accName: string | null;
  accPassword: string | null;
  accFullname: string | null;
  accBirthday: Date | null;
  accGender: string | null;
  accStatus: number | null;
  accAddress: string | null;
  accEmail: string | null;
  accPhonenumber: string | null;
  accAvatar: string | null;
  accIsactive: Date | null;
  roleId: string | null;
  accChangePassword: boolean | false;
  accAvatarBase64: string | null;
  accAvatarChange: boolean | null;
}

export class AvatarDto {
  avatarID: string;
  avatarSrc: string;
}

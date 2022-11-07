export class AppsDto {
    constructor() {
    }
    appId: string;
    appCode: string | null;
    appName: string | null;
    appAvatar: string | null;
    appDescription: string | null;
    appVersion: string | null;
    appStatus: number | null;
    appCreateddate: Date | null;
    appCreatedby: string | null;
    appUpdateddate: Date | null;
    appUpdatedby: string | null;
    radioAndroid: string | null;
    appFileAndroid: string | null;
    appLinkAndroid: string | null;
    radioIOS: string | null;
    appLinkIOS: string | null;
    appFileIOS: string | null;
  }

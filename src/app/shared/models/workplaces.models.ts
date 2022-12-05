export class WorkplacesDto {
    constructor() {
    }
    wpId: number;
    wpCode: string | null;
    wpName: string | null;
    wpParent: number | null;
    wpStatus: number | null;
    wpCreatedDate: Date | null;
    wpCreatedBy: number | null;
    wpUpdatedDate: Date | null;
    wpUpdatedBy: number | null;
}
  
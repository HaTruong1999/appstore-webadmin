export class WorkplacesDto {
    constructor() {
    }
    wpId: number;
    wpCode: string | null;
    wpName: string | null;
    wpParent: number | null;
    wpOrder: number | null;
    wpNode: false | null;
    wpStatus: number | null;
    wpCreatedDate: Date | null;
    wpCreatedBy: number | null;
    wpUpdatedDate: Date | null;
    wpUpdatedBy: number | null;
}
  
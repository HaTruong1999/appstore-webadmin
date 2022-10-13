export class ListmenuDto {
    constructor() {
    }
    menuId: string;    
    custId: string | null;    
    menuCode: string | null;
    menuName: string | null;   
    menuOrder: number | null;   
    menuParent: string | null;   
    menuStatus: number | null;    
    menuCreateddate: Date | null;   
    menuCreatedby: string | null;   
    url: string | null;    
    icon: string | null;
  }
  
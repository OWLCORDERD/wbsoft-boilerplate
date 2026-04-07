declare module "ag-grid" {
  export interface createAgGridOptionType {
    rowData: any[]; // 전체 행 데이터
    colDefs: any[]; // 컬럼 데이터
  }
}

import type { createAgGridOptionType } from "agGrid";
import { AllCommunityModule, ModuleRegistry, createGrid, type GridApi } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";

export const useAgGrid = (
  // htmlElement: HTMLDivElement,
  // createAgGridOption: createAgGridOptionType
) => {
  // // 2026.04.07 [mhlim] setting: 확장 모듈 레지스트리 전체 등록
  // ModuleRegistry.registerModules([AllCommunityModule]);

  // // 2026.04.15 [mhlim] setting: 엔터프라이즈 지원 모듈 등록 (트라이얼 라이센스 30일짜리 적용 [04.15 ~ 05.15]) 
  // ModuleRegistry.registerModules([AllEnterpriseModule]);

  // LicenseManager.setLicenseKey(process.env.AG_GRID_LICENSE_KEY || ''); // * 엔터프라이즈 라이센스 키 설정

  // let gridApi: GridApi;

  // // 2026.04.07 [mhlim] setting: 그리드 생성자 생성 및 반환
  // const grid = createGrid(htmlElement, createAgGridOption);
  // gridApi = grid;

  // return gridApi;
};

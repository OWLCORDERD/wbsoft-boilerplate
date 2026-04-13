import type { createAgGridOptionType } from "agGrid";
import { AllCommunityModule, ModuleRegistry, createGrid, type GridApi } from "ag-grid-community";

export const agGridEditorInstance = (
  htmlElement: HTMLDivElement,
  createAgGridOption: createAgGridOptionType
) => {
  // 2026.04.07 [mhlim] setting: 확장 모듈 레지스트리 전체 등록
  ModuleRegistry.registerModules([AllCommunityModule]);

  let gridApi: GridApi;

  // 2026.04.07 [mhlim] setting: 그리드 생성자 생성 및 반환
  const grid = createGrid(htmlElement, createAgGridOption);
  gridApi = grid;

  return gridApi;
};

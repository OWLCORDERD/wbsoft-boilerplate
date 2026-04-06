## wbsoft boilerPlate 프로젝트

**⚠️ 보일러 플레이트를 제작하게된 프론트 개발 시점 개선 필요성**

```
1. 초기 프로젝트 셋팅 시간 절약 필요
2. 노드 버전에 맞지 않는 구 패키지 버전 사용 지양
3. 예전 구현 방식의 레이아웃 기능 검토 및 안정화 필요
4. 매 프로젝트마다 거의 비슷한 뼈대임에도 개발 일관성 부족 → 공통 컴포넌트 버전 관리 필요
5. 신규 추가되는 주요 비즈니스 로직에 집중할 수 있도록하여 생산성 향상 필요
6. Prettier 코드 컨벤션 공통 규격 정의 및 공통 사용 필요
```

<aside>
⚠️

작년 11월 기준 한수원 프로젝트 구축 시점 노드 버전을 22.17.0까지 올린 이후 기존 소스 걸러내며 버전 관련 문제되는 사항들은 해결한 상황이며 공통 개선 사항이 많았던 프로젝트이기에 해당 프로젝트 버전 기점으로 신규 보일러 플레이트 구축 필요

</aside>

```bash
├── 📂 assets/                        # 정적 자원 (이미지, 스타일 등)
│   ├── common/
│   └── lxp/
│       ├── images/
│       ├── js/
│       └── scss/
│   └── user/
│       ├── images/
│       ├── js/
│       └── scss/

├── 📂 domain/                        # 도메인 레이어
│   ├── common/
│   └── v1/

├── 📂 features/                      # 기능 단위 모듈
│   ├── common/
│   └── [feature-name]/
│           ├── ui/
│           │   └── v1/
│           │       └── button
│           ├── components/
│           │   └── v1/
│           │       └── [Feature]Component.vue
│           ├── composables/
│           │   └── use[Feature].ts
│           ├── api/
│           │   └── [Feature]Api.ts
│           └── types/
│               └── [Feature].ts

│   └── domain/
│       ├── common/
│       └── [feature-name]/
│           └── v1/
│               ├── ui/
│               ├── components/
│               ├── composables/
│               ├── api/
│               └── types/

├── 📂 widgets/                       # 위젯 단위 UI
│   ├── common/
│   │   └── [Widget].vue
│   └── domain/
│       └── [Widget].vue

├── 📂 layouts/                       # 레이아웃
│   ├── common/
│   │   └── v1/
│   └── domain/
│       └── v1/

├── 📂 pages/                         # 라우팅 페이지

├── 📂 public/                        # 퍼블릭 정적 파일
│   ├── common/
│   └── v1/

├── 📂 core/                          # 핵심 로직
│   ├── plugins/                   # 외부 라이브러리 설정
│   ├── middleware/                # 인증 / 권한 처리
│   │   ├── common/
│   │   └── domain/
│   ├── utils/                     # 유틸 함수
│   └── stores/                    # 상태 관리

├── 📂 packages/                      # 패키지화 (모듈 단위 배포)
│   └── [feature-name]/
│       └── v1/
│           ├── components/
│           │   └── [Feature]Component.vue
│           ├── composables/
│           │   └── use[Feature].ts
│           ├── api/
│           │   └── [Feature]Api.ts
│           ├── types/
│           │   └── [Feature].ts
│           ├── styles/
│           ├── index.ts
│           └── package.json
```
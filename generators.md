
yarn nx generate @nx/angular:component --path=apps/frontend/src/app/components/menu/menu --changeDetection=OnPush --displayBlock=true --style=scss --no-interactive --dry-run

yarn nx generate @nx/angular:component --path=libs/frontend/common/src/lib/components/search-box --changeDetection=OnPush --displayBlock=true --style=scss --no-interactive --inlineStyle=true --inlineTemplate=true

yarn nx generate @schematics/angular:service --name=services/error --project=frontend --skipTests=true --no-interactive --dry-run

yarn nx generate @nx/angular:library --directory=libs/frontend/common --name=frontend-common --routing=true --displayBlock=true --flat=true --importPath=@unchaos/frontend/common --inlineStyle=true --inlineTemplate=true --simpleName=true --style=scss --unitTestRunner=vitest --no-interactive --dry-run

# 3fund

WebApp to compute investments following 3fund strategy.

## To contribute

### Install and initialize pre-commit hook

```
pip install pre-commit
pre-commit install
```

### Install Husky Hook

```
npm set-script prepare "husky install" && npm run prepare
```

Add a hook:

```
npx husky add .husky/pre-commit "npm test"
```

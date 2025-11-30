# FastAPI Dependency Usage

FastAPI dependency aliases declared via `Annotated` (for example `CURRENT_USER_MODEL_DEP`) should be applied directly in endpoint signatures instead of wrapping them again with `Depends`. Using

```python
async def handler(current_user: CURRENT_USER_MODEL_DEP):
    ...
```

ensures FastAPI executes the dependency stack once and returns the resolved value. Writing

```python
async def handler(current_user: UserModel = Depends(CURRENT_USER_MODEL_DEP)):
    ...
```

causes FastAPI to treat the alias itself as a dependency and then try to treat its result as another dependency, which can lead to validation errors (e.g., 422 Unprocessable Entity) or double work. When you need access to the raw model, reference the alias’ type annotation directly—FastAPI will still inject the resolved dependency value with the correct type.

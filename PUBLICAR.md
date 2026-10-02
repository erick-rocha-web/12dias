# Publicar no GitHub Pages

Publique **somente a pasta `site/`**. O arquivo `prompt-site-12-capitulos-outubro.md` contém a frase final e não pode ir junto.

## Pelo terminal (gh já está logado)

```bash
cd site
git init -b main
git add .
git commit -m "Capítulo 1: outubro"
gh repo create 12-capitulos --public --source=. --push
gh api -X POST repos/erick-rocha-web/12-capitulos/pages -f "source[branch]=main" -f "source[path]=/"
```

Em 1–2 minutos o link fica em: `https://erick-rocha-web.github.io/12-capitulos/`
(confira em Settings → Pages do repositório antes de enviar).

## Pelo site do GitHub

1. Crie um repositório público novo (ex.: `12-capitulos`).
2. "Add file → Upload files" e arraste o **conteúdo** da pasta `site/` (incluindo `.nojekyll`).
3. Settings → Pages → Branch `main`, pasta `/ (root)` → Save.

## Testar localmente

Os módulos JS não abrem com duplo clique (`file://`). Use:

```bash
cd site && python -m http.server 8765
```

e abra `http://localhost:8765/`. Em localhost dá para simular datas: `http://localhost:8765/?data=2026-10-05`
(isso é ignorado no site publicado).

## Próximos capítulos

Edite só `site/chapters.js`: preencha o capítulo seguindo o modelo do `01` e troque `published: false` para `true`. Não mude os `id`s — o progresso dela fica salvo por eles (chave `erick-alicia-12-capitulos-2026-v1`), e novas publicações não apagam nada.

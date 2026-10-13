import { useEffect, useState, type MouseEvent } from "react"
import { ArrowDownToLine, ArrowUpRight, BookOpen, Check, ChevronRight, Code2, FileCode2, Folder, Github, Menu, PackageOpen, Puzzle, Search } from "lucide-react"
import Markdown, { defaultUrlTransform } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { installUrl, readmeUrl, repository, sourceUrl } from "@/lib/urls.mjs"
import catalogData from "@/generated/catalog.json"

type Script = { fileName: string; path: string; name?: string; description?: string; version?: string }
type Directory = { id: string; name: string; readme: string | null; scripts: Script[] }
const catalog: Directory[] = catalogData
const scriptCount = catalog.reduce((count, directory) => count + directory.scripts.length, 0)
const getSelection = () => new URLSearchParams(window.location.search).get("script")

export default function App() {
  const [selectedId, setSelectedId] = useState(getSelection)
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const selected = catalog.find((directory) => directory.id === selectedId) ?? catalog[0]
  const filtered = catalog.filter((directory) =>
    `${directory.id} ${directory.scripts.map((script) => `${script.name ?? ""} ${script.fileName}`).join(" ")}`
      .toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  )

  useEffect(() => {
    const onPopState = () => setSelectedId(getSelection())
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    document.title = selected ? `${selected.name} · UserScripts` : "UserScripts · mohemohe"
  }, [selected])

  function selectDirectory(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const url = new URL(window.location.href)
    url.searchParams.set("script", id)
    url.hash = ""
    if (getSelection() !== id) window.history.pushState(null, "", url)
    setSelectedId(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  const navigation = (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-5 pb-6 pt-7">
        <label className="relative block">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="スクリプトを検索..." aria-label="スクリプトを検索" className="h-10 bg-background pl-9 shadow-none" />
        </label>
      </div>
      <div className="mb-3 flex items-center justify-between px-6">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground">COLLECTION</h2>
        <span className="font-mono text-xs text-muted-foreground">{catalog.length.toString().padStart(2, "0")}</span>
      </div>
      <nav aria-label="UserScript 一覧" className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3">
        {filtered.map((directory) => (
          <Button key={directory.id} asChild variant="ghost" className={cn("h-auto min-h-11 w-full justify-start gap-3 whitespace-normal px-3 py-3 text-left font-normal", selected?.id === directory.id && "bg-primary/8 text-primary hover:bg-primary/12 hover:text-primary")}>
            <a href={`?script=${encodeURIComponent(directory.id)}`} onClick={(event) => selectDirectory(event, directory.id)} aria-current={selected?.id === directory.id ? "page" : undefined}>
              <FileCode2 aria-hidden="true" />
              <span className="min-w-0 flex-1 break-words">{directory.id}</span>
              {selected?.id === directory.id && <ChevronRight aria-hidden="true" className="size-3.5" />}
            </a>
          </Button>
        ))}
        {!filtered.length && <p className="px-3 py-6 text-sm leading-6 text-muted-foreground">{catalog.length ? "一致するスクリプトがありません。" : "スクリプトはまだありません。"}</p>}
      </nav>
      <div className="m-5 mt-8 rounded-xl border bg-background/70 p-4">
        <Puzzle aria-hidden="true" className="mb-3 size-5 text-primary" />
        <h3 className="text-xs font-semibold">インストールの前に</h3>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">UserScript マネージャーを<br />ブラウザーに追加してください。</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <a className="inline-flex items-center gap-1 underline-offset-4 hover:underline" href="https://www.tampermonkey.net/" target="_blank" rel="noreferrer">Tampermonkey <ArrowUpRight aria-hidden="true" className="size-3" /></a>
          <a className="inline-flex items-center gap-1 underline-offset-4 hover:underline" href="https://violentmonkey.github.io/" target="_blank" rel="noreferrer">Violentmonkey <ArrowUpRight aria-hidden="true" className="size-3" /></a>
        </div>
      </div>
      <div className="flex items-center justify-between border-t px-6 py-4 text-[11px] text-muted-foreground"><span>Made by mohemohe</span><span className="font-mono">WTFPL</span></div>
    </div>
  )

  return (
    <div className="min-h-svh">
      <a href="#main-content" className="sr-only z-[100] rounded-md bg-primary p-3 text-primary-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3">本文へスキップ</a>
      <aside className="fixed inset-y-0 left-0 hidden w-68 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-20 shrink-0 items-center gap-3 border-b px-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Code2 aria-hidden="true" className="size-5" /></div>
          <div><span className="text-base font-semibold tracking-tight">UserScripts</span><p className="mt-0.5 text-[11px] text-muted-foreground">mohemohe / collection</p></div>
        </div>
        {navigation}
      </aside>
      <div className="md:ml-68">
        <header className="flex h-20 items-center justify-between gap-3 border-b bg-background px-5 sm:px-10">
          <div className="flex min-w-0 items-center gap-3 text-sm">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden" aria-label="サイドバーを開く"><Menu /></Button></SheetTrigger>
              <SheetContent side="left" className="flex w-80 max-w-[90vw] flex-col gap-0 bg-sidebar p-0">
                <SheetHeader className="border-b px-6 py-5 text-left"><SheetTitle>UserScripts</SheetTitle><SheetDescription>mohemohe / collection</SheetDescription></SheetHeader>
                {navigation}
              </SheetContent>
            </Sheet>
            <span className="hidden text-muted-foreground sm:inline">Collection</span>
            <ChevronRight aria-hidden="true" className="hidden size-3 text-muted-foreground sm:block" />
            <span className="truncate font-medium">{selected?.name ?? "UserScripts"}</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0 text-muted-foreground"><a href={repository} target="_blank" rel="noreferrer"><Github aria-hidden="true" />GitHub <ArrowUpRight aria-hidden="true" className="hidden sm:block" /></a></Button>
        </header>
        <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-5 pb-10 pt-10 outline-none sm:px-10 sm:pt-12">
          {selected ? <>
            <div className="mb-9">
              <div className="mb-5 flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-primary"><span className="size-1.5 rounded-full bg-primary" />BROWSER UTILITIES</div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">{selected.name}</h1>
                <Badge variant="outline" className="gap-1.5 rounded-full py-1 font-normal text-muted-foreground"><Code2 aria-hidden="true" className="size-3" />UserScript</Badge>
              </div>
              <p className="mt-4 flex items-center gap-2 break-all font-mono text-xs text-muted-foreground"><Folder aria-hidden="true" className="size-3.5 shrink-0" />{selected.id}/</p>
            </div>

            <section aria-labelledby="install-heading" className="mb-8">
              <h2 id="install-heading" className="mb-3 text-xs font-medium text-muted-foreground">インストール <span className="ml-1 font-mono">/ {selected.scripts.length.toString().padStart(2, "0")}</span></h2>
              <div className="space-y-3">
                {selected.scripts.map((script) => <Card key={script.path} className="overflow-hidden rounded-xl shadow-none">
                  <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50"><FileCode2 aria-hidden="true" className="size-5 text-muted-foreground" /></div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2"><h3 className="break-all text-sm font-semibold">{script.name || script.fileName}</h3>{script.version && <Badge variant="secondary" className="font-mono text-[10px] font-normal">v{script.version}</Badge>}</div>
                        <p className="mt-1.5 break-all font-mono text-[11px] text-muted-foreground">{script.fileName}</p>
                      </div>
                    </div>
                    <Button asChild className="shrink-0 shadow-none"><a href={installUrl(script.path, import.meta.env.BASE_URL)} aria-label={`${script.fileName} をインストール`}><ArrowDownToLine aria-hidden="true" />インストール</a></Button>
                  </CardContent>
                </Card>)}
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-5 text-muted-foreground"><Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />UserScript マネージャーを有効にして、インストールボタンを押してください。</p>
            </section>

            <Card className="overflow-hidden rounded-xl shadow-none">
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b bg-muted/25 px-5 py-4">
                <h2 className="flex items-center gap-2 text-xs font-medium"><BookOpen aria-hidden="true" className="size-4 text-muted-foreground" />README.md</h2>
                <a href={sourceUrl(selected.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">ソースを見る<ArrowUpRight aria-hidden="true" className="size-3.5" /></a>
              </CardHeader>
              <CardContent className="p-5 sm:p-8">
                {selected.readme?.trim() ? <div className="readme prose prose-neutral max-w-none break-words text-sm">
                  <Markdown remarkPlugins={[remarkGfm]} urlTransform={(url, key) => readmeUrl(defaultUrlTransform(url), selected.id, key === "src")} components={{
                    a: ({ children, ...props }) => <a {...props} target="_blank" rel="noreferrer">{children}</a>,
                    img: ({ alt, ...props }) => <img {...props} alt={alt ?? ""} loading="lazy" />,
                    table: ({ children, ...props }) => <div className="overflow-x-auto"><table {...props}>{children}</table></div>,
                  }}>{selected.readme}</Markdown>
                </div> : <div className="py-10 text-center text-sm text-muted-foreground"><BookOpen aria-hidden="true" className="mx-auto mb-3 size-6" />このディレクトリには README の説明がありません。</div>}
              </CardContent>
            </Card>
          </> : <Card className="py-14 text-center shadow-none"><CardContent><PackageOpen aria-hidden="true" className="mx-auto mb-5 size-9 text-muted-foreground" /><h1 className="text-lg font-semibold">スクリプトはまだありません</h1><p className="mt-3 text-sm text-muted-foreground">サブディレクトリに *.user.js を追加すると、ここに表示されます。</p></CardContent></Card>}
          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-[11px] text-muted-foreground"><span>小さなスクリプトで、ブラウザーを自分らしく。</span><span className="font-mono">{scriptCount} {scriptCount === 1 ? "script" : "scripts"} · open source</span></footer>
        </main>
      </div>
    </div>
  )
}

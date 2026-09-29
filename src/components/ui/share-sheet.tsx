"use client";

import * as React from 'react'
import { useEffect, useId, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import qrcode from 'qrcode-generator' // MIT, © Kazuhiko Arase

// ShareSheet: local QR generation, no API keys or external images.
// The QR encoder is qrcode-generator (MIT, Kazuhiko Arase). Pass a public URL.
// `variant`: 'default' | 'message' | 'compact'. `theme`: 'auto' | 'dark' | 'light'.
// Pass a real URL in production. The default URL is a demo placeholder.
const sampleUrl = 'https://example.com/story'
const safeUrl = (value: string) => {
  try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : '' } catch { return '' }
}
const Svg = ({ children, size = 19, ...props }: { children: ReactNode; size?: number } & React.SVGProps<SVGSVGElement>) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>
const Icon = ({ name, size = 19 }: { name: IconName; size?: number }) => {
  const paths: Record<Exclude<IconName, 'whatsapp' | 'telegram' | 'x' | 'instagram'>, ReactNode> = {
    share: <><path d="M12 16V3m0 0L8 7m4-4 4 4"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></>,
    link: <><path d="m10 13 4-4"/><path d="M8.5 16.3 6.6 18A3.2 3.2 0 0 1 2 13.4l4.4-4.5A3.2 3.2 0 0 1 11 9"/><path d="M15.5 7.7 17.4 6A3.2 3.2 0 0 1 22 10.6l-4.4 4.5A3.2 3.2 0 0 1 13 15"/></>,
    close: <path d="M6 6l12 12M18 6 6 18"/>,
    more: <><circle cx="5" cy="12" r=".7" fill="currentColor"/><circle cx="12" cy="12" r=".7" fill="currentColor"/><circle cx="19" cy="12" r=".7" fill="currentColor"/></>,
    check: <path d="m5 12 4.5 4.5L19 7"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    message: <path d="M20 11.4A8 8 0 0 1 7.2 17.8L3 19l1.3-4.2A8 8 0 1 1 20 11.4Z"/>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3"/></>,
    browser: <><circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4 4-2Z"/></>,
    qr: <><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h2m3 0h2m-7 3h4m3 0v4m-7 0h4"/><path d="M5.5 5.5h2M16.5 5.5h2M5.5 16.5h2"/></>,
    back: <path d="m14 5-7 7 7 7"/>,
    arrow: <path d="m9 5 7 7-7 7"/>,
  }
  return <Svg size={size}>{paths[name as keyof typeof paths]}</Svg>
}
function Brand({ name }: { name: 'whatsapp' | 'telegram' | 'x' | 'instagram' }) {
  if (name === 'whatsapp') return <svg viewBox="0 0 32 32" width="25" height="25" fill="none" aria-hidden="true"><path d="M7.4 24.5 4 28l1.2-5A12.1 12.1 0 1 1 10 27a12 12 0 0 1-2.6-2.5Z" stroke="white" strokeWidth="2.2" strokeLinejoin="round"/><path d="M12.1 10.5c-.7-1.4-1.6-.7-2 .1-1.2 2.2 1.5 5.6 3.4 7.4 2.3 2.2 5.8 4.5 7.5 2.7 1 .1 1.6-1.2 1.5-2.3l-2.8-1.3c-.7-.3-1.2 1.2-2 1-2.1-.6-4.2-2.6-4.6-3.5-.5-.9.9-1.3.7-2l-1.1-2.5Z" fill="white"/></svg>
  if (name === 'telegram') return <svg viewBox="0 0 32 32" width="25" height="25" fill="none" aria-hidden="true"><path fill="white" d="M27.6 6.2 4.9 15.1c-1.1.5-1 1.1-.1 1.4l5.8 1.8 2.2 6.7c.3.8.6 1 1.1.4l3.4-3.4 5.6 4c1 .6 1.8.3 2-1l3.7-17c.3-1.4-.2-2-1-1.8ZM11.7 17.8 24.6 9c.5-.3 1-.2.5.3L14.5 19.5l-.5 3.2-2.3-4.9Z"/></svg>
  if (name === 'x') return <svg viewBox="0 0 32 32" width="23" height="23" fill="none" aria-hidden="true"><path d="M5.5 5.5h4.7l16.3 21h-4.8L5.5 5.5ZM26 5.5 6 26.5" stroke="white" strokeWidth="2"/></svg>
  return <svg viewBox="0 0 32 32" width="25" height="25" fill="none" aria-hidden="true"><rect x="5" y="5" width="22" height="22" rx="7" stroke="white" strokeWidth="2.2"/><circle cx="16" cy="16" r="5.1" stroke="white" strokeWidth="2.2"/><circle cx="23" cy="9.2" r="1.4" fill="white"/></svg>
}
type IconName = 'share' | 'link' | 'close' | 'more' | 'check' | 'mail' | 'message' | 'download' | 'browser' | 'qr' | 'back' | 'arrow' | 'whatsapp' | 'telegram' | 'x' | 'instagram'
const channels: [IconName, string][] = [ ['link', 'Copy Link'], ['whatsapp', 'WhatsApp'], ['telegram', 'Telegram'], ['x', 'X'], ['instagram', 'Instagram'], ['more', 'More'] ]
const sheetTransition = { type: 'spring' as const, stiffness: 410, damping: 34 }

function QrArt({ url, size = 170, onReady }: { url: string; size?: number; onReady?: (svg: string) => void }) {
  const svg = useMemo(() => {
    try {
      if (!url) return ''
      const qr = qrcode(0, 'M')
      qr.addData(url)
      qr.make()
      const cells = qr.getModuleCount(), margin = 4, n = cells + margin * 2
      let rects = ''
      for (let y = 0; y < cells; y++) for (let x = 0; x < cells; x++) if (qr.isDark(y, x)) rects += `<rect x="${x + margin}" y="${y + margin}" width="1" height="1"/>`
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${n * 10}" height="${n * 10}" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><path fill="#fff" d="M0 0h${n}v${n}H0z"/><g fill="#111116">${rects}</g></svg>`
    } catch { return '' }
  }, [url])
  useEffect(() => onReady?.(svg), [svg, onReady])
  // A data-URL QR image cannot be optimized by Next Image.
  // eslint-disable-next-line @next/next/no-img-element
  return svg ? <img width={size} height={size} alt="Scannable QR code for the shared link" style={{ display: 'block', borderRadius: 7 }} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} /> : <p role="alert" style={{ fontSize: 12, lineHeight: 1.5 }}>This link is too long for a QR code.</p>
}

export interface ShareSheetProps { url?: string; title?: string; variant?: 'default' | 'message' | 'compact'; theme?: 'auto' | 'dark' | 'light'; initialOpen?: boolean; onShare?: (event: { channel: string; url: string; message: string }) => void }
export function ShareSheet({ url = sampleUrl, title = 'Share this page', variant = 'default', theme = 'auto', initialOpen = false, onShare }: ShareSheetProps) {
  const [open, setOpen] = useState(initialOpen)
  const [view, setView] = useState<'share' | 'more' | 'qr' | 'copied'>('share')
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState('')
  const [qrSvg, setQrSvg] = useState('')
  const returnFocus = useRef<HTMLButtonElement | null>(null)
  const dialog = useRef<HTMLDivElement | null>(null)
  const titleId = useId()
  const reduced = useReducedMotion()
  const link = safeUrl(url)
  const canShare = Boolean(link)
  const [siteLight, setSiteLight] = useState(false)
  useEffect(() => { const sync = () => setSiteLight(!document.documentElement.classList.contains('dark') && !document.body.classList.contains('dark')); sync(); const mo = new MutationObserver(sync); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); mo.observe(document.body, { attributes: true, attributeFilter: ['class'] }); return () => mo.disconnect() }, [])
  const resolvedTheme = theme === 'auto' ? (siteLight ? 'light' : 'dark') : theme
  const isCompact = variant === 'compact'
  const isMessage = variant === 'message'
  const notify = (channel: string) => onShare?.({ channel, url: link, message: message.trim() })
  const close = () => { setOpen(false); setView('share'); setFeedback(''); setTimeout(() => returnFocus.current?.focus(), 50) }
  const openDialog = (e: MouseEvent<HTMLButtonElement>) => { returnFocus.current = e.currentTarget; setOpen(true); setView('share'); setFeedback('') }
  useEffect(() => {
    if (!open) return
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return }
      if (e.key !== 'Tab') return
      const nodes = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),a[href]')
      if (!nodes?.length) return
      const first = nodes[0], last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', key)
    const timer = setTimeout(() => dialog.current?.querySelector<HTMLButtonElement>('button')?.focus(), 30)
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', key); clearTimeout(timer) }
  }, [open])
  const copy = async () => {
    if (!canShare) return
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link)
      else {
        const el = document.createElement('textarea'); el.value = link; el.style.position = 'fixed'; el.style.opacity = '0'; document.body.append(el); el.select()
        const ok = document.execCommand('copy'); el.remove(); if (!ok) throw Error('Clipboard unavailable')
      }
      notify('copy'); setView('copied')
    } catch { setFeedback('Could not copy. Check browser clipboard permission.'); setView('share') }
  }
  const launch = (channel: string) => {
    if (!canShare) return
    const text = message.trim() || title
    const q = encodeURIComponent
    const targets = {
      whatsapp: `https://api.whatsapp.com/send?text=${q(`${text} ${link}`)}`,
      telegram: `https://t.me/share/url?url=${q(link)}&text=${q(text)}`,
      x: `https://twitter.com/intent/tweet?url=${q(link)}&text=${q(text)}`,
      mail: `mailto:?subject=${q(title)}&body=${q(`${message.trim() ? `${message.trim()}\n\n` : ''}${link}`)}`,
      sms: `sms:?body=${q(`${message.trim() ? `${message.trim()} ` : ''}${link}`)}`,
    }
    if (channel === 'instagram') {
      if (navigator.share) { navigator.share({ title, text: message.trim() || undefined, url: link }).then(() => notify('instagram')).catch(() => setFeedback('Share canceled or unavailable.')) }
      else { copy().then(() => { if (navigator.clipboard) setFeedback('Link copied. Paste it in Instagram.') }) }
      return
    }
    const target = targets[channel as keyof typeof targets]
    if (!target) return
    if (channel === 'mail' || channel === 'sms') window.location.assign(target)
    else { const win = window.open('', '_blank'); if (!win) { setFeedback('Pop-up blocked. Allow pop-ups to share.'); return } win.opener = null; win.location.replace(target) }
    notify(channel)
  }
  const download = () => {
    if (!qrSvg) return
    const blob = new Blob([qrSvg], { type: 'image/svg+xml' })
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = href; a.download = 'share-qr.svg'; document.body.append(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(href), 1000)
    notify('qr-download')
  }
  const perform = (channel: IconName) => {
    setFeedback('')
    if (channel === 'link') return copy()
    if (channel === 'more') return setView('more')
    launch(channel)
  }
  const moreActions: [IconName, string, () => void][] = [
    ['mail', 'Email', () => launch('mail')],
    ['message', 'Messages', () => launch('sms')],
    ['download', 'Save to Photos', () => { setView('qr'); setFeedback('A website cannot save directly to Photos. Download the QR and add it from your device.') }],
    ['browser', 'Open in Browser', () => { if (!canShare) return; const win = window.open('', '_blank'); if (!win) { setFeedback('Pop-up blocked. Allow pop-ups to open the link.'); return } win.opener = null; win.location.replace(link); notify('browser') }],
    ['qr', 'Share via QR', () => { setView('qr'); setFeedback('') }],
  ]
  const controls = channels.map(([name, label]) => <button key={name} type="button" disabled={!canShare && name !== 'more'} className="kss-dest" onClick={() => perform(name)} aria-label={label}>
    <span className={`kss-icon kss-${name}`}>{['whatsapp','telegram','x','instagram'].includes(name) ? <Brand name={name as 'whatsapp' | 'telegram' | 'x' | 'instagram'}/> : <Icon name={name} size={20}/>}</span>
    {!isCompact && <span className="kss-label">{label}</span>}
  </button>)
  const content = open && typeof document !== 'undefined' && createPortal(<div className={`kss-root kss-${resolvedTheme}`} data-theme={resolvedTheme}>
      <motion.div className="kss-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }} onPointerDown={(e) => { if (e.target === e.currentTarget) close() }} />
      <motion.div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`kss-sheet ${isCompact && canShare && view === 'share' ? 'kss-sheet-compact' : ''}`} initial={{ opacity: 0, y: reduced ? 0 : 70, scale: reduced ? 1 : .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : 50, scale: .98 }} transition={reduced ? { duration: 0 } : sheetTransition}>
        {isCompact && canShare && view === 'share' ? <><span className="kss-sr" id={titleId}>Share</span><div className="kss-compact-row">{controls}</div></> : <>
          <div className="kss-handle" aria-hidden="true" />
          {view === 'copied' ? <div className="kss-success"><span className="kss-check"><Icon name="check" size={26}/></span><h2 id={titleId}>Link copied!</h2><p>You can now paste it anywhere</p><button type="button" className="kss-done" onClick={close}>Done</button></div> : <>
            <div className="kss-heading"><div>{view !== 'share' && <button type="button" className="kss-back" onClick={() => { setView('share'); setFeedback('') }} aria-label="Back to sharing"><Icon name="back" size={18}/></button>}<h2 id={titleId}>{view === 'more' ? 'More Options' : view === 'qr' ? 'Share via QR' : 'Share'}</h2><p>{view === 'more' ? 'Additional ways to share' : view === 'qr' ? 'Scan the QR code to open the link' : isMessage ? 'Add a message (optional)' : 'Choose where to share'}</p></div><button type="button" onClick={close} className="kss-close" aria-label="Close share sheet"><Icon name="close" size={17}/></button></div>
            {view === 'share' && <>{isMessage && <div className="kss-message"><input value={message} maxLength={206} placeholder="Type a message..." onChange={(e) => setMessage(e.target.value)} aria-label="Optional message"/><span>{message.length}/206</span></div>}<div className="kss-grid">{controls}</div></>}
            {view === 'more' && <div className="kss-list">{moreActions.map(([icon, label, fn]) => <button disabled={!canShare} type="button" key={label} onClick={fn}><Icon name={icon} size={19}/><span>{label}</span><Icon name="arrow" size={16}/></button>)}</div>}
            {view === 'qr' && <div className="kss-qr-wrap"><QrArt url={link} onReady={setQrSvg}/><button type="button" disabled={!qrSvg} className="kss-download" onClick={download}><Icon name="download" size={17}/> Download QR</button></div>}
            {feedback && <p className="kss-feedback" role="status">{feedback}</p>}
            {!canShare && <p className="kss-feedback" role="alert">Pass a valid http or https URL to share.</p>}
          </>}
        </>}
      </motion.div>
    </div>, document.body)
  return <div className={`kss-host kss-host-${resolvedTheme}`}><style>{CSS}</style><button type="button" className="kss-trigger" onClick={openDialog}><Icon name="share" size={20}/> Share</button>{content}</div>
}

export default ShareSheet

const CSS = `
.kss-host{font-family:inherit}.kss-trigger{display:inline-flex;align-items:center;gap:9px;padding:13px 22px;border:1px solid #ffffff15;border-radius:99px;background:#1c2028;color:#f7f8fa;font-size:14px;font-weight:500;font-family:inherit;box-shadow:0 12px 28px #0004;cursor:pointer;transition:transform .18s,background .18s}.kss-host-light .kss-trigger{background:#f1f2f5;color:#1d2229;border-color:#e6e7eb;box-shadow:0 8px 20px #0001}.kss-trigger:hover{transform:translateY(-2px);background:#2a303a}.kss-host-light .kss-trigger:hover{background:#e9ebef}.kss-trigger:focus-visible,.kss-root button:focus-visible{outline:2px solid #ff8751;outline-offset:3px}
.kss-root{--s-bg:#191c22;--s-elev:#22262e;--s-line:#30343c;--s-text:#f5f6f8;--s-muted:#9a9da7;--s-icon:#252a32;position:fixed;inset:0;z-index:9999;font-family:Geist,'Geist Variable',Inter,system-ui,sans-serif;color:var(--s-text)}
.kss-light{--s-bg:#fff;--s-elev:#f4f5f8;--s-line:#e4e6ec;--s-text:#15171c;--s-muted:#696d77;--s-icon:#f1f2f5}


.kss-backdrop{position:absolute;inset:0;background:#06070bc2;backdrop-filter:blur(4px)}.kss-sheet{position:absolute;left:50%;top:50%;width:min(404px,calc(100vw - 28px));min-height:174px;max-height:min(590px,calc(100dvh - 28px));overflow:auto;transform:translate(-50%,-50%);background:var(--s-bg);border:1px solid var(--s-line);border-radius:25px;box-shadow:0 27px 85px #0009;padding:0 20px 20px}
/* Motion animates y while the sheet is horizontally centered by left. */
.kss-sheet{top:auto;bottom:max(22px,calc((100dvh - 430px)/2));margin-left:0;left:calc(50% - min(202px, (100vw - 28px)/2))}.kss-handle{height:4px;width:32px;border-radius:10px;background:var(--s-muted);opacity:.55;margin:9px auto 17px}.kss-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:18px}.kss-heading>div{min-width:0}.kss-heading h2{display:inline-block;margin:0;font-size:15px;font-weight:650;line-height:21px;letter-spacing:-.25px}.kss-heading p{margin:3px 0 0;color:var(--s-muted);font-size:11px;line-height:15px}.kss-close,.kss-back{border:0;color:var(--s-text);background:var(--s-elev);border-radius:50%;width:27px;height:27px;display:inline-grid;place-items:center;cursor:pointer}.kss-back{margin-right:8px;width:24px;height:24px}.kss-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px}.kss-dest{border:0;border-radius:12px;min-width:0;padding:4px 0 3px;color:var(--s-text);background:transparent;display:flex;align-items:center;flex-direction:column;gap:7px;cursor:pointer;transition:background .15s,transform .15s}.kss-dest:hover,.kss-dest:focus-visible{background:var(--s-elev);transform:translateY(-2px)}.kss-dest:disabled{opacity:.35;cursor:not-allowed}.kss-icon{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--s-icon);border:1px solid var(--s-line);box-shadow:0 3px 9px #0003}.kss-whatsapp{background:#19bf59;border-color:#229c52}.kss-telegram{background:#258ed7;border-color:#4097c9}.kss-x{background:#060709;border-color:#3b3e46}.kss-instagram{background:radial-gradient(circle at 25% 100%,#fbbc45 0%,#ee5554 31%,#d6289b 59%,#742cc4 90%);border-color:#be478f}.kss-label{font-size:10px;white-space:nowrap;letter-spacing:-.22px}.kss-success{text-align:center;padding:22px 0 0}.kss-check{margin:0 auto 14px;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#18c982;color:#091712}.kss-success h2{font-size:16px;margin:0}.kss-success p{color:var(--s-muted);font-size:11px;margin:5px 0 22px}.kss-done,.kss-download{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;background:var(--s-elev);color:var(--s-text);border:1px solid var(--s-line);border-radius:25px;height:38px;font-size:11px;font-weight:500;font-family:inherit;cursor:pointer}.kss-list{background:var(--s-elev);border-radius:13px;overflow:hidden}.kss-list button{display:flex;align-items:center;gap:12px;width:100%;height:42px;padding:0 13px;background:transparent;color:var(--s-text);border:0;border-bottom:1px solid var(--s-line);text-align:left;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer}.kss-list button:last-child{border-bottom:0}.kss-list button:hover{background:#8882}.kss-list button span{flex:1}.kss-list button>svg:last-child{color:var(--s-muted)}.kss-qr-wrap{display:flex;align-items:center;flex-direction:column;gap:16px;padding:3px 0 1px}.kss-qr-wrap img{background:#fff;padding:6px;box-sizing:content-box;box-shadow:0 7px 18px #0005}.kss-download{max-width:190px}.kss-message{margin:-6px 0 10px}.kss-message input{width:100%;height:35px;background:var(--s-elev);color:var(--s-text);border:1px solid var(--s-line);border-radius:9px;padding:0 11px;font-size:11px;font-family:inherit;outline:0}.kss-message input:focus{border-color:#848891}.kss-message span{display:block;color:var(--s-muted);text-align:right;font-size:10px;margin-top:3px}.kss-feedback{font-size:11px;line-height:1.45;color:var(--s-muted);margin:13px 0 0}.kss-sheet-compact{width:max-content;min-height:0;padding:10px 12px;border-radius:99px;bottom:max(38px,calc((100dvh - 360px)/2));margin-left:0;left:calc(50% - 130px);overflow:visible}.kss-compact-row{display:flex;gap:3px}.kss-compact-row .kss-dest{padding:0 3px}.kss-compact-row .kss-icon{width:35px;height:35px}.kss-compact-row .kss-icon svg{transform:scale(.83)}.kss-sr{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
@media(max-width:440px){.kss-sheet{left:14px;right:14px;bottom:14px;width:auto;margin-left:0}.kss-sheet-compact{left:calc(50% - 130px);right:auto;bottom:25px;width:max-content;margin-left:0}.kss-label{font-size:9px}.kss-icon{width:37px;height:37px}.kss-grid{gap:1px}}
`

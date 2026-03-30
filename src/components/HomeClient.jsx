"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pl", label: "Polski",  flag: "🇵🇱" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français",flag: "🇫🇷" },
  { code: "it", label: "Italiano",flag: "🇮🇹" },
];

export default function HomeClient({ t, locale, sets }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setUsername("");
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(id) {
    const { data } = await supabase.from("profiles").select("username").eq("id", id).single();
    if (data) setUsername(data.username);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function switchLang(code) {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    window.location.reload();
  }

  const currentLang = LANGUAGES.find(l => l.code === locale) ?? LANGUAGES[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 sticky top-0 z-40 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-400 text-xl">📋</span>
            <span className="font-bold">mybinder.cards</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button onClick={() => setLangOpen(v => !v)}
                className="flex items-center gap-1.5 text-sm border border-white/10 rounded-lg px-2.5 py-1.5 hover:bg-white/5">
                <span>{currentLang.flag}</span>
                <span className="hidden sm:block">{currentLang.code.toUpperCase()}</span>
                <span className="text-gray-500 text-xs">▾</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 py-1 min-w-[140px]">
                    {LANGUAGES.map(lang => (
                      <button key={lang.code} onClick={() => { switchLang(lang.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-white/5 ${locale === lang.code ? "text-orange-400 font-semibold" : "text-gray-300"}`}>
                        <span>{lang.flag}</span><span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 hidden sm:block">{username || user.email}</span>
                <button onClick={signOut}
                  className="text-sm text-gray-400 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg hover:border-white/40 transition-colors">
                  {t.auth.signOut}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => { setAuthMode("login"); setShowAuth(true); }}
                  className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  {t.auth.signIn}
                </button>
                <button onClick={() => { setAuthMode("register"); setShowAuth(true); }}
                  className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                  {t.auth.getStarted}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-sm text-orange-400 mb-6">
          <span>✨</span><span>{t.hero.badge}</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
          {t.hero.title.split("UniVersus").map((part, i, arr) => (
            <span key={i}>{part}{i < arr.length - 1 && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">UniVersus</span>
            )}</span>
          ))}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">{t.hero.subtitle}</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {user ? (
            <a href={sets[0]?.url} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors">
              {t.hero.goToCollection}
            </a>
          ) : (
            <>
              <button onClick={() => { setAuthMode("register"); setShowAuth(true); }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors">
                {t.hero.cta}
              </button>
              <button onClick={() => { setAuthMode("login"); setShowAuth(true); }}
                className="text-gray-300 hover:text-white px-8 py-3 rounded-xl font-semibold text-lg border border-white/20 hover:border-white/40 transition-colors">
                {t.hero.ctaSignIn}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {[
            { icon: "📷", key: "scanner" },
            { icon: "💰", key: "pricing" },
            { icon: "👥", key: "compare" },
            { icon: "🌍", key: "languages" },
          ].map(f => (
            <div key={f.key} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{t.features[f.key].title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{t.features[f.key].desc}</p>
            </div>
          ))}
        </div>

        {/* Sets */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t.sets.title}</h2>
          <span className="text-sm text-gray-500">{sets.filter(s => s.available).length} sets · {t.sets.soon}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map(set => (
            <div key={set.id} className="relative bg-white/5 border border-white/10 rounded-2xl p-6 group overflow-hidden hover:bg-white/8 transition-all">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${set.colors.from}, ${set.colors.to})` }} />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono text-gray-500">{set.code}</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">{t.sets.available}</span>
                </div>
                <h3 className="font-bold text-white text-xl mb-1">{set.name}</h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  {set.descriptions[locale] || set.descriptions.en}
                </p>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs text-gray-500">{set.totalCards} {t.sets.cards}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-500">{t.sets.released} {new Date(set.releaseDate).toLocaleDateString(locale, { month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {set.characters.slice(0, 4).map(c => (
                    <span key={c} className="text-[11px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                  {set.characters.length > 4 && (
                    <span className="text-[11px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">+{set.characters.length - 4}</span>
                  )}
                </div>
                <a href={set.url} className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm text-white transition-colors"
                  style={{ background: `linear-gradient(135deg, ${set.colors.from}, ${set.colors.to})` }}>
                  {t.sets.browse}
                </a>
              </div>
            </div>
          ))}

          <div className="border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="text-3xl mb-3 opacity-40">🃏</div>
            <p className="text-gray-500 text-sm font-medium">{t.sets.comingSoonSets}</p>
            <p className="text-gray-600 text-xs mt-1">{t.sets.comingSoonDesc}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span className="text-orange-400">📋</span>
            <span>mybinder.cards</span>
            <span>·</span>
            <span>{t.footer.unofficial}</span>
          </div>
          <p className="text-xs text-gray-600">{t.footer.disclaimer}</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && <AuthModal t={t} mode={authMode} onClose={() => setShowAuth(false)} onModeChange={setAuthMode} />}
    </div>
  );
}

function AuthModal({ t, mode, onClose, onModeChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").upsert({ id: data.user.id, username, public: false });
          await supabase.rpc("give_signup_bonus", { p_user_id: data.user.id, p_amount: 5 });
        }
        setSuccess(t.auth.checkEmail);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function signInGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">×</button>
        <div className="text-center mb-6">
          <span className="text-2xl">📋</span>
          <h2 className="text-xl font-bold mt-2">mybinder.cards</h2>
        </div>
        <div className="flex rounded-lg bg-white/5 p-1 mb-6">
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { onModeChange(m); setError(""); setSuccess(""); }}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === m ? "bg-white/10 text-white" : "text-gray-500"}`}>
              {m === "login" ? t.auth.signIn : t.auth.register}
            </button>
          ))}
        </div>
        <button onClick={signInGoogle}
          className="w-full flex items-center justify-center gap-2 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 mb-4">
          <GoogleIcon />{t.auth.continueGoogle}
        </button>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center text-xs text-gray-500"><span className="bg-gray-900 px-2">{t.auth.orEmail}</span></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <input type="text" placeholder={t.auth.username} value={username} onChange={e => setUsername(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
          )}
          <input type="email" placeholder={t.auth.email} value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
          <input type="password" placeholder={t.auth.password} value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {success && <p className="text-emerald-400 text-xs">{success}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg px-4 py-2.5 text-sm font-semibold">
            {loading ? "…" : mode === "login" ? t.auth.signIn : t.auth.createAccount}
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

import { NuonLogo, NuonLogoHorizontal, NuonIcon } from './NuonLogo';

export function LogoShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-gray-900 mb-2">NUON Logo System</h1>
          <p className="text-gray-600">Complete brand identity showcase</p>
        </div>

        {/* Main Logo - Default */}
        <section className="bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-gray-900 mb-6">Main Logo - Default Variant</h2>
          <p className="text-gray-600 mb-8">Use on light backgrounds</p>
          <div className="flex justify-center">
            <div className="text-center">
              <NuonLogo variant="default" showTagline={true} />
              <p className="text-xs text-gray-500 mt-4">With Tagline</p>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <div className="text-center">
              <NuonLogo variant="default" showTagline={false} />
              <p className="text-xs text-gray-500 mt-4">Without Tagline</p>
            </div>
          </div>
        </section>

        {/* Main Logo - White Variant */}
        <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-12 shadow-lg">
          <h2 className="text-white mb-6">Main Logo - White Variant</h2>
          <p className="text-white/80 mb-8">Use on dark backgrounds</p>
          <div className="flex justify-center">
            <div className="text-center">
              <NuonLogo variant="white" showTagline={true} />
              <p className="text-xs text-white/70 mt-4">With Tagline</p>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <div className="text-center">
              <NuonLogo variant="white" showTagline={false} />
              <p className="text-xs text-white/70 mt-4">Without Tagline</p>
            </div>
          </div>
        </section>

        {/* Horizontal Logo - Default */}
        <section className="bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-gray-900 mb-6">Horizontal Logo - Default</h2>
          <p className="text-gray-600 mb-8">Ideal for navigation bars and headers</p>
          <div className="space-y-6">
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-xl">
              <NuonLogoHorizontal height={32} variant="default" />
              <span className="ml-auto text-xs text-gray-500">32px</span>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-xl">
              <NuonLogoHorizontal height={48} variant="default" />
              <span className="ml-auto text-xs text-gray-500">48px</span>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-xl">
              <NuonLogoHorizontal height={64} variant="default" />
              <span className="ml-auto text-xs text-gray-500">64px</span>
            </div>
          </div>
        </section>

        {/* Horizontal Logo - White */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-lg">
          <h2 className="text-white mb-6">Horizontal Logo - White</h2>
          <p className="text-white/80 mb-8">For dark theme navigation</p>
          <div className="space-y-6">
            <div className="flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <NuonLogoHorizontal height={32} variant="white" />
              <span className="ml-auto text-xs text-white/70">32px</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <NuonLogoHorizontal height={48} variant="white" />
              <span className="ml-auto text-xs text-white/70">48px</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <NuonLogoHorizontal height={64} variant="white" />
              <span className="ml-auto text-xs text-white/70">64px</span>
            </div>
          </div>
        </section>

        {/* Icon Only */}
        <section className="bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-gray-900 mb-6">Icon Only - Default</h2>
          <p className="text-gray-600 mb-8">For app icons, avatars, and small spaces</p>
          <div className="flex flex-wrap gap-8 justify-center items-end">
            <div className="text-center">
              <NuonIcon size={32} variant="default" />
              <p className="text-xs text-gray-500 mt-4">32px</p>
            </div>
            <div className="text-center">
              <NuonIcon size={48} variant="default" />
              <p className="text-xs text-gray-500 mt-4">48px</p>
            </div>
            <div className="text-center">
              <NuonIcon size={64} variant="default" />
              <p className="text-xs text-gray-500 mt-4">64px</p>
            </div>
            <div className="text-center">
              <NuonIcon size={96} variant="default" />
              <p className="text-xs text-gray-500 mt-4">96px</p>
            </div>
            <div className="text-center">
              <NuonIcon size={128} variant="default" />
              <p className="text-xs text-gray-500 mt-4">128px</p>
            </div>
          </div>
        </section>

        {/* Icon Only - White */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-12 shadow-lg">
          <h2 className="text-white mb-6">Icon Only - White</h2>
          <p className="text-white/80 mb-8">For dark backgrounds and login screens</p>
          <div className="flex flex-wrap gap-8 justify-center items-end">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <NuonIcon size={32} variant="white" />
              </div>
              <p className="text-xs text-white/70 mt-4">32px</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <NuonIcon size={48} variant="white" />
              </div>
              <p className="text-xs text-white/70 mt-4">48px</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <NuonIcon size={64} variant="white" />
              </div>
              <p className="text-xs text-white/70 mt-4">64px</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <NuonIcon size={96} variant="white" />
              </div>
              <p className="text-xs text-white/70 mt-4">96px</p>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-gray-900 mb-6">Usage Examples</h2>
          
          {/* App Header Example */}
          <div className="mb-8">
            <h3 className="text-gray-700 mb-4">App Header</h3>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <NuonLogoHorizontal height={40} variant="default" />
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Menu</button>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Login</button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Card Example */}
          <div className="mb-8">
            <h3 className="text-gray-700 mb-4">Profile Card</h3>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center">
                  <NuonIcon size={40} variant="white" />
                </div>
                <div>
                  <h4 className="text-white">Welcome to NUON</h4>
                  <p className="text-sm text-white/80">Healthcare Excellence Platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State Example */}
          <div>
            <h3 className="text-gray-700 mb-4">Loading State</h3>
            <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-pulse">
                  <NuonIcon size={64} variant="default" />
                </div>
                <p className="text-sm text-gray-600 mt-4">Loading...</p>
              </div>
            </div>
          </div>
        </section>

        {/* Symbolism Explanation */}
        <section className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-12">
          <h2 className="text-gray-900 mb-6">Logo Design & Symbolism</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏮</span>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-2">Hanging Lamp Above "U"</h4>
                  <p className="text-sm text-gray-600">Florence Nightingale's iconic lamp hangs gracefully above the letter "U" in NUON - symbolizing how nursing heritage illuminates and guides the platform.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-2">Striped Lantern Design</h4>
                  <p className="text-sm text-gray-600">The lamp features horizontal stripes creating a traditional lantern appearance with a gentle glow animation, representing the eternal light of nursing care.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-2">Tagline: "Nurse United, Opportunities Nourished"</h4>
                  <p className="text-sm text-gray-600">A powerful mission statement that emphasizes unity in the nursing community and nurturing professional growth.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-2">Clean Wordmark Design</h4>
                  <p className="text-sm text-gray-600">Bold, modern NUON typography with the lamp suspended above, creating a professional and memorable brand identity that honors nursing heritage.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="text-gray-900 mb-3">Design Philosophy</h4>
            <p className="text-gray-600 mb-3">The NUON logo represents:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span><strong>Unity:</strong> "Nurse United" - bringing nurses together in a supportive community</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Growth:</strong> "Opportunities Nourished" - cultivating professional development and career advancement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span><strong>Heritage:</strong> The hanging lamp honors Florence Nightingale's legacy, illuminating the path forward</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span><strong>Guidance:</strong> The lamp hangs above, symbolizing enlightenment and leadership in nursing education</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Color Palette */}
        <section className="bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-gray-900 mb-6">Brand Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-full h-24 rounded-xl bg-purple-600 shadow-lg mb-2"></div>
              <p className="text-xs font-mono">#9333EA</p>
              <p className="text-xs text-gray-600">Purple</p>
            </div>
            <div className="text-center">
              <div className="w-full h-24 rounded-xl bg-blue-600 shadow-lg mb-2"></div>
              <p className="text-xs font-mono">#3B82F6</p>
              <p className="text-xs text-gray-600">Blue</p>
            </div>
            <div className="text-center">
              <div className="w-full h-24 rounded-xl bg-cyan-600 shadow-lg mb-2"></div>
              <p className="text-xs font-mono">#06B6D4</p>
              <p className="text-xs text-gray-600">Cyan</p>
            </div>
            <div className="text-center">
              <div className="w-full h-24 rounded-xl bg-pink-600 shadow-lg mb-2"></div>
              <p className="text-xs font-mono">#EC4899</p>
              <p className="text-xs text-gray-600">Pink</p>
            </div>
            <div className="text-center">
              <div className="w-full h-24 rounded-xl bg-orange-600 shadow-lg mb-2"></div>
              <p className="text-xs font-mono">#F97316</p>
              <p className="text-xs text-gray-600">Orange</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-sm text-gray-500">
            NUON Brand Identity System v1.0
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Created for healthcare professionals who deserve excellence
          </p>
        </div>
      </div>
    </div>
  );
}

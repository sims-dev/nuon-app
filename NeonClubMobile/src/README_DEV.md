Developer README — Neon Club Mobile (src)

Setup

1) Set backend URL
   - Edit `src/utils/config.js` and set `API_BASE_URL` to your backend LAN IP. Example:
     API_BASE_URL: 'http://192.168.0.101:5000/api'

2) Start app
   - npm install
   - npx react-native run-android

Auth contract

- Login (POST /login) -> response should include { token, user }
- The app stores `token` and `user` in AsyncStorage via AuthContext

Notes on changes made by integration work

- `src/contexts/AuthContext.js` added: centralizes auth state and token restore
- `src/services/api.js` updated to try multiple catalog endpoints and export `getBaseURL()`
- `src/components/Loader.js` and `src/components/Toast.js` added for shared UI
- `src/navigation/AppNavigator.js` updated to use `AuthProvider`
- LoginScreen, ProfileScreen and HomeScreen wired to AuthContext

Testing checklist

- Update backend IP and ensure backend is reachable from device.
- Test POST /login with valid credentials (curl or Postman). Confirm token and user in response.
- Run app and attempt login. App should navigate to Main and show user name on Home.

If anything fails, copy error text and I will help debug further.

Performance and stability additions (2025-10-24)

- Async pattern: `src/hooks/useAsync.js`
   - Contract: returns `{ data, error, loading, run, reset }` for any async fn.
   - Use to avoid conditional hooks and to standardize loading state.

- Debounced/safe presses: `src/hooks/useSafePress.js`
   - Wrap navigation or network actions to prevent rapid double-taps.
   - Example: `const onPress = useSafePress(() => navigation.navigate('Foo'));`

- Skeletons: `src/components/Skeleton.js`
   - `Skeleton` and `SkeletonList` components for instant perceived loading.

- Error boundary: `src/components/ErrorBoundary.js` and `App.tsx` wrapper
   - Catches render-time errors and shows a friendly message instead of crashing.

- API caching: `src/services/api.js`
   - Lightweight 60s in-memory cache for common GET endpoints (courses, events, workshops, mentors).
   - Transparent; no code changes required in callers using API wrappers.

- Navigation fixes
   - Registered missing `Catalog` route in `AppNavigator` so `navigation.navigate('Catalog')` works.

How to adopt safe press globally (optional)

- Create a `SafeTouchable` wrapper using `useSafePress` and swap imports incrementally in screens where users rapidly tap actions.

OTP options (temporary 2Factor integration)

- Edit `src/utils/config.js` and set:
   - `OTP_PROVIDER: '2factor'`
   - `TWO_FACTOR_API_KEY: 'XXXX-XXXX-XXXX-XXXX-XXXX'` (replace with your key)
- When enabled and you choose phone OTP, the app will call
   `GET https://2factor.in/API/V1/<KEY>/SMS/+91<digits>/<random5>/OTP1` directly and move to Verify.
- Verification in this mode is local: the code you received must match the UI input. This is meant for fast demos only. Switch back to `OTP_PROVIDER: 'backend'` for production.


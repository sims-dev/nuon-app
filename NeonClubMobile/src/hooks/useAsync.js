import { useCallback, useEffect, useRef, useState } from 'react';

// Tiny contract
// input: async function (fn), deps
// output: { data, error, loading, run, reset }
export default function useAsync(fn, deps = [], { immediate = true, initialData = null } = {}) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const mountedRef = useRef(true);
  const [state, setState] = useState({ data: initialData, error: null, loading: !!immediate });

  const run = useCallback(async (...args) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const result = await fnRef.current(...args);
      if (mountedRef.current) setState({ data: result, error: null, loading: false });
      return result;
    } catch (err) {
      if (mountedRef.current) setState(s => ({ ...s, error: err, loading: false }));
      throw err;
    }
  }, []);

  const reset = useCallback(() => setState({ data: initialData, error: null, loading: !!immediate }), [immediate, initialData]);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      // fire and forget, don't throw
      run().catch(() => {});
    }
    return () => { mountedRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, run, reset };
}

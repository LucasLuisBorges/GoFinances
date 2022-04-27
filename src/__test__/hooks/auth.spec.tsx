import { renderHook } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../../Hooks/auth';

describe('Auth Hook',() => {
  it('should be able to sign in with Google account existing', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await waitForNextUpdate();
    console.log(result)
  });
});
import { renderHook, act } from '@testing-library/react-hooks'
import { mocked } from "jest-mock"
import fetchMock from 'jest-fetch-mock'
import { AuthProvider, useAuth } from '../../Hooks/auth'
import { startAsync } from 'expo-auth-session'
import AsyncStorage from '@react-native-async-storage/async-storage'

fetchMock.enableMocks()

const userTest = {
  id: 'any_id',
  email: 'lucasluisborges1205@gmail.com',
  name: 'Lucas',
  photo: 'any_photo.png'
}

jest.mock('expo-auth-session');

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}));

describe('Auth Hook', () => {

  it('should be able to sign in with Google account existing', async () => {
    const googleMocked = mocked(startAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'success',
      params: {
        access_token: 'any_token'
      }
    })

    fetchMock.mockResponseOnce(JSON.stringify(userTest))

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user.email).toBe(userTest.email)
  })

  it('user should not connect if cancel authentication with Google', async () => {
    const googleMocked = mocked(startAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'cancel'
    })

    fetchMock.mockResponseOnce(JSON.stringify(userTest))

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user).not.toHaveProperty('id')
  })
})

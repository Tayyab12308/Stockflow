jest.mock('jquery');
import { login, logout, signup } from '../session_api_util';

jest.spyOn($, 'ajax').mockImplementation(() => Promise.resolve({ data: 'custom data' }));

describe('session_api_util', () => {
  beforeEach(() => {
    jest.spyOn($, 'ajax').mockImplementation(() => Promise.resolve({}));
  });

  afterEach(() => {
    $.ajax.mockRestore();
  });

  test('login calls $.ajax with the correct parameters', async () => {
    const user = { email: 'test@example.com', password: 'secret' };
    await login(user);
    expect($.ajax).toHaveBeenCalledWith({
      method: "POST",
      url: '/api/session',
      data: { user },
    });
  });

  test('logout calls $.ajax with the correct parameters', async () => {
    await logout();
    expect($.ajax).toHaveBeenCalledWith({
      method: "DELETE",
      url: '/api/session',
    });
  });

  test('signup calls $.ajax with the correct parameters', async () => {
    const user = { email: 'test@example.com', password: 'secret' };
    await signup(user);
    expect($.ajax).toHaveBeenCalledWith({
      method: "POST",
      url: '/api/users',
      data: { user },
    });
  });
});
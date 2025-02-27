const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");

export const login = user => (
  $.ajax({
    method: "POST",
    url: '/api/session',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: { user },
  })
);

export const logout = () => (
  $.ajax({
    method: "DELETE",
    url: '/api/session',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
  })
);

export const signup = user => (
  $.ajax({
    method: "POST",
    url: '/api/users',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': "application/x-www-form-urlencoded"
    },
    data: { user },
  })
);
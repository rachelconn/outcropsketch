import Cookies from 'js-cookie';

/**
 * Determines if the user is logged in using the sessionid cookie given by Django when authenticated.
 * @returns Whether the user is currently logged in
 */
export function isLoggedIn(): boolean {
  return Boolean(Cookies.get('sessionid'));
}

export function logout(): Promise<Response> {
  return fetch('/auth/logout', {
    method: 'POST',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  }).then((response) => {
    if (response.ok) window.location.replace('/');
    return response;
  }).catch((e) => {
    console.error(e);
    return Promise.resolve(new Response());
  });
}

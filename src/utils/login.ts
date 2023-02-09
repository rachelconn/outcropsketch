import Cookies from 'js-cookie';

/**
 * Determines if the user is logged in using the sessionid cookie given by Django when authenticated.
 * @returns Whether the user is currently logged in
 */
export function isLoggedIn(): boolean {
  return Boolean(Cookies.get('sessionid'));
}

export function logout(): void {
  fetch('/auth/logout', {
    method: 'POST',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  }).then((response) => {
    if (!response.ok) throw Error('Logout request failed.');
    window.location.replace('/');
  }).catch(() => {
    // TODO: create modal saying that logout failed
    console.log('Logout failed. Please try again later.');
  });
}

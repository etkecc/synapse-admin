// Homeserver-URL helpers shared by the login page and its sections; own module avoids a circular import via LoginPage.

export const isValidIssuer = (issuer: string): boolean => {
  // True for a well-formed HTTP(S) issuer with no query/fragment (RFC 8414 §2); accepts http: for local-dev MAS.
  try {
    const { protocol, search, hash } = new URL(issuer);
    return (protocol === "https:" || protocol === "http:") && search === "" && hash === "";
  } catch {
    return false;
  }
};

// Default protocol for a bare homeserver host: http for localhost/loopback, https otherwise.
export const getDefaultProtocolForHomeserverInput = (value: string): "http" | "https" => {
  const normalizedValue = value.trim().replace(/\/+$/g, "");

  if (
    /^(localhost|127\.0\.0\.1)(:\d{1,5})?$/i.test(normalizedValue) ||
    /^::1$/i.test(normalizedValue) ||
    /^\[::1\](:\d{1,5})?$/i.test(normalizedValue)
  ) {
    return "http";
  }

  return "https";
};

/** Prepend the default protocol when the user typed a bare host. */
export const prependDefaultProtocol = (value: string): string => {
  if (value.match(/^https?:\/\//)) {
    return value;
  }

  return `${getDefaultProtocolForHomeserverInput(value)}://${value}`;
};

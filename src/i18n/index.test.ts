import { resolveBrowserLocale } from "react-admin";

import { createI18nProvider } from ".";

jest.mock("react-admin", () => ({
  resolveBrowserLocale: jest.fn(() => "en"),
}));

const mockedResolveBrowserLocale = resolveBrowserLocale as jest.MockedFunction<typeof resolveBrowserLocale>;

describe("createI18nProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "";
    document.documentElement.dir = "";
    mockedResolveBrowserLocale.mockReturnValue("en");
  });

  describe("initial locale resolution", () => {
    it("should default to en when browser locale is unsupported", async () => {
      mockedResolveBrowserLocale.mockReturnValue("xx");

      const provider = await createI18nProvider();
      expect(provider.getLocale()).toBe("en");
      expect(document.documentElement.lang).toBe("en");
    });

    it("should use browser locale when supported", async () => {
      mockedResolveBrowserLocale.mockReturnValue("de");

      const provider = await createI18nProvider();
      expect(provider.getLocale()).toBe("de");
      expect(document.documentElement.lang).toBe("de");
    });

    it("should prefer RaStore.locale over browser locale", async () => {
      localStorage.setItem("RaStore.locale", JSON.stringify("fr"));
      mockedResolveBrowserLocale.mockReturnValue("de");

      const provider = await createI18nProvider();
      expect(provider.getLocale()).toBe("fr");
      expect(document.documentElement.lang).toBe("fr");
    });

    it("should fall back to browser locale when RaStore.locale has malformed JSON", async () => {
      localStorage.setItem("RaStore.locale", "not-json");
      mockedResolveBrowserLocale.mockReturnValue("de");

      const provider = await createI18nProvider();
      expect(provider.getLocale()).toBe("de");
    });

    it("should fall back to browser locale when RaStore.locale has unsupported value", async () => {
      localStorage.setItem("RaStore.locale", JSON.stringify("xx"));
      mockedResolveBrowserLocale.mockReturnValue("ja");

      const provider = await createI18nProvider();
      expect(provider.getLocale()).toBe("ja");
    });
  });

  describe("html lang and dir attributes", () => {
    it("should set lang on initial load", async () => {
      mockedResolveBrowserLocale.mockReturnValue("it");

      await createI18nProvider();
      expect(document.documentElement.lang).toBe("it");
      expect(document.documentElement.dir).toBe("ltr");
    });

    it("should set dir=rtl for Farsi", async () => {
      mockedResolveBrowserLocale.mockReturnValue("fa");

      await createI18nProvider();
      expect(document.documentElement.lang).toBe("fa");
      expect(document.documentElement.dir).toBe("rtl");
    });

    it("should switch back to ltr when changing from Farsi to another locale", async () => {
      mockedResolveBrowserLocale.mockReturnValue("fa");

      const provider = await createI18nProvider();
      expect(document.documentElement.dir).toBe("rtl");

      await provider.changeLocale("en");
      expect(document.documentElement.dir).toBe("ltr");
    });

    it("should update lang on changeLocale", async () => {
      const provider = await createI18nProvider();
      expect(document.documentElement.lang).toBe("en");

      await provider.changeLocale("uk");
      expect(document.documentElement.lang).toBe("uk");
    });
  });

  describe("lazy loading and caching", () => {
    it("should return English translations for en locale", async () => {
      const provider = await createI18nProvider();

      const translation = provider.translate("synapseadmin.auth.base_url");
      expect(translation).toBe("Homeserver URL");
    });

    it("should merge non-en locale with English as fallback", async () => {
      mockedResolveBrowserLocale.mockReturnValue("de");

      const provider = await createI18nProvider();

      // German-specific key
      const deTranslation = provider.translate("synapseadmin.auth.base_url");
      expect(deTranslation).toBe("Heimserver URL");
    });

    it("should lazy-load a locale not loaded at init", async () => {
      const provider = await createI18nProvider();

      await provider.changeLocale("ru");
      const translation = provider.translate("synapseadmin.auth.base_url");
      expect(translation).toBe("Адрес домашнего сервера");
    });

    it("should return English translations for unsupported locale", async () => {
      const provider = await createI18nProvider();

      await provider.changeLocale("xx");
      expect(document.documentElement.lang).toBe("en");
    });

    it("should cache loaded locales and not re-import", async () => {
      const provider = await createI18nProvider();

      // Load zh for the first time
      await provider.changeLocale("zh");
      const first = provider.translate("synapseadmin.auth.base_url");

      // Switch away and back
      await provider.changeLocale("en");
      await provider.changeLocale("zh");
      const second = provider.translate("synapseadmin.auth.base_url");

      expect(first).toBe(second);
      expect(first).toBe("服务器 URL");
    });
  });

  describe("available locales", () => {
    it("should expose all 9 supported locales", async () => {
      const provider = await createI18nProvider();
      const locales = provider.getLocales!();

      expect(locales).toHaveLength(9);
      expect(locales.map(l => l.locale)).toEqual(
        expect.arrayContaining(["en", "de", "fa", "fr", "it", "ja", "ru", "uk", "zh"])
      );
    });
  });
});


const REST_COUNTRIES_API = "https://restcountries.com/v3.1/name/";

export async function getCountryInfo(countryName: string) {
  try {
    const res = await fetch(`${REST_COUNTRIES_API}${encodeURIComponent(countryName)}?fields=capital,area,population,currencies,languages,borders`);
    if (!res.ok) return null;
    const [info] = await res.json();
    if (!info) return null;

    return {
      capital: info.capital?.[0],
      area: info.area,
      population: info.population,
      currencies: info.currencies ? Object.values(info.currencies).map((c: any) => c.name) : [],
      languages: info.languages ? Object.values(info.languages) : [],
      borders: info.borders || []
    };
  } catch (err) {
    console.warn("[restCountriesApi] Data fetch failed", err);
    return null;
  }
}
